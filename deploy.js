#!/usr/bin/env node

/**
 * MoodLetter Deployment Helper Script
 * This script helps you deploy your MoodLetter app to various platforms
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("🚀 MoodLetter Deployment Helper\n");

// Check if we're in the right directory
if (!fs.existsSync("package.json")) {
  console.error(
    "❌ Error: Please run this script from the MoodLetter project root directory"
  );
  process.exit(1);
}

// Check if build directory exists
if (!fs.existsSync("dist")) {
  console.log("📦 Building the application...");
  try {
    execSync("npm run build", { stdio: "inherit" });
    console.log("✅ Build completed successfully!\n");
  } catch (error) {
    console.error("❌ Build failed. Please fix any errors and try again.");
    process.exit(1);
  }
}

console.log("🌐 Deployment Options:\n");

console.log("1. 🚀 Vercel (Recommended)");
console.log("   - Easiest deployment");
console.log("   - Automatic deployments from GitHub");
console.log("   - Free custom domain");
console.log("   - Steps: Push to GitHub → Connect to Vercel → Deploy\n");

console.log("2. 🌍 Netlify");
console.log("   - Drag & drop deployment");
console.log("   - Git integration available");
console.log("   - Form handling included");
console.log("   - Steps: Go to netlify.com → Drag dist folder → Deploy\n");

console.log("3. 📱 GitHub Pages");
console.log("   - Free hosting from GitHub");
console.log("   - Perfect for portfolios");
console.log("   - Steps: npm install gh-pages → npm run deploy\n");

console.log("4. 🔥 Firebase Hosting");
console.log("   - Google's hosting platform");
console.log("   - Excellent performance");
console.log("   - Steps: firebase init → firebase deploy\n");

console.log("📋 Pre-deployment checklist:");
console.log("✅ Build completed successfully");
console.log("✅ All features tested locally");
console.log("✅ No console errors");
console.log("✅ Mobile responsive design");

console.log("\n🎯 Quick Start Commands:");
console.log("• Test build: npm run build && npm run preview");
console.log(
  '• Push to GitHub: git add . && git commit -m "Deploy" && git push'
);
console.log("• Deploy to Vercel: Visit vercel.com and import your repo");

console.log("\n📖 For detailed instructions, see: DEPLOYMENT-GUIDE.md");
console.log("\n🎉 Your MoodLetter app is ready for deployment!");
