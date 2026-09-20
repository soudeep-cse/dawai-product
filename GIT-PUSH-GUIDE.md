# How to Push to GitHub

I've created scripts to help you push this project to your GitHub repository.

## Repository Details

- **GitHub URL**: https://github.com/soudeep-cse/dawai-product.git
- **Branch**: main

---

## Option 1: Use the Automated Script (Easiest)

### On Windows:

1. Open the `dawai-website` folder
2. Double-click `git-setup.bat`
3. The script will automatically:
   - Initialize git
   - Add all files
   - Create initial commit
   - Add remote origin
   - Push to GitHub

### On Mac/Linux:

1. Open Terminal in the `dawai-website` folder
2. Run:
   ```bash
   chmod +x git-setup.sh
   ./git-setup.sh
   ```

---

## Option 2: Manual Commands

If you prefer to run commands manually, open your terminal/command prompt in the `dawai-website` folder and run:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Dawai medicine delivery website"

# Add GitHub remote
git remote add origin https://github.com/soudeep-cse/dawai-product.git

# Create main branch and push
git branch -M main
git push -u origin main
```

---

## Prerequisites

Make sure you have:

1. **Git installed** - Check by running `git --version`
   - If not installed, download from: https://git-scm.com/downloads

2. **GitHub authentication set up**
   - Either SSH key configured, or
   - Personal Access Token (PAT) ready, or
   - GitHub Desktop installed

---

## Troubleshooting

### Error: "remote origin already exists"

If you see this error, remove the existing remote first:

```bash
git remote remove origin
git remote add origin https://github.com/soudeep-cse/dawai-product.git
git push -u origin main
```

### Error: "Permission denied"

Make sure you're logged into the correct GitHub account that owns the `soudeep-cse/dawai-product` repository.

For HTTPS authentication, you'll need a Personal Access Token:
1. Go to GitHub → Settings → Developer Settings → Personal Access Tokens
2. Generate a new token with `repo` scope
3. Use this token as your password when pushing

### Error: "Repository not found"

Make sure the repository exists at https://github.com/soudeep-cse/dawai-product

If not, create it first:
1. Go to GitHub.com
2. Click "New repository"
3. Name it: `dawai-product`
4. Don't initialize with README (we already have files)
5. Click "Create repository"
6. Then run the push commands

---

## What Gets Pushed

The following files and folders will be pushed:

✅ All source code (`app/`, `components/`, `contexts/`, `data/`)
✅ Configuration files (`package.json`, `tsconfig.json`, `tailwind.config.ts`, etc.)
✅ Documentation (`README.md`, `SETUP-GUIDE.md`, `PROJECT-SUMMARY.md`, etc.)
✅ Public assets folder structure

❌ `node_modules/` - excluded via .gitignore
❌ `.next/` build folder - excluded via .gitignore
❌ Environment files - excluded via .gitignore

---

## After Pushing

Once pushed, you can:

1. **View your code** at: https://github.com/soudeep-cse/dawai-product
2. **Deploy to Vercel**:
   - Go to vercel.com
   - Import the GitHub repository
   - Deploy automatically
3. **Collaborate**:
   - Invite team members
   - Create branches for new features
   - Use pull requests for code review

---

## Need Help?

If you encounter any issues, feel free to ask!

The commit message includes:
- Project description
- All major features
- Technology stack
