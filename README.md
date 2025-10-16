# 🧠 The Mindmates

[![wakatime](https://wakatime.com/badge/user/018ca5a4-e0f2-4fab-834f-1af422477677/project/2f280196-2e60-4e42-9b94-55045df8d859.svg)](https://wakatime.com/badge/user/018ca5a4-e0f2-4fab-834f-1af422477677/project/2f280196-2e60-4e42-9b94-55045df8d859)


![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Status](https://img.shields.io/badge/Status-In%20Development-yellow)
![Built with React](https://img.shields.io/badge/Built%20with-React-blue)
![Backend-Firebase](https://img.shields.io/badge/Backend-Firebase-orange)
![Backend-Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![Server-Express](https://img.shields.io/badge/Server-Express-lightgrey)
![Frontend-Vite](https://img.shields.io/badge/Frontend-Vite-purple)


**THE MINDMATES** is a next-gen mental wellness platform that blends **AI therapy**, **peer support**, **doctor consultations**, and **mood tracking** to create a connected space for mental well-being – especially for teenagers and young adults in India.

---

## 🌟 Features

### 1. 🤖 AI Therapist & Talking Buddy
- 24/7 chatbot trained in therapeutic dialogue  
- Mood-based support and journaling prompts  
- Multilingual support: Hindi, English, Tamil & more  

### 2. 🩺 Book a Doctor
- Schedule consultations with licensed professionals  
- Secure time-slot booking and video call integration  
- Fully confidential via Firebase Authentication  

### 3. 📊 Smart Mood Tracker
- Log daily mood, stressors, and triggers  
- AI-generated wellness suggestions  
- Visual analytics and mood charts  

### 4. 🌍 MindConnect – Safe Community
- Join moderated circles (Teens Circle, Youth Circle, etc.)  
- Engage in forums and virtual events  
- AI + human moderation for safety  

### 5. 🔊 Hardware Integration *(Coming Soon)*
- Smart device/wearable support  
- Biofeedback-based alerts and stress monitoring  

---

## 🚀 Tech Stack

| Layer         | Technology                                           |
|---------------|------------------------------------------------------|
| **Frontend**  | React.js, Vite, Tailwind CSS, ShadCN UI, Framer Motion     |
| **Backend**   | Node.js, Express.js, Firebase (Auth, Firestore)            |
| **AI Engine** | Rasa, OpenAI (GPT), IndicTrans for Indian Languages        |
| **Animations**| GSAP, Framer Motion                                        |
| **Deployment**| Vercel / Netlify / Render                                  |

---

## 📦 Getting Started


### 1. Clone the Repository

```bash
git clone https://github.com/Rohansingh3001/Mindmate.git
cd Mindmate
```

### 2. Setup Backend

```bash
cd Backend
npm install
# Copy .env.example to .env and fill in required values
npm start
# or
node server.js
```

### 3. Setup Frontend

```bash
cd ../Mental-health
npm install
# Create a .env file with your backend URL:
# VITE_BACKEND_URL=http://localhost:5000
npm run dev
```

---


## 🌐 Deployment

- **Vercel/Netlify:** Deploy the `Mental-health` folder as a static site. For SPA routing, add a rewrite config:
  - **Vercel:** Add `vercel.json` to the root of `Mental-health/`:
    ```json
    {
      "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
    }
    ```
  - **Netlify:** Add a `_redirects` file to `public/`:
    ```
    /*    /index.html   200
    ```
- **Render:** Add `static.json` to `Mental-health/`:
    ```json
    {
      "routes": [ { "src": "/.*", "dest": "/index.html" } ]
    }
    ```

---


## ⚙️ Environment Variables

- **Frontend:**
  - `VITE_BACKEND_URL` – URL of your backend server (e.g., `https://your-backend.onrender.com`)
- **Backend:**
  - See `Backend/.env.example` for required variables (Firebase, API keys, etc.)

---


## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---


