# Ramz Documentation Deployment

This document explains how the CI/CD pipeline deploys the Ramz documentation to GitHub Pages.

## CI/CD Workflow

The documentation is automatically deployed to GitHub Pages when you push a version tag.

### Triggering Deployment

The deployment is triggered by:

1. **Version Tags**: Pushing tags matching the pattern `v*.*.*` (e.g., `v1.0.0`, `v2.1.3`)
2. **Manual Trigger**: You can manually trigger the workflow from the GitHub Actions tab

### Creating a Release Tag

```bash
# Create and push a new version tag
git tag v1.0.0
git push origin v1.0.0

# Or create with annotation
git tag -a v1.0.0 -m "Version 1.0.0 release"
git push origin v1.0.0
```

### Workflow Process

1. **Build Job**:
   - Checks out the repository
   - Sets up Node.js (version 20)
   - Installs dependencies in `docs/` directory
   - Builds the Next.js application
   - Prepares static files for deployment
   - Uploads build artifacts

2. **Deploy Job**:
   - Downloads build artifacts
   - Configures GitHub Pages
   - Uploads static files to GitHub Pages
   - Deploys to production

### Configuration Files

- `.github/workflows/deploy-docs.yml`: Main CI/CD workflow
- `docs/next.config.ts`: Next.js configuration (standalone output)
- `docs/package.json`: Dependencies and build scripts

### GitHub Pages Settings

After setting up this workflow, you need to configure GitHub Pages:

1. Go to repository **Settings** > **Pages**
2. Set **Source** to **GitHub Actions**
3. The workflow will automatically deploy the documentation

### Accessing the Documentation

Once deployed, the documentation will be available at:
```
https://<username>.github.io/Ramz/
```

Or if using a custom domain:
```
https://<custom-domain>/
```

### Local Development

To run the documentation locally:

```bash
cd docs
npm install
npm run dev
```

The documentation will be available at `http://localhost:3000`

### Building Locally

To build the documentation locally:

```bash
cd docs
npm install
npm run build
```

The static output will be in `docs/.next/standalone/`

### Troubleshooting

#### Workflow Permissions Error

If you see an error about workflow permissions, make sure your GitHub token has the `workflow` scope:
- Personal Access Token: Include `workflow` scope
- GitHub App: Ensure it has `workflow:write` permission

#### Build Failures

Check the workflow logs in the **Actions** tab for detailed error messages.

#### Deployment Not Updating

1. Check if the tag was pushed correctly: `git ls-remote --tags origin`
2. Verify the workflow completed successfully in Actions tab
3. Check GitHub Pages deployment status in Settings > Pages

### Version Convention

Follow semantic versioning for tags:
- `v1.0.0` - Major release (breaking changes)
- `v1.1.0` - Minor release (new features)
- `v1.1.1` - Patch release (bug fixes)

### Manual Deployment

If you need to deploy without creating a tag:

1. Go to repository **Actions** tab
2. Select **Deploy Documentation to GitHub Pages** workflow
3. Click **Run workflow** button
4. Select branch and click **Run workflow**

### Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Next.js Deployment](https://nextjs.org/docs/deployment)