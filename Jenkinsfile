pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        PATH = "/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin:${env.PATH}"

        IMAGE_NAME = "lingala89/used-car-marketplace"
        IMAGE_TAG = "latest"

        CONTAINER_NAME = "used-car-marketplace"
        CONTAINER_PORT = "8083"

        K8S_DEPLOYMENT = "used-car-marketplace"
        K8S_SERVICE = "used-car-marketplace-service"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Git Information') {
            steps {
                sh '''
                echo "========== USER =========="
                whoami

                echo "========== WORKSPACE =========="
                pwd

                echo "========== PATH =========="
                echo $PATH

                echo "========== GIT VERSION =========="
                git --version

                echo "========== GIT STATUS =========="
                git status || true

                echo "========== LAST COMMIT =========="
                git log --oneline -1
                '''
            }
        }

        stage('Verify Docker') {
            steps {
                sh '''
                echo "========== DOCKER =========="

                which docker
                docker --version
                docker info
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .
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

        stage('Docker Login') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
                    sh '''
                    echo "$DOCKER_PASS" | docker login \
                    -u "$DOCKER_USER" \
                    --password-stdin
                    '''
                }
            }
        }

        stage('Docker Push') {
            steps {
                sh '''
                docker push ${IMAGE_NAME}:${IMAGE_TAG}
                '''
            }
        }

        stage('Docker Pull') {
            steps {
                sh '''
                docker pull ${IMAGE_NAME}:${IMAGE_TAG}
                '''
            }
        }

        stage('Remove Old Container') {
            steps {
                sh '''
                docker rm -f ${CONTAINER_NAME} || true
                '''
            }
        }

        stage('Run Docker Container') {
            steps {
                sh '''
                docker run -d \
                --name ${CONTAINER_NAME} \
                -p ${CONTAINER_PORT}:80 \
                ${IMAGE_NAME}:${IMAGE_TAG}
                '''
            }
        }

        stage('Docker Logs') {
            steps {
                sh '''
                docker logs ${CONTAINER_NAME} || true
                '''
            }
        }

        stage('Docker Copy') {
            steps {
                sh '''
                mkdir -p backup

                docker cp \
                ${CONTAINER_NAME}:/usr/share/nginx/html/index.html \
                backup/index.html || true
                '''
            }
        }

        stage('Kubernetes Deploy') {
            steps {
                sh '''
                kubectl apply -f k8s/deployment.yaml
                kubectl apply -f k8s/service.yaml
                '''
            }
        }

        stage('Rollout Status') {
            steps {
                sh '''
                kubectl rollout status deployment/${K8S_DEPLOYMENT} --timeout=180s
                '''
            }
        }

        stage('Verify Kubernetes') {
            steps {
                sh '''
                echo "===== Deployments ====="
                kubectl get deployments

                echo "===== Pods ====="
                kubectl get pods -o wide

                echo "===== Services ====="
                kubectl get svc

                echo "===== Nodes ====="
                kubectl get nodes
                '''
            }
        }

        stage('Application Test') {
            steps {
                sh '''
                kubectl get svc ${K8S_SERVICE}
                '''
            }
        }

        stage('Cleanup') {
            steps {
                sh '''
                docker image prune -f || true
                docker container prune -f || true
                '''
            }
        }
    }

    post {

        success {
            echo '================================='
            echo 'BUILD SUCCESSFUL'
            echo '================================='

            sh '''
            echo "Docker Image:"
            docker images | grep networksource || true

            echo "Running Containers:"
            docker ps || true
            '''
        }

        failure {
            echo '================================='
            echo 'BUILD FAILED'
            echo '================================='

            sh '''
            echo "Rolling back Kubernetes deployment..."

            kubectl rollout undo deployment/${K8S_DEPLOYMENT} || true

            kubectl get deployments || true
            kubectl get pods || true
            '''
        }

        always {
            echo 'Cleaning workspace...'
            cleanWs()
        }
    }
}