pipeline {
    agent any

    environment {
        AWS_REGION = 'ap-south-1'
        AWS = '/opt/homebrew/bin/aws'
    }

    stages {
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
                    $AWS configure set aws_access_key_id "$AWS_ACCESS_KEY_ID"
                    $AWS configure set aws_secret_access_key "$AWS_SECRET_ACCESS_KEY"
                    $AWS configure set region "$AWS_REGION"
                    $AWS configure set output json

                    $AWS configure list
                    $AWS sts get-caller-identity
                    '''
                }
            }
        }
    }
}
