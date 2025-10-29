# AspireAI Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- OpenAI API key

## Quick Start

1. **Clone and Install Dependencies**
   ```bash
   git clone <repository-url>
   cd aspire-ai
   npm run install-all
   ```

2. **Environment Setup**
   ```bash
   cd server
   cp .env.example .env
   ```
   
   Edit `.env` with your credentials:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aspireai
   JWT_SECRET=your_jwt_secret_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   NODE_ENV=development
   ```

3. **Start Development Servers**
   ```bash
   npm run dev
   ```
   
   This starts both backend (port 5000) and frontend (port 3000)

## MongoDB Atlas Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address
5. Get the connection string and add it to `.env`

## OpenAI API Setup

1. Create an OpenAI account
2. Generate an API key
3. Add the key to your `.env` file

## Features Overview

### Core Features
- ✅ User Authentication (JWT)
- ✅ AI Resume Builder & ATS Optimizer
- ✅ AI Cover Letter Generator
- ✅ AI Interview Coach with Voice
- ✅ Job Application Tracker
- ✅ Wellness & Mood Tracking
- ✅ Multi-language Support
- ✅ Dark/Light Mode

### AI Integrations
- Resume optimization with ATS scoring
- Personalized cover letter generation
- Interview practice with feedback
- Skill gap analysis
- Salary prediction
- Wellness coaching

### Tech Stack
- **Frontend**: React, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, MongoDB
- **AI**: OpenAI GPT API
- **State Management**: Zustand
- **Authentication**: JWT

## Deployment

### Backend (Railway/Render)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy

### Frontend (Vercel)
1. Connect your GitHub repository
2. Set build command: `cd client && npm run build`
3. Set output directory: `client/build`
4. Deploy

## Development Tips

1. **Hot Reload**: Both frontend and backend support hot reload
2. **API Testing**: Use the `/api/health` endpoint to test backend
3. **Database**: Use MongoDB Compass for database management
4. **Debugging**: Check browser console and server logs

## Troubleshooting

### Common Issues
- **CORS Errors**: Check proxy setting in client/package.json
- **MongoDB Connection**: Verify connection string and IP whitelist
- **OpenAI Errors**: Check API key and rate limits
- **Build Errors**: Clear node_modules and reinstall

### Support
- Check the GitHub issues
- Review the documentation
- Contact the development team