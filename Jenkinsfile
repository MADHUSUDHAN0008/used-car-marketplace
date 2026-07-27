pipeline {
    agent any

    stages {

        stage('Check AWS') {

            steps {

                sh '''
                whoami
                which aws
                aws --version
                '''

            }

        }

    }

}
