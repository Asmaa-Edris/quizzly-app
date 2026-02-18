# 🚀 Quizzly-App | Full-Stack Learning Platform

<div align="center">
  <img src="https://api.dicebear.com/7.x/icons/svg?seed=Quizzly&icon=mortarboard&backgroundColor=6366f1" width="100" />
  <p><strong>Ignite Your Mind with Intelligent Assessments</strong></p>
</div>

---

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

**Quizzly** is a modern, high-fidelity quiz application. This project showcases a premium **User Experience (UX)** with a strong focus on **Security UI**, featuring a dynamic password strength engine and a sleek, responsive design.

## ✨ Key Features

* **🛡️ Smart Security UI:** * **Interactive Password Strength Meter:** Visual feedback (Red/Yellow/Green) based on password complexity.
    * **Live Validation Checklist:** Real-time tracking of security requirements (Uppercase, Numbers, Symbols).
* **🎨 Premium Design:** Built with **Tailwind CSS**, featuring an Indigo-themed interface and glassmorphism elements.
* **⏳ Advanced Loading:** Custom "OLED-ready" minimalist loaders for a smooth perceived performance.
* **📱 Fully Responsive:** Optimized for mobile, tablet, and desktop screens.
* **🔔 Instant Notifications:** Uses **React-hot-toast** for elegant, non-intrusive user feedback.

## 🛠️ Tech Stack

### Frontend (`/quiz-app`)
* **Core:** React.js (Vite)
* **Styling:** Tailwind CSS
* **State & Logic:** React Hooks (`useState`, `useEffect`, `useMemo`)
* **Icons:** React Icons (FontAwesome, Lucide)
* **Routing:** React Router Dom

### Backend (`/backend`)
* **Environment:** Node.js
* **Framework:** Express.js
* **Security:** JWT (JSON Web Tokens) for identity verification.

## 🧩 Password Security Logic
The registration system uses a **Regex-based engine** to ensure user safety. It validates:
1.  **Length:** Minimum 8 characters.
2.  **Casing:** At least one Uppercase letter (A-Z).
3.  **Digits:** At least one Number (0-9).
4.  **Symbols:** At least one special character (e.g., #, @, $).



## 🚀 Installation & Setup

1.  **Clone the project:**
    ```bash
    git clone [https://github.com/Asmaa-Edris/quizzly-app.git](https://github.com/Asmaa-Edris/quizzly-app.git)
    ```

2.  **Setup Frontend:**
    ```bash
    cd quizzly-app/quiz-app
    npm install
    npm run dev
    ```

3.  **Setup Backend:**
    ```bash
    cd ../backend
    npm install
    npm start
    ```

## 📂 Project Structure
```text
quizzly-app/
├── quiz-app/       # React + Vite Frontend
│   ├── src/
│   │   ├── components/  # Reusable UI parts
│   │   ├── pages/       # AuthPage, Dashboard
│   │   └── utils/       # Axios & Helper Logic
└── backend/        # Node.js API & Authentication
