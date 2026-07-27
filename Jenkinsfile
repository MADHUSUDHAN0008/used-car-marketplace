pipeline {
    agent any

    environment {
        AWS_REGION = "ap-south-1"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Configure AWS') {

            steps {

                withCredentials([
                    usernamePassword(
                        credentialsId: 'aws-creds',
                        usernameVariable: 'AWS_ACCESS_KEY_ID',
                        passwordVariable: 'AWS_SECRET_ACCESS_KEY'
                    )
                ]) {

                    sh '''
                    aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
                    aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
                    aws configure set region ap-south-1
                    aws configure set output json

                    echo "AWS Configuration"
                    aws configure list

                    echo "Testing AWS Login"
                    aws sts get-caller-identity
                    '''

                }

            }

        }

    }

    post {

        success {
            echo "AWS Login Successful"
        }

        failure {
            echo "AWS Login Failed"
        }

    }
}