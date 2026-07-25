pipeline {
    agent any

    environment {
        APP_NAME = "used-car-marketplace"
        DOCKER_IMAGE = "lingala89/used-car-marketplace:latest"

        EC2_HOST = "YOUR_EC2_PUBLIC_IP"
        EC2_USER = "ubuntu"

        SSH_CREDENTIALS = "used-car-key"
    }

    stages {

        stage('Deploy to AWS EC2') {
            steps {
                sshagent(credentials: ['used-car-key']) {

                    bat """
                    ssh -o StrictHostKeyChecking=no %EC2_USER%@%EC2_HOST% ^
                    "docker pull %DOCKER_IMAGE% && ^
                    docker stop %APP_NAME% || true && ^
                    docker rm %APP_NAME% || true && ^
                    docker run -d --name %APP_NAME% --restart always -p 80:80 %DOCKER_IMAGE%"
                    """

                }
            }
        }

        stage('Verify Deployment') {
            steps {
                sshagent(credentials: ['used-car-key']) {

                    bat """
                    ssh -o StrictHostKeyChecking=no %EC2_USER%@%EC2_HOST% ^
                    "docker ps"
                    """

                }
            }
        }
    }

    post {

        success {
            echo "=================================="
            echo "Deployment Successful"
            echo "Application is running on EC2"
            echo "=================================="
        }

        failure {
            echo "=================================="
            echo "Deployment Failed"
            echo "Check Jenkins Console Output"
            echo "=================================="
        }
    }
}