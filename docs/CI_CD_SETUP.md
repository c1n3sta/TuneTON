# TuneTON CI/CD Pipeline Setup

This document provides instructions for setting up and using the CI/CD pipeline for the TuneTON microservices architecture.

## Prerequisites

1. GitHub repository for the project
2. GitHub Actions enabled for the repository
3. GitHub CLI installed locally (for secret setup)
4. Kubernetes cluster (for deployment)
5. Container registry (GitHub Container Registry is used by default)

## Pipeline Overview

The CI/CD pipeline consists of three main jobs:

1. **Test**: Runs unit and integration tests for all services
2. **Build and Push**: Builds Docker images and pushes them to the container registry
3. **Deploy**: Deploys the application to the Kubernetes cluster

## Setting Up Secrets

Before running the pipeline, you need to set up the following GitHub secrets:

1. **KUBE_CONFIG**: Kubernetes configuration file (kubeconfig) for deployment
2. **JWT_SECRET**: Secret key for JWT token generation
3. **TELEGRAM_BOT_TOKEN**: Telegram bot token for authentication
4. **DATABASE_URL**: Main database connection string
5. **RABBITMQ_URL**: RabbitMQ connection URL

You can use the provided script to set up these secrets:

```powershell
# Run from the project root
.\scripts\setup-github-secrets.ps1
```

## Environment Variables

The pipeline uses the following environment variables:

- `REGISTRY`: Container registry URL (default: `ghcr.io`)
- `IMAGE_NAME`: Repository name for container images
- `KUBE_NAMESPACE`: Kubernetes namespace for deployment (default: `tuneton`)

## Manual Deployment

To manually trigger a deployment:

1. Go to the "Actions" tab in your GitHub repository
2. Select the "CI/CD Pipeline" workflow
3. Click "Run workflow"
4. Select the branch to deploy from (default: `main`)
5. Click "Run workflow"

## Monitoring

The pipeline includes monitoring setup with:

- **Prometheus** for metrics collection
- **Grafana** for visualization

Access the monitoring dashboards at:
- Prometheus: `http://<ingress-address>/metrics`
- Grafana: `http://<ingress-address>/grafana`

## Troubleshooting

### Common Issues

1. **Kubernetes connection issues**:
   - Verify the `KUBE_CONFIG` secret is correctly set
   - Check that the cluster is running and accessible

2. **Image pull errors**:
   - Verify container registry credentials
   - Check image tags in Kubernetes manifests

3. **Test failures**:
   - Check test logs in the GitHub Actions workflow
   - Ensure all required services (PostgreSQL, RabbitMQ) are running during tests

### Viewing Logs

You can view logs for the deployed services using:

```bash
# Get pod names
kubectl get pods -n tuneton

# View logs for a specific pod
kubectl logs -f <pod-name> -n tuneton
```

## Customization

### Adding a New Service

1. Add a new build and push step in the `build-and-push` job
2. Update the deployment step to include the new service
3. Add any required environment variables to the test job

### Modifying the Pipeline

The main workflow file is located at `.github/workflows/ci-cd.yml`. You can modify this file to:

- Add additional test steps
- Change the build process
- Modify deployment settings

## Security Considerations

- Never commit sensitive information to version control
- Use GitHub Secrets for all credentials and API keys
- Regularly rotate secrets and tokens
- Limit access to the Kubernetes cluster
