# 🚀 FreeCV Studio — Production Deployment Guide

FreeCV Studio is a modern full-stack application composed of:
1. **Frontend:** React + TypeScript + Vite + Tailwind CSS (`client/`)
2. **Backend:** Node.js + Express + TypeScript + Puppeteer + MongoDB (`server/`)

Both can be hosted **100% free of charge** using **Vercel** (for Frontend) and **Render** or **Railway** (for Backend).

---

## 🌟 Recommended Setup: Vercel (Frontend) + Render (Backend)

### Step 1: Deploy Backend API on Render (Free)

1. Log into [Render.com](https://render.com) using your GitHub account.
2. Click **New +** > **Web Service**.
3. Select your repository: `https://github.com/Dev-Yash-cyber/FreeCVStudio.git`.
4. Configure the settings:
   - **Name:** `freecv-studio-api`
   - **Root Directory:** `server`
   - **Environment:** `Docker` (or `Node`)
     *(Using Docker uses `server/Dockerfile` which automatically configures Chromium and fonts for PDF generation).*
   - **Region:** Choose closest to your users (e.g., Oregon or Frankfurt).
   - **Branch:** `main`
   - **Instance Type:** `Free`
5. Under **Environment Variables**, add:
   - `PORT`: `5001`
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `<Your MongoDB Connection String>` (e.g., MongoDB Atlas free cluster M0)
   - `JWT_SECRET`: `<A random secure string>`
   - `AI_PROVIDER`: `built-in`
   - `CLIENT_URL`: `*` (or your Vercel URL once deployed)
6. Click **Deploy Web Service**.
7. Once deployed, copy your backend URL (e.g., `https://freecv-studio-api.onrender.com`).

---

### Step 2: Deploy Frontend on Vercel (Free)

1. Log into [Vercel.com](https://vercel.com) using your GitHub account.
2. Click **Add New...** > **Project**.
3. Import your repository: `Dev-Yash-cyber/FreeCVStudio`.
4. In the Project Configuration:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Click "Edit" and select `client`.
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Expand **Environment Variables** and add:
   - `VITE_API_URL`: `https://freecv-studio-api.onrender.com/api`
     *(Replace with your actual Render API URL from Step 1 followed by `/api`)*
6. Click **Deploy**.
7. Within 1 minute, your website will be live at `https://freecvstudio.vercel.app` (or your custom domain)!

---

## ⚡ Option 2: Render All-In-One (Blueprint)

This repository includes a `render.yaml` blueprint:
1. Go to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** > **Blueprint**.
3. Connect `https://github.com/Dev-Yash-cyber/FreeCVStudio.git`.
4. Render will automatically read `render.yaml` and provision:
   - `freecv-studio-api` (Backend Docker service)
   - `freecv-studio` (Frontend Static Site)
5. Fill in the prompted secret variables (`MONGODB_URI`, `VITE_API_URL`) and click **Apply**.

---

## 🐳 Option 3: Docker / Railway / Self-Hosted VPS

If you prefer deploying with Docker on Railway, Fly.io, or an Ubuntu VPS:

```bash
# 1. Clone repository
git clone https://github.com/Dev-Yash-cyber/FreeCVStudio.git
cd FreeCVStudio/server

# 2. Build backend container
docker build -t freecv-server .

# 3. Run container
docker run -d -p 5001:5001 \
  -e MONGODB_URI="your_mongodb_connection_string" \
  -e JWT_SECRET="your_jwt_secret" \
  -e NODE_ENV="production" \
  --name freecv-api freecv-server
```

---

## ✅ Pre-flight Verification Checklist

- [x] Client SPA routing rules configured (`client/vercel.json` and `_redirects`).
- [x] Dynamic backend URL handling via `VITE_API_URL`.
- [x] Headless Chromium & font packages configured for high-quality PDF downloads (`server/Dockerfile`).
- [x] Built-in local rule-based AI engine enabled (zero external API keys required).
- [x] MongoDB database connection with automatic reconnection.
- [x] 100% Free policy without paywalls, subscriptions, or watermarks.
