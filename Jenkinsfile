pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'hyixd/my-simple-app'
        DOCKER_CREDENTIALS_ID = '591671488'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', 
                url: 'https://github.com/andgame32/my-simple-app.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Заменяем версию в HTML
                    sh "sed -i 's/BUILD_VERSION/${BUILD_NUMBER}/' index.html"
                    
                    // Собираем образ
                    docker.build("${DOCKER_IMAGE}:${BUILD_NUMBER}")
                }
            }
        }

        stage('Test Image') {
            steps {
                script {
                    // Простой тест - проверяем что контейнер запускается
                    sh """
                    docker run -d --name test-container ${DOCKER_IMAGE}:${BUILD_NUMBER}
                    sleep 5
                    docker ps | grep test-container
                    docker stop test-container
                    docker rm test-container
                    """
                }
            }
        }

        stage('Deploy to Production') {
            steps {
                script {
                    // Останавливаем старый контейнер
                    sh 'docker stop running-app || true'
                    sh 'docker rm running-app || true'
                    
                    // Запускаем новый
                    sh """
                    docker run -d \
                    -p 8081:80 \
                    --name running-app \
                    ${DOCKER_IMAGE}:${BUILD_NUMBER}
                    """
                }
            }
        }
    }

    post {
        success {
            echo ' CI/CD цепочка успешно завершена!'
            echo "Приложение доступно по адресу: http://ваш-ip-сервера"
        }
        failure {
            echo ' Сборка или деплой завершились ошибкой'
        }
    }
}
