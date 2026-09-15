# GitHub Secrets Setup for Cloudflare

Add these secrets to your repository settings at:
`Settings → Secrets and variables → Actions → New repository secret`

## Required Secrets

### Cloudflare Account
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID
- `CLOUDFLARE_API_TOKEN` - Your Cloudflare API token

### Cloudflare R2 (S3-compatible)
- `R2_ACCESS_KEY_ID` - R2 access key ID
- `R2_SECRET_ACCESS_KEY` - R2 secret access key
- `R2_ACCOUNT_ID` - Your account ID for R2 endpoint
- `R2_BUCKET_NAME` - Your R2 bucket name

### Cloudflare D1 Database
- `D1_DATABASE_ID` - Your D1 database ID

### Workbench Configuration
- `WORKBENCH_API_KEY` - If needed for Workbench authentication

## Usage in Workflows

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Cloudflare
        env:
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          R2_ACCESS_KEY_ID: ${{ secrets.R2_ACCESS_KEY_ID }}
          R2_SECRET_ACCESS_KEY: ${{ secrets.R2_SECRET_ACCESS_KEY }}
          D1_DATABASE_ID: ${{ secrets.D1_DATABASE_ID }}
        run: |
          # Your deployment script here
```

## Important: DO NOT commit real credentials to the repository
