pipeline {
    agent any

    environment {
        APP_NAME = "used-car-marketplace"
        DOCKER_IMAGE = "lingala89/used-car-marketplace"
        IMAGE_TAG = "${BUILD_NUMBER}"
        DOCKER_CREDENTIALS = "dockerhub-creds"
    }

    options {
        timestamps()
    }

    stages {

        stage('Checkout Source') {
            steps {
                echo "Checking out source code..."
                checkout scm
            }
        }

        stage('Verify Project Files') {
            steps {
                sh '''
                pwd
                ls -la
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                docker build -t ${DOCKER_IMAGE}:${IMAGE_TAG} .
                docker tag ${DOCKER_IMAGE}:${IMAGE_TAG} ${DOCKER_IMAGE}:latest
                """
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: "${DOCKER_CREDENTIALS}",
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
                    sh '''
                    echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                    '''
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                sh """
                docker push ${DOCKER_IMAGE}:${IMAGE_TAG}
                docker push ${DOCKER_IMAGE}:latest
                """
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                kubectl apply -f k8s/deployment.yaml
                kubectl apply -f k8s/service.yaml
                kubectl rollout restart deployment/used-car-marketplace || true
                kubectl rollout status deployment/used-car-marketplace
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                kubectl get pods
                kubectl get svc
                '''
            }
        }

        stage('Cleanup') {
            steps {
                sh """
                docker image prune -f
                """
            }
        }
    }

    post {

        success {
            echo '==================================='
            echo 'Build completed successfully!'
            echo 'Docker image pushed.'
            echo 'Kubernetes deployment completed.'
            echo '==================================='
        }

        failure {
            echo '==================================='
            echo 'Build failed.'
            echo 'Check the Jenkins console output.'
            echo '==================================='
        }

        always {
            cleanWs()
        }
    }
}
