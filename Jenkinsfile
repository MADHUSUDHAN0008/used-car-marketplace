pipeline {
    agent any

    environment {
        PATH = "/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

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
                checkout scm
            }
        }

        stage('Verify Docker') {
            steps {
                sh '''
                docker --version
                docker info
                '''
            }
        }

        stage('Clean Docker') {
            steps {
                sh '''
                docker system prune -af || true
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                docker build -t ${DOCKER_IMAGE}:${IMAGE_TAG} .
                docker tag ${DOCKER_IMAGE}:${IMAGE_TAG} ${DOCKER_IMAGE}:latest
                '''
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
                sh '''
                docker push ${DOCKER_IMAGE}:${IMAGE_TAG}
                docker push ${DOCKER_IMAGE}:latest
                '''
            }
        }

        stage('Docker Images') {
            steps {
                sh '''
                docker images
                '''
            }
        }

        stage('Cleanup') {
            steps {
                sh '''
                docker image prune -f
                '''
            }
        }
    }

    post {

        success {
            echo "===================================="
            echo "Build Successful"
            echo "Docker Image Built"
            echo "Docker Image Pushed to Docker Hub"
            echo "===================================="
        }

        failure {
            echo "===================================="
            echo "Build Failed"
            echo "Check Jenkins Console Output"
            echo "===================================="
        }

        always {
            cleanWs()
        }
    }
}