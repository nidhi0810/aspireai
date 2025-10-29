# JSearch API Setup Guide

## 🔑 Getting Your RapidAPI Key for JSearch

### Step 1: Create RapidAPI Account
1. Go to [RapidAPI.com](https://rapidapi.com/)
2. Sign up for a free account
3. Verify your email address

### Step 2: Subscribe to JSearch API
1. Search for "JSearch" in the RapidAPI marketplace
2. Go to [JSearch API page](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch)
3. Click "Subscribe to Test" 
4. Choose a pricing plan:
   - **Free Plan**: 100 requests/month
   - **Basic Plan**: $10/month for 1,000 requests
   - **Pro Plan**: $25/month for 5,000 requests

### Step 3: Get Your API Key
1. After subscribing, go to the "Endpoints" tab
2. Your API key will be shown in the code examples
3. Copy the `X-RapidAPI-Key` value

### Step 4: Configure AspireAI
1. Open `server/.env` file
2. Replace `your_rapidapi_key_here` with your actual API key:
   ```env
   RAPIDAPI_KEY=your_actual_rapidapi_key_here
   ```

### Step 5: Install Dependencies
```bash
cd server
npm install axios
```

### Step 6: Test the Integration
1. Start your server: `npm run dev`
2. Go to the Jobs page in AspireAI
3. Search for jobs with a specific location
4. You should see "Real Job" badges on results from JSearch API

## 🌟 JSearch API Features

### ✅ What JSearch Provides:
- **Real job listings** from major job boards
- **Location-based search** (cities, states, countries)
- **Remote job filtering**
- **Salary information** when available
- **Company logos** and details
- **Job requirements** and descriptions
- **Employment types** (Full-time, Part-time, Contract, etc.)
- **Date posted** filtering
- **Experience level** filtering

### 🔍 Search Parameters:
- `query`: Job title, keywords, or company name
- `location`: City, state, or country (e.g., "New York", "California", "United States")
- `remote_jobs_only`: Filter for remote positions only
- `employment_types`: FULLTIME, PARTTIME, CONTRACTOR, INTERN
- `job_requirements`: under_3_years_experience, more_than_3_years_experience, no_experience
- `date_posted`: all, today, 3days, week, month

### 📊 Response Data:
Each job includes:
- Job title and description
- Company name and logo
- Location (with remote indicator)
- Salary range (when available)
- Application URL
- Posted date
- Employment type
- Required experience
- Job highlights

## 🔄 Fallback System

If the JSearch API is unavailable or you haven't configured the API key:
- **Automatic fallback** to mock data
- **Location-aware** mock results
- **No service interruption**
- **Clear indicators** showing data source

## 💡 Usage Tips

### Best Practices:
1. **Be specific** with search queries (e.g., "React Developer" vs "Developer")
2. **Use real locations** (e.g., "San Francisco, CA" vs "SF")
3. **Combine filters** for better results
4. **Monitor API usage** to stay within limits

### Example Searches:
- `query: "Software Engineer"` + `location: "Seattle, WA"`
- `query: "Data Scientist"` + `location: "Remote"`
- `query: "Product Manager"` + `location: "New York, NY"`

## 🚨 Troubleshooting

### Common Issues:

**1. "Job search failed" error:**
- Check your RapidAPI key in `.env`
- Verify you're subscribed to JSearch API
- Check your API usage limits

**2. No results returned:**
- Try broader search terms
- Check if location is spelled correctly
- Remove filters and try again

**3. Rate limit exceeded:**
- Wait for your monthly limit to reset
- Upgrade to a higher plan
- App will automatically use mock data

**4. API key not working:**
- Ensure no extra spaces in `.env` file
- Restart your server after updating `.env`
- Verify the key is correct in RapidAPI dashboard

## 📈 Monitoring Usage

Track your API usage in the RapidAPI dashboard:
1. Go to [RapidAPI Dashboard](https://rapidapi.com/developer/dashboard)
2. Click on "My Subscriptions"
3. View usage statistics for JSearch API

## 🔧 Development vs Production

### Development:
- Use free tier for testing
- Mock data fallback for development without API key
- Console logs show API responses

### Production:
- Upgrade to appropriate paid plan
- Monitor usage and set up alerts
- Implement caching for frequently searched terms
- Consider rate limiting on frontend

The integration is now complete and will provide real job search results based on user location and preferences!