# 🚀 Render Deployment Guide for AspireAI

This guide will help you deploy your AspireAI application on Render with both frontend and backend services.

## 📋 Prerequisites

1. **GitHub Repository**: Your code must be pushed to GitHub
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **Environment Variables**: Have your API keys ready

## 🔧 Deployment Steps

### Step 1: Create Backend Service

1. **Go to Render Dashboard**
   - Visit [dashboard.render.com](https://dashboard.render.com)
   - Click "New +" → "Web Service"

2. **Connect Repository**
   - Connect your GitHub account
   - Select your `aspireai` repository
   - Choose "Deploy from a branch" → `main`

3. **Configure Backend Service**
   ```
   Name: aspireai-backend
   Environment: Node
   Region: Choose closest to your users
   Branch: main
   Root Directory: server
   Build Command: npm install
   Start Command: npm start
   ```

4. **Set Environment Variables**
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secure_jwt_secret_key
   OPENAI_API_KEY=your_openai_api_key
   RAPIDAPI_KEY=your_rapidapi_key
   ```

5. **Deploy Backend**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note the backend URL (e.g., `https://aspireai-backend.onrender.com`)

### Step 2: Create Frontend Service

1. **Create Static Site**
   - Click "New +" → "Static Site"
   - Select same repository

2. **Configure Frontend Service**
   ```
   Name: aspireai-frontend
   Branch: main
   Root Directory: client
   Build Command: npm install && npm run build
   Publish Directory: build
   ```

3. **Set Environment Variables**
   ```
   REACT_APP_API_URL=https://aspireai-backend.onrender.com
   ```

4. **Deploy Frontend**
   - Click "Create Static Site"
   - Wait for deployment to complete

### Step 3: Update CORS Settings

After both services are deployed, update your backend CORS settings:

1. **Get Frontend URL** from Render dashboard
2. **Update server/index.js** CORS configuration:
   ```javascript
   app.use(cors({
     origin: process.env.NODE_ENV === 'production' 
       ? ['https://your-actual-frontend-url.onrender.com'] 
       : ['http://localhost:3000'],
     credentials: true
   }));
   ```
3. **Redeploy backend** service

## 🔒 Environment Variables Setup

### Backend Environment Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `production` |
| `PORT` | Server port | `10000` |
| `MONGODB_URI` | Database connection | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | JWT signing key | `your_super_secure_secret_key` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-your_openai_key` |
| `RAPIDAPI_KEY` | RapidAPI key | `your_rapidapi_key` |

### Frontend Environment Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `https://aspireai-backend.onrender.com` |

## 🔍 Troubleshooting

### Common Issues

**1. Build Failures**
```bash
# Check build logs in Render dashboard
# Common fixes:
- Ensure package.json has correct scripts
- Check for missing dependencies
- Verify Node.js version compatibility
```

**2. CORS Errors**
```bash
# Update CORS origins in server/index.js
# Redeploy backend after changes
```

**3. Environment Variables**
```bash
# Double-check all environment variables
# Ensure no trailing spaces or quotes
# Restart services after changes
```

**4. Database Connection**
```bash
# Verify MongoDB Atlas connection string
# Check IP whitelist (use 0.0.0.0/0 for Render)
# Ensure database user has proper permissions
```

## 📊 Monitoring & Logs

### View Logs
1. Go to your service in Render dashboard
2. Click "Logs" tab
3. Monitor for errors and performance

### Health Checks
- Backend: `https://your-backend-url.onrender.com/api/health`
- Frontend: Check if site loads properly

## 🚀 Post-Deployment

### 1. Test All Features
- [ ] User registration/login
- [ ] Resume builder
- [ ] Job search
- [ ] Wellness tracking
- [ ] API endpoints

### 2. Performance Optimization
- Enable compression in Express
- Optimize React build size
- Use CDN for static assets

### 3. Custom Domain (Optional)
1. Purchase domain
2. Add custom domain in Render
3. Update CORS settings
4. Configure DNS records

## 🔄 Continuous Deployment

Render automatically deploys when you push to your main branch:

1. **Make changes** to your code
2. **Commit and push** to GitHub
3. **Render automatically** rebuilds and deploys
4. **Monitor logs** for any issues

## 💡 Tips for Success

1. **Free Tier Limitations**
   - Services sleep after 15 minutes of inactivity
   - Cold starts may take 30+ seconds
   - Consider upgrading for production use

2. **Database Optimization**
   - Use MongoDB Atlas (not local MongoDB)
   - Optimize queries for performance
   - Set up proper indexes

3. **Security Best Practices**
   - Use strong JWT secrets
   - Keep API keys secure
   - Enable HTTPS only
   - Implement rate limiting

## 🆘 Need Help?

- **Render Docs**: [render.com/docs](https://render.com/docs)
- **GitHub Issues**: Create an issue in your repository
- **Render Support**: Available in dashboard

---

**Your AspireAI app will be live at:**
- **Frontend**: `https://your-frontend-name.onrender.com`
- **Backend**: `https://your-backend-name.onrender.com`

🎉 **Congratulations! Your app is now deployed!**