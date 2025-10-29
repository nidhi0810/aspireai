# AspireAI - AI-Powered Job Search Platform

A comprehensive job search platform that leverages artificial intelligence to help job seekers optimize their applications, track their progress, and maintain their mental wellness throughout the job search journey.

## ✨ Features

- **🤖 AI Resume Builder**: Create ATS-optimized resumes with AI assistance
- **🔍 Smart Job Search**: Find relevant opportunities with AI-powered matching
- **📊 Wellness Tracking**: Monitor mental health with personalized insights
- **📝 Cover Letter Generator**: Generate personalized cover letters
- **📈 Analytics Dashboard**: Visualize job search progress and metrics
- **🎯 Goal Setting**: Set and track wellness and career goals

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern UI with hooks and functional components
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Zustand** - Lightweight state management
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

### Backend
- **Node.js & Express.js** - Server-side runtime and framework
- **MongoDB & Mongoose** - NoSQL database with ODM
- **JWT Authentication** - Secure user authentication
- **OpenAI API** - AI-powered content generation
- **RapidAPI** - Job search integration
- **Helmet & Rate Limiting** - Security middleware

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (local installation or Atlas account)
- **OpenAI API Key** ([Get one here](https://platform.openai.com/api-keys))
- **RapidAPI Key** ([Sign up here](https://rapidapi.com/))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/aspireai.git
cd aspireai
```

2. **Install dependencies**
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. **Set up environment variables**
```bash
# In the server directory
cp .env.example .env
```

Edit the `.env` file with your actual values:
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aspireai
JWT_SECRET=your_super_secure_jwt_secret_key_here
OPENAI_API_KEY=sk-your_openai_api_key
RAPIDAPI_KEY=your_rapidapi_key
NODE_ENV=development
```

4. **Start the development servers**
```bash
# Terminal 1: Start backend (from server directory)
npm run dev

# Terminal 2: Start frontend (from client directory)
cd ../client
npm start
```

5. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📚 API Documentation

### 🔐 Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Get current user |

### 📄 Resume Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/resume/create` | Create new resume |
| GET | `/api/resume/list` | Get user's resumes |
| PUT | `/api/resume/:id` | Update resume |
| DELETE | `/api/resume/:id` | Delete resume |

### 💼 Job Search
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs/search` | Search jobs |
| POST | `/api/jobs/save` | Save job |
| GET | `/api/jobs/saved` | Get saved jobs |

### 🧠 Wellness Tracking
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/wellness/log` | Log daily wellness data |
| GET | `/api/wellness/today` | Get today's wellness data |
| GET | `/api/wellness/weekly` | Get weekly wellness data |
| GET | `/api/wellness/insights` | Get AI wellness insights |
| POST | `/api/wellness/goals` | Set wellness goals |
| GET | `/api/wellness/goals` | Get wellness goals |

### 🤖 AI Services
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/generate-summary` | Generate resume summary |
| POST | `/api/ai/optimize-resume` | Optimize for ATS |
| POST | `/api/ai/generate-cover-letter` | Generate cover letter |

## 🗂️ Project Structure

```
aspireai/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── store/         # State management
│   │   └── App.js         # Main app component
│   └── package.json
├── server/                # Node.js backend
│   ├── middleware/        # Custom middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── utils/            # Utility functions
│   └── index.js          # Server entry point
├── docs/                 # Documentation
└── README.md
```

## 🔧 Configuration

### MongoDB Setup
1. **Local MongoDB**: Install MongoDB locally or use Docker
2. **MongoDB Atlas**: Create a free cluster at [mongodb.com](https://www.mongodb.com/atlas)
3. **Connection**: Update `MONGODB_URI` in your `.env` file

### API Keys Setup
1. **OpenAI**: Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. **RapidAPI**: Sign up at [RapidAPI](https://rapidapi.com/) and subscribe to job search APIs

## 🎨 Design System
- **Primary**: #6366F1 (indigo)
- **Success**: #22C55E (green)
- **Warning**: #F59E0B (amber)
- **Error**: #EF4444 (red)
- **Modern glassmorphism UI**
- **Light/dark mode support**

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Write clear commit messages
- Add tests for new features
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Help

- **Issues**: [GitHub Issues](https://github.com/yourusername/aspireai/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/aspireai/discussions)

## 🙏 Acknowledgments

- OpenAI for providing powerful AI capabilities
- MongoDB for reliable database services
- The React and Node.js communities for excellent tools and libraries

---

**Made with ❤️ by the AspireAI Team**