pipeline {
    agent any

    stages {
        stage('Check Docker') {
            steps {
                sh '''
                echo $PATH
                which docker
                docker --version
                '''
            }
        }
    }
}