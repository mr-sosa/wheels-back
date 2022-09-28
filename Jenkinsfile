pipeline {
    agent any
    environment {
       GIT_REPO = 'wheels-back'
       GIT_CREDENTIAL_ID = 'de5cd571-10da-4034-8ba8-af99beef4b14'
       SONARQUBE_URL = 'http://172.24.100.52:8082/sonar-isis2603'
    }
    stages {
       stage('Checkout') {
          steps {
             scmSkip(deleteBuild: true, skipPattern:'.*\\[ci-skip\\].*')
             git branch: 'main',
                credentialsId: env.GIT_CREDENTIAL_ID,
                url: 'https://github.com/SELF-Software-Evolution-Lab/' + env.GIT_REPO
          }
       }
       stage('Git Analysis') {
          // Run git analysis
          steps {
             script {
                docker.image('gitinspector-isis2603').inside('--entrypoint=""') {
                   sh '''
                      mkdir -p ./reports/
                      datetime=$(date +'%Y-%m-%d_%H%M%S')
                      gitinspector --file-types="cs,js,asax,ascx,asmx,aspx,html,fs,ts" --format=html --RxU -w -T -x author:Bocanegra -x author:estudiante > ./reports/index.html
                   '''
                }
             }
             withCredentials([usernamePassword(credentialsId: env.GIT_CREDENTIAL_ID, passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
                sh('git config --global user.email "ci-isis2603@uniandes.edu.co"')
                sh('git config --global user.name "ci-isis2603"')
                sh('git add ./reports/index.html')
                sh('git commit -m "[ci-skip] GitInspector report added"')
                sh('git pull https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/SELF-Software-Evolution-Lab/${GIT_REPO} main')
                sh('git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/SELF-Software-Evolution-Lab/${GIT_REPO} main')
             }
          }
       }
       stage('Build') {
          // Build app
          steps {
             script {
                docker.image('citools-isis2603:latest').inside('-u root') {
                   sh '''
                      npm i -s
                      nest build
                   '''
                }
             }
          }
       }
      stage('Test') {
          steps {
             script {
                docker.image('citools-isis2603:latest').inside('-u root') {
                   sh '''
                      npm run test:cov
                   '''
                }
             }
          }
       }
       stage('Static Analysis') {
          // Run static analysis
          steps {
             sh '''
                docker run --rm -u root -e SONAR_HOST_URL=${SONARQUBE_URL} -v ${WORKSPACE}:/usr/src sonarsource/sonar-scanner-cli:4.3
             '''
          }
       }
    }
    post {
       always {
          // Clean workspace
          cleanWs deleteDirs: true
       }
       cleanup {
            deleteDir()
            dir("${workspace}@tmp") {
                deleteDir()
            }
            dir("${workspace}@script") {
                deleteDir()
            }
       }
    }
  }
  
