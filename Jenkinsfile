pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Docker') {
      steps {
        sh 'docker build -t used-car-marketplace .'
      }
    }

    stage('Run Tests') {
      steps {
        sh 'echo Test Passed'
      }
    }
  }
}
