# 🚀 E-Library System - Cloud Deployment Guide

Deploy your E-Library System to **Render.com** with just a few clicks using the free tier!

---

## 📋 Prerequisites

Before deploying, ensure you have:

1. ✅ **Git Repository** - Code pushed to GitLab
2. ✅ **Render Account** - Sign up at [render.com](https://render.com) (free)
3. ✅ **Database Ready** - Either:
   - Existing **managed PostgreSQL** database (**Neon recommended**)
   - OR use Render's free PostgreSQL (90-day trial)

---

## 🎯 Quick Deploy (5 Minutes)

### Step 1: Verify Repository Configuration

1. **Repository is already configured** in `render.yaml`:
   ```yaml
   repo: https://gitlab.com/chaitaanya10/e-library-system
   ```
   
2. **Ensure your code is pushed to GitLab**:
   ```bash
   git status
   git push origin main
   ```

### Step 2: Deploy to Render

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** → Select **"Blueprint"**
3. **Connect Repository**: 
   - Choose **GitLab** as your Git provider
   - Authorize Render to access your repositories
   - Select the `E-Library-System` repository
4. **Click "Apply Blueprint"**
5. Wait for Render to create both services (~5 minutes)

### Step 3: Configure Environment Variables

#### Backend Service:

1. Go to **Render Dashboard** → Click on **`elibrary-backend`**
2. Navigate to **Environment** tab
3. Add the following variables:

| Variable | Value | Example |
|----------|-------|---------|
| `DB_HOST` | Your database host | `ep-your-project-id.region.aws.neon.tech` |
| `DB_NAME` | Database name | `postgres` |
| `DB_USER` | Database username | `postgres.ynykusfuerewikqnpbrz` |
| `DB_PASSWORD` | Database password | `your_secure_password` |

4. **Click "Save Changes"** - Backend will automatically redeploy

#### Frontend Service:

1. Go to **Render Dashboard** → Click on **`elibrary-frontend`**
2. Navigate to **Environment** tab
3. Add this variable:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://elibrary-backend.onrender.com/api` |

> 💡 **Tip**: Replace `elibrary-backend` with your actual backend service name if different

4. **Click "Save Changes"** - Frontend will automatically redeploy

### Step 4: Access Your Application 🎉

After deployment completes (5-10 minutes):

- **Frontend**: `https://elibrary-frontend.onrender.com`
- **Backend API**: `https://elibrary-backend.onrender.com/api`
- **Health Check**: `https://elibrary-backend.onrender.com/actuator/health`

---

## 🔧 Alternative: Use Render PostgreSQL Database

If you don't have a managed PostgreSQL database yet, you can use Render's free PostgreSQL:

### Enable Database in render.yaml

1. Open `render.yaml`
2. **Uncomment** the database section at the bottom (lines starting with `#`)
3. **Uncomment** the database reference in backend `envVars`
4. **Remove** or comment out the manual `DB_*` environment variables
5. Commit and push changes
6. Render will automatically create a PostgreSQL database and link it

> ⚠️ **Note**: Render's free PostgreSQL expires after **90 days** and will require upgrade to paid tier

---

## 📊 Database Setup Options

### Option A: Neon (Recommended)

✅ **Pros**: Free forever, generous limits, excellent UI  
❌ **Cons**: External service, manual configuration

**Setup**:
1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Get connection details from **Project Dashboard** → **Connection Details**
4. Configure as shown in Step 3 above

### Option B: Render PostgreSQL

✅ **Pros**: Integrated, automatic configuration  
❌ **Cons**: Free tier expires after 90 days

**Setup**: Uncomment database section in `render.yaml` (see above)

---

## 🔍 Monitoring & Logs

### View Application Logs

1. Go to Render Dashboard
2. Click on service name (`elibrary-backend` or `elibrary-frontend`)
3. Navigate to **Logs** tab
4. View real-time logs with auto-refresh

### Check Service Status

- **Healthy**: Green indicator, service responding
- **Deploying**: Blue indicator, deployment in progress
- **Failed**: Red indicator, check logs for errors

### Common Issues

#### Backend fails to start
- **Check**: Database credentials in Environment variables
- **Check**: Database host, credentials, and SSL mode are configured correctly (`sslmode=require`)
- **View**: Backend logs for detailed error messages

#### Frontend shows blank page
- **Check**: `VITE_API_URL` points to correct backend URL
- **Check**: Browser console for errors (F12)
- **Check**: Backend is healthy at `/actuator/health`

#### Services spin down
- **Normal behavior**: Free tier spins down after 15 minutes of inactivity
- **First request**: Takes 30-60 seconds to wake up
- **Solution**: Upgrade to paid plan for always-on services

---

## 🔄 Updating Your Application

### Automatic Deployment (Recommended)

With `autoDeploy: true` in `render.yaml`, Render automatically deploys on git push:

```bash
# Make your changes
git add .
git commit -m "Update feature"
git push origin main

# Render automatically detects and deploys!
```

### Manual Deployment

1. Go to Render Dashboard
2. Click on service name
3. Click **"Manual Deploy"** → **"Deploy latest commit"**

---

## 💰 Free Tier Limits

| Resource | Limit |
|----------|-------|
| Services | 750 hours/month (shared across all services) |
| RAM | 512 MB per service |
| Bandwidth | 100 GB/month |
| Build Time | 500 build minutes/month |
| Spin Down | After 15 minutes of inactivity |

> 💡 **Optimization Tip**: With 2 services (backend + frontend), you have ~375 hours per service, which is enough if you don't use them 24/7

---

## 🛠️ Advanced Configuration

### Custom Domains

1. Go to service → **Settings**
2. Scroll to **Custom Domain**
3. Add your domain and configure DNS
4. Render provides free SSL certificates

### Environment Groups

Create reusable environment variable groups:
1. **Settings** → **Environment Groups**
2. Create group (e.g., "Production DB")
3. Link to services

### Scaling to Paid Tier

When ready to upgrade:
- **Starter Plan**: $7/month - Always on, no spin down
- **Standard Plan**: $25/month - More RAM, better performance

---

## 📚 Useful Resources

- [Render Documentation](https://render.com/docs)
- [Blueprint Specification](https://render.com/docs/blueprint-spec)
- [Render Community Forum](https://community.render.com)
- [Render Status Page](https://status.render.com)

---

## 🆘 Getting Help

If you encounter issues:

1. **Check Logs**: Render Dashboard → Service → Logs
2. **Health Check**: Visit `/actuator/health` endpoint
3. **Database Connection**: Test with `psql` or database client
4. **Community**: Ask on [Render Community](https://community.render.com)

---

## 🎉 Success Checklist

Once deployed, verify:

- [ ] Backend health check returns `{"status":"UP"}`
- [ ] Frontend loads without errors
- [ ] Can login to the application
- [ ] Can create/view books and users
- [ ] Database operations work correctly

**Congratulations! Your E-Library System is now live! 🚀**

