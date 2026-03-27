# ⚡ QuickAI

> A full-stack AI-powered SaaS platform for content creation — write articles, generate images, remove backgrounds, review resumes, and more.

---

## 🌐 Live Link

🔗 https://quick-ai-beta-two.vercel.app/

---

## 📌 About

**QuickAI** is a modern, full-stack AI SaaS application built with the MERN stack. It brings together multiple powerful AI tools in one clean dashboard — helping users create content, manipulate images, and improve their professional profiles with ease.

---

## ✨ Features

- 📝 **Write Articles** — Generate high-quality, SEO-friendly articles on any topic
- 🖼️ **Generate Images** — Create AI-generated images from text prompts
- ✂️ **Remove Background** — Instantly remove image backgrounds with AI
- 🧹 **Remove Objects** — Erase unwanted objects from images
- 📄 **Review Resume** — Upload your resume and get AI-powered feedback & suggestions
- 🏷️ **Blog Title Generator** — Get catchy, keyword-driven blog titles
- 🏘️ **Community** — Browse and explore creations from other users
- 📊 **Dashboard** — Track your creations, manage plans, and access all tools

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **AI** | Google Gemini API |
| **Auth** | Clerk |
| **Media** | Cloudinary |
| **Deployment** | Vercel |

---

## 📁 Project Structure

```
QuickAI/
├── client/               # React Frontend
│   └── src/
│       ├── components/   # Reusable UI components
│       └── pages/        # Route-based pages
├── server/               # Express Backend
│   ├── routes/           # API routes
│   └── controllers/      # Business logic
├── .gitignore
└── package-lock.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn
- API keys: Gemini, Clerk, Cloudinary

### Installation

```bash
# Clone the repository
git clone https://github.com/parthpm21/QuickAI.git
cd QuickAI

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Environment Variables

Create a `.env` file in the `/server` directory:

```env
GEMINI_API_KEY=your_gemini_api_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Create a `.env` file in the `/client` directory:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_SERVER_URL=http://localhost:5000
```

### Running Locally

```bash
# Start the backend server
cd server
npm run dev

# In a new terminal, start the frontend
cd client
npm run dev
```

The app will be running at `http://localhost:5173`

---

## 👨‍💻 Author

**Parth** — [@parthpm21](https://github.com/parthpm21)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
