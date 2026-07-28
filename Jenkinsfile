// Builds + pushes a real production image and opens a GitOps tag-bump PR,
// same closing-the-loop pattern as africanshops-microservices' pipeline.
// Different from that repo in one important way: each environment here is
// its OWN build (Vite bakes the API base URL into the JS bundle at build
// time), not a promotion of one artifact across environments -- so this
// pipeline runs once per environment, not once total with a promotion
// pipeline layered on top.
def gitShortSha = ''

pipeline {
    agent any

    parameters {
        choice(name: 'TARGET_ENV', choices: ['test', 'prod'], description: 'Build for which environment?')
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'test',
                    credentialsId: 'git-cred-ferdinand-eke',
                    url: 'https://github.com/Ferdinand-eke/admin-msvs-africanshops.git'
                script {
                    gitShortSha = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    echo "Building admin-dashboard for ${params.TARGET_ENV}, sha ${gitShortSha}"
                }
            }
        }

        stage('Prepare env file') {
            steps {
                withCredentials([file(credentialsId: "admin-dashboard-env-${params.TARGET_ENV}", variable: 'ENV_FILE')]) {
                    sh "cp \$ENV_FILE .env.${params.TARGET_ENV}"
                }
            }
        }

        stage('Build & Push') {
            steps {
                withDockerRegistry(credentialsId: 'docker-cred', toolName: 'docker') {
                    sh """
                        docker build -f Dockerfile.frontend.prod \
                          --build-arg ENV_FILE=.env.${params.TARGET_ENV} \
                          -t devopsferazi/admin-dashboard-${params.TARGET_ENV}:build-${gitShortSha} .
                        docker push devopsferazi/admin-dashboard-${params.TARGET_ENV}:build-${gitShortSha}
                    """
                }
            }
        }

        stage('Bump GitOps Tag') {
            steps {
                withCredentials([string(credentialsId: 'gitops-deploy-token', variable: 'GITOPS_TOKEN')]) {
                    script {
                        def branchName = "bump-admin-dashboard-${params.TARGET_ENV}-${gitShortSha}"
                        sh """
                            set -e
                            rm -rf gitops-deploy-checkout
                            git clone https://x-access-token:${GITOPS_TOKEN}@github.com/africanshops-platform/gitops-deploy.git gitops-deploy-checkout
                            cd gitops-deploy-checkout
                            git checkout feat/africanshops-test-full-rollout
                            git checkout -b ${branchName}
                            sed -i 's/^  tag:.*/  tag: build-${gitShortSha}/' environments/frontend-${params.TARGET_ENV}/admin-dashboard/values.yaml
                            git config user.email "jenkins-ci@africanshops.com"
                            git config user.name "Jenkins CI"
                            git add environments/frontend-${params.TARGET_ENV}/admin-dashboard/values.yaml
                            git commit -m "chore(frontend-${params.TARGET_ENV}): bump admin-dashboard to build-${gitShortSha}

Jenkins build: ${BUILD_URL}"
                            git push https://x-access-token:${GITOPS_TOKEN}@github.com/africanshops-platform/gitops-deploy.git ${branchName}
                        """

                        def prTitle = "frontend-${params.TARGET_ENV}: bump admin-dashboard to build-${gitShortSha}"
                        def prBody = "Automated build from Jenkins build ${BUILD_NUMBER}.\\n\\nBuild: ${BUILD_URL}"
                        writeFile file: 'pr-payload.json', text: "{\"title\": \"${prTitle}\", \"head\": \"${branchName}\", \"base\": \"feat/africanshops-test-full-rollout\", \"body\": \"${prBody}\"}"
                        sh """
                            curl -s -X POST \
                              -H "Authorization: token ${GITOPS_TOKEN}" \
                              -H "Accept: application/vnd.github+json" \
                              https://api.github.com/repos/africanshops-platform/gitops-deploy/pulls \
                              -d @pr-payload.json
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            sh 'docker system prune -af || true'
            sh 'rm -rf gitops-deploy-checkout pr-payload.json .env.test .env.prod || true'
        }
    }
}
