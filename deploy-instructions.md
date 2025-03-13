# Deploying to GitHub Pages

To update the live website at https://graycloudsbr.github.io/, follow these steps:

## Option 1: Manual Upload (Easiest)

1. Go to https://github.com/GrayCloudsBR/graycloudsbr.github.io
2. Click on "Add file" > "Upload files"
3. Drag and drop all the files from your local `antry-rebuild` directory
4. Add a commit message like "Update website with free pricing"
5. Click "Commit changes"

## Option 2: Using Git

1. Clone the GitHub Pages repository:
   ```
   git clone https://github.com/GrayCloudsBR/graycloudsbr.github.io.git
   ```

2. Copy all files from your local `antry-rebuild` directory to the cloned repository

3. Navigate to the repository directory:
   ```
   cd graycloudsbr.github.io
   ```

4. Add all changes:
   ```
   git add .
   ```

5. Commit the changes:
   ```
   git commit -m "Update website with free pricing"
   ```

6. Push to GitHub:
   ```
   git push
   ```

After following either option, wait a few minutes for GitHub Pages to build and deploy your site. Then visit https://graycloudsbr.github.io/ to see the updated website.

## Key Files That Need to Be Updated

The most important files to update are:

1. `index.html` - Contains the updated pricing section showing "FREE" instead of "$9.99/month"
2. `js/main.js` - Contains the updated `initPricingToggle()` function
3. CSS files - Any styling changes for the pricing section
4. Images - Any new images or icons added to the site

Make sure these files are properly uploaded to the GitHub repository. 