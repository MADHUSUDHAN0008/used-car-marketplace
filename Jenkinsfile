pipeline {
    agent any

    stages {
        stage('Test Docker') {
            steps {
                sh '''
                echo "PATH=$PATH"
                which docker
                docker --version
                docker info
                '''
            }
        }
    }
}