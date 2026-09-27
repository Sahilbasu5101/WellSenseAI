# 🚀 WellSense AI — Deployment Guide

> **Stack:** React (Netlify) + Node.js/Express (Render) + FastAPI RAG (Render or Railway) + MongoDB (Atlas)

---

## Overview

| Service | Platform | URL Example |
|---|---|---|
| Frontend (React + Vite) | Netlify | `https://wellsense-ai.netlify.app` |
| Node.js API (Express) | Render | `https://wellsense-node.onrender.com` |
| RAG API (FastAPI + Gemini) | Render or Railway | `https://wellsense-rag.onrender.com` |
| Database (MongoDB) | MongoDB Atlas | `mongodb+srv://...` |

---

## Step 0 — Push Code to GitHub

Before deploying anything, push your project to GitHub:

```bash
cd "C:\Users\Sahill basu\OneDrive\Desktop\WellSense_AI"
git init
git add .
git commit -m "Initial commit - WellSense AI"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/wellsense-ai.git
git push -u origin main
```

> [!IMPORTANT]
> Make sure `.gitignore` excludes `.env` files and `chroma_db/` so API keys are never pushed.

### Recommended `.gitignore` (at project root):
```gitignore
# Environment variables
.env
*.env

# Python
__pycache__/
*.pyc
venv/
.venv/

# ChromaDB vector store (large binary files)
rag-backend/chroma_db/

# Node
node_modules/

# Vite build output
frontend/dist/

# OS
.DS_Store
Thumbs.db
```

---

## Step 1 — MongoDB Atlas (Free Database)

MongoDB Atlas provides a free 512MB cluster — perfect for WellSense AI.

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com) and create a free account
2. Click **Build a Database** → Select **Free (M0)** → Choose AWS Mumbai (ap-south-1)
3. Create a database user: e.g., username `wellsense`, password (save this!)
4. Under **Network Access** → Add IP Address → **Allow Access from Anywhere** (`0.0.0.0/0`)
5. Click **Connect** → **Connect your application** → Copy the connection string:
   ```
   mongodb+srv://wellsense:<password>@cluster0.xxxxx.mongodb.net/wellsense_db?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your actual password — **save this URI**, you'll need it in Step 3.

### Seed initial data (run locally before deploying):
```bash
# Make sure local Node server is running and connected to Atlas URI:
set MONGODB_URI=mongodb+srv://wellsense:<password>@cluster0.xxxxx.mongodb.net/wellsense_db
cd "C:\Users\Sahill basu\OneDrive\Desktop\WellSense_AI\node-backend"
node src/seed.js
```

---

## Step 2 — Deploy Frontend on Netlify

### Option A: Via Netlify UI (Recommended)

1. Go to [https://netlify.com](https://netlify.com) → Log in → **Add new site** → **Import an existing project**
2. Connect GitHub → Select your `wellsense-ai` repo
3. Set build settings:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
4. Add **Environment Variables** (Site Settings → Environment Variables):
   ```
   VITE_API_URL   = https://wellsense-node.onrender.com
   VITE_RAG_URL   = https://wellsense-rag.onrender.com
   ```
   *(Set these to the Render URLs you'll get in Steps 3 & 4. You can update them after deploying backends.)*
5. Click **Deploy** — Netlify will auto-build and give you a URL like `https://wellsense-ai.netlify.app`

> [!TIP]
> The `frontend/netlify.toml` and `frontend/public/_redirects` files are already configured for SPA routing. You don't need to configure anything extra.

### Option B: Via Netlify CLI
```bash
npm install -g netlify-cli
cd "C:\Users\Sahill basu\OneDrive\Desktop\WellSense_AI\frontend"
npm run build
netlify deploy --prod --dir=dist
```

---

## Step 3 — Deploy Node.js Backend on Render

1. Go to [https://render.com](https://render.com) → **New** → **Web Service**
2. Connect your GitHub repo → Select `wellsense-ai`
3. Configure:
   - **Name:** `wellsense-node`
   - **Root Directory:** `node-backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node src/server.js`
   - **Instance Type:** Free
4. Add **Environment Variables**:
   ```
   MONGODB_URI    = mongodb+srv://wellsense:<password>@cluster0.xxxxx.mongodb.net/wellsense_db
   PORT           = 10000
   NODE_ENV       = production
   ```
5. Click **Create Web Service** — Render will deploy and give you a URL like `https://wellsense-node.onrender.com`
6. **Copy this URL** → Go back to Netlify → Update `VITE_API_URL` with this URL → Trigger a new Netlify deploy

> [!NOTE]
> Free Render services spin down after 15 minutes of inactivity. First request after sleep may take 30-60 seconds. This is normal for free tier.

---

## Step 4 — Deploy RAG Backend (FastAPI + Gemini)

> [!IMPORTANT]
> The RAG backend uses `torch` (~500MB) and `sentence-transformers`. This requires a service with **at least 1GB RAM**. The free Render tier (512MB) may OOM. **Recommended: Railway** (500MB free + automatic scaling) or **Render Starter tier (\$7/month)**.

### Option A: Deploy on Render (May OOM on free tier — try first)

1. Go to Render → **New** → **Web Service**
2. Connect your GitHub repo
3. Configure:
   - **Name:** `wellsense-rag`
   - **Root Directory:** `rag-backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python run_server.py`
4. Add **Environment Variables**:
   ```
   GEMINI_API_KEY = your_actual_gemini_api_key_here
   LLM_MODE       = gemini
   PORT           = 10000
   ```
5. Click **Create Web Service**

> [!WARNING]
> ChromaDB stores vector data on disk. On Render free tier, the disk is **ephemeral** — data resets on every deploy/restart. You'll need to re-index documents after each restart.

**To persist ChromaDB on Render:** Upgrade to a paid plan and add a **Disk** (under your service settings → Disks → `/app/chroma_db`, 1GB).

---

### Option B: Deploy on Railway (Recommended for RAG backend) ✅

Railway offers 500MB RAM free and is simpler for Python services.

1. Go to [https://railway.app](https://railway.app) → Log in with GitHub
2. **New Project** → **Deploy from GitHub repo** → Select `wellsense-ai`
3. Railway will detect Python → Set the **root directory** to `rag-backend`
4. Add environment variables in Railway dashboard:
   ```
   GEMINI_API_KEY = your_actual_gemini_api_key_here
   LLM_MODE       = gemini
   PORT           = 8000
   ```
5. Railway auto-detects `Procfile` (`web: python run_server.py`) ✅
6. Click **Deploy** → Get URL like `https://wellsense-rag.up.railway.app`
7. **Copy this URL** → Update Netlify `VITE_RAG_URL` with this URL

**For persistent ChromaDB on Railway:**
- Go to your service → **Volumes** → Add volume → Mount path: `/app/chroma_db`

---

### Option C: Deploy on Hugging Face Spaces (Free, 2GB RAM) 🤗

Best free option if Railway/Render don't work.

1. Go to [https://huggingface.co/spaces](https://huggingface.co/spaces)
2. Create a new Space → Select **Docker** SDK
3. Create a `Dockerfile` in `rag-backend/`:
   ```dockerfile
   FROM python:3.11-slim
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt
   COPY . .
   EXPOSE 7860
   CMD ["python", "run_server.py"]
   ```
4. Set `PORT=7860` in Space secrets
5. Add secret: `GEMINI_API_KEY=your_key_here`
6. Push `rag-backend/` contents to HF Space repo

---

## Step 5 — Re-index Documents After Deployment

After the RAG backend is running in production, call the index endpoint to load documents into ChromaDB:

```bash
curl -X POST https://wellsense-rag.onrender.com/index-documents
```

Or click **"Re-index Historical Documents"** in the Settings tab of the dashboard.

---

## Step 6 — Update Frontend URLs and Redeploy

After getting all your backend URLs:

1. Go to **Netlify** → **Site Settings** → **Environment Variables**
2. Update both variables:
   ```
   VITE_API_URL = https://wellsense-node.onrender.com
   VITE_RAG_URL = https://wellsense-rag.onrender.com   (or railway/HF URL)
   ```
3. Go to **Deploys** → **Trigger deploy** → **Deploy site**

---

## Environment Variables Summary

### Frontend (Netlify)
| Variable | Value |
|---|---|
| `VITE_API_URL` | `https://wellsense-node.onrender.com` |
| `VITE_RAG_URL` | `https://wellsense-rag.onrender.com` |

### Node.js Backend (Render)
| Variable | Value |
|---|---|
| `MONGODB_URI` | `mongodb+srv://...` |
| `PORT` | `10000` |
| `NODE_ENV` | `production` |

### RAG Backend (Railway/Render)
| Variable | Value |
|---|---|
| `GEMINI_API_KEY` | Your actual Gemini API key |
| `LLM_MODE` | `gemini` |
| `PORT` | `8000` or `10000` |

---

## Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| Netlify shows blank page | SPA routing issue | Check `_redirects` file exists in `frontend/public/` |
| API calls fail (CORS error) | Backend not running | Check Render service logs; verify env vars |
| RAG backend OOM crash | `torch` too large | Switch to Railway or HF Spaces |
| ChromaDB empty after restart | Ephemeral disk | Add persistent volume or re-index |
| Node backend 503 on first request | Render free spin-down | Normal — wait 30-60s for cold start |
| Gemini returns error | Wrong API key | Verify `GEMINI_API_KEY` in Railway/Render env vars |

---

## Quick Deploy Checklist

- [ ] Code pushed to GitHub
- [ ] `.env` files in `.gitignore` (never committed)
- [ ] MongoDB Atlas cluster created + `MONGODB_URI` copied
- [ ] Node backend deployed on Render + URL copied
- [ ] RAG backend deployed on Railway/Render + URL copied
- [ ] Netlify `VITE_API_URL` and `VITE_RAG_URL` set
- [ ] Netlify frontend deployed and accessible
- [ ] `/index-documents` called to seed ChromaDB
- [ ] All 8 dashboard tabs tested in production
