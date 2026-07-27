pipeline {
    agent any

    environment {
        PATH = "/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

        APP_NAME = "used-car-marketplace"

        DOCKER_IMAGE = "lingala89/used-car-marketplace"

        IMAGE_TAG = "${BUILD_NUMBER}"

        DOCKER_CREDENTIALS = "dockerhub-creds"

        EC2_HOST = "YOUR_EC2_PUBLIC_IP"
        EC2_USER = "ubuntu"
        SSH_CREDENTIALS = "used-car-key"
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
                echo "Docker Version"
                docker --version

                echo "Docker Info"
                docker info
                '''
            }
        }

        stage('Clean Old Images') {
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

        stage('Push Image') {
            steps {
                sh '''
                docker push ${DOCKER_IMAGE}:${IMAGE_TAG}
                docker push ${DOCKER_IMAGE}:latest
                '''
            }
        }

        stage('AWS Login') {
            steps {
                sshagent(credentials: ["${SSH_CREDENTIALS}"]) {
                    sh '''
                    ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} "
                        hostname
                        docker --version
                    "
                    '''
                }
            }
        }

        stage('Deploy to AWS EC2') {
            steps {
                sshagent(credentials: ["${SSH_CREDENTIALS}"]) {
                    sh '''
                    ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} "

                        docker pull ${DOCKER_IMAGE}:latest

                        docker stop ${APP_NAME} || true

                        docker rm ${APP_NAME} || true

                        docker run -d \
                            --name ${APP_NAME} \
                            --restart always \
                            -p 80:80 \
                            ${DOCKER_IMAGE}:latest

                        docker ps
                    "
                    '''
                }
            }
        }

        stage('Verify Website') {
            steps {
                sshagent(credentials: ["${SSH_CREDENTIALS}"]) {
                    sh '''
                    ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} "

                        docker ps

                        docker images

                    "
                    '''
                }
            }
        }

        stage('Cleanup Jenkins') {
            steps {
                sh '''
                docker image prune -f
                '''
            }
        }
    }

    post {

        success {
            echo "=========================================="
            echo "Build Successful"
            echo "Docker Build Completed"
            echo "Docker Image Pushed"
            echo "AWS Deployment Successful"
            echo "=========================================="
        }

        failure {
            echo "=========================================="
            echo "Pipeline Failed"
            echo "Check Jenkins Console Output"
            echo "=========================================="
        }

        always {
            cleanWs()
        }
    }
}