pipeline {
    agent any

    environment {
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
                echo "Checking out source code..."
                checkout scm
            }
        }

        stage('Verify Files') {
            steps {
                bat '''
                echo Current Directory
                cd

                echo.
                echo Project Files
                dir
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                bat """
                docker build -t %DOCKER_IMAGE%:%IMAGE_TAG% .
                docker tag %DOCKER_IMAGE%:%IMAGE_TAG% %DOCKER_IMAGE%:latest
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
                    bat '''
                    echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin
                    '''
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                bat """
                docker push %DOCKER_IMAGE%:%IMAGE_TAG%
                docker push %DOCKER_IMAGE%:latest
                """
            }
        }

        stage('Deploy to AWS EC2') {
            steps {
                sshagent(credentials: ["${SSH_CREDENTIALS}"]) {
                    bat """
                    ssh -o StrictHostKeyChecking=no %EC2_USER%@%EC2_HOST% ^
                    "docker pull %DOCKER_IMAGE%:latest && ^
                    docker stop %APP_NAME% || true && ^
                    docker rm %APP_NAME% || true && ^
                    docker run -d --name %APP_NAME% --restart always -p 80:80 %DOCKER_IMAGE%:latest"
                    """
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                sshagent(credentials: ["${SSH_CREDENTIALS}"]) {
                    bat """
                    ssh -o StrictHostKeyChecking=no %EC2_USER%@%EC2_HOST% "docker ps"
                    """
                }
            }
        }

        stage('Cleanup') {
            steps {
                bat '''
                docker image prune -f
                '''
            }
        }
    }

    post {

        success {
            echo "========================================="
            echo "Build Successful"
            echo "Docker Image Built"
            echo "Docker Image Pushed"
            echo "Application Deployed to AWS EC2"
            echo "========================================="
        }

        failure {
            echo "========================================="
            echo "Build Failed"
            echo "Check Jenkins Console Output"
            echo "========================================="
        }

        always {
            cleanWs()
        }
    }
}