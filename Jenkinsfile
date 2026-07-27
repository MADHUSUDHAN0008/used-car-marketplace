pipeline {
    agent any

    stages {
        stage('Check AWS') {
            steps {
                sh '''
                echo "Current User:"
                whoami

                echo "PATH:"
                echo $PATH

                echo "AWS Location:"
                which aws || true

                echo "AWS Version:"
                aws --version || true
                '''
            }
        }
    }
}