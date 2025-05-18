# Secrets Management for CI/CD

This document explains how to set up the required secrets for the CI/CD workflow.

## Required Secrets

### Docker Hub Secrets
1. `DOCKERHUB_USERNAME`
   - Your Docker Hub username
   - Example: billyvande7

2. `DOCKERHUB_TOKEN`
   - A Docker Hub access token
   - Generate from Docker Hub -> Settings -> Security -> New Access Token
   - Give appropriate permissions (read/write)

### ArgoCD Secrets
1. `ARGOCD_TOKEN`
   - Your ArgoCD authentication token
   - Used for triggering deployments

2. `ARGOCD_SERVER`
   - Your ArgoCD server URL
   - Example: https://argocd.example.com

## How to Add Secrets

1. Go to your GitHub repository
2. Navigate to Settings -> Secrets and variables -> Actions
3. Click "New repository secret"
4. Add each secret with its corresponding value

## Security Best Practices

1. Never commit actual secret values to the repository
2. Rotate secrets periodically
3. Use minimal permissions necessary
4. Revoke compromised secrets immediately

## Validating Secrets

To validate that your secrets are properly set up:

1. Check the secrets are visible in GitHub repository settings
2. Trigger a manual workflow run
3. Monitor the workflow logs for authentication issues

## Troubleshooting

If you encounter authentication issues:

1. Verify secret names match exactly with the workflow file
2. Check that Docker Hub token has correct permissions
3. Ensure ArgoCD token is valid and not expired
4. Check for any typos in secret values

For security concerns or questions, please contact the repository maintainers. 