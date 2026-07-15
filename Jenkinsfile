pipeline {
    agent any

    environment {
        APP_NAME = "used-car-marketplace"
        DOCKER_IMAGE = "lingala89/used-car-marketplace"
        IMAGE_TAG = "${BUILD_NUMBER}"
        DOCKER_CREDENTIALS = "dockerhub-creds"

        // Common Docker paths on macOS/Linux
        PATH = "/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:${env.PATH}"
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

        stage('Verify Environment') {
            steps {
                sh '''
                echo "===== Environment Verification ====="

                echo "Current PATH:"
                echo $PATH

                echo "Checking Git..."
                which git
                git --version

                echo "Checking Docker..."
                which docker || exit 1
                docker --version || exit 1

                echo "Checking Docker Daemon..."
                docker ps > /dev/null || exit 1

                echo "Checking kubectl..."
                which kubectl || echo "kubectl not found"

                echo "===================================="
                '''
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
                echo "Building Docker image..."
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
                echo "Pushing Docker images..."
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

                kubectl rollout status deployment/used-car-marketplace --timeout=300s
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                kubectl get deployments
                kubectl get pods
                kubectl get svc
                '''
            }
        }

        stage('Cleanup') {
            steps {
                sh '''
                docker image prune -af || true
                docker logout || true
                '''
            }
        }
    }

    post {

        success {
            echo '==================================='
            echo 'Build completed successfully!'
            echo 'Docker image built and pushed.'
            echo 'Kubernetes deployment completed.'
            echo '==================================='
        }

        failure {
            echo '==================================='
            echo 'Build failed.'
            echo 'Check Jenkins console logs.'
            echo '==================================='
        }

        always {
            cleanWs()
        }
    }
}