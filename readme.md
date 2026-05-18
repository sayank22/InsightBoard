## Made By - Sayan Kundu

**Full Stack Developer | Hands On Experince in EdTech & Fintech | Passionate about building real-world solutions**

---

## 🔗 Links
[![Resume](https://img.shields.io/badge/View_Resume-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://drive.google.com/file/d/1c0JPOQJcRBYOldQvooPfd4gQQ0kkJgbq/view?usp=drive_link)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/sayan-kundu-70b5442b6/)
[![Github](https://img.shields.io/badge/github-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://github.com/sayank22)
[![Portfolio](https://img.shields.io/badge/Portfolio-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://sayan-kundu-portfolio.netlify.app)

---

# InsightBoard

Live Demo: [https://insight-board-sayankundu.vercel.app/](https://insight-board-sayankundu.vercel.app/)

---

# InsightBoard - Enterprise Analytics Platform

An enterprise-grade, theme-aware analytics platform built with the MERN stack, Next.js, and D3.js. Features real-time multi-parameter data filtering, automated insights carousels, dynamic responsive SVG charts with React-embedded custom axes/icon legends, and anchors.

## Features

- **Interactive Analytics Dashboard:**  
  Visualizes complex datasets through dynamic and responsive charts.

- **Advanced D3.js Visualizations:**  
  Includes bar charts, bubble charts, trend analysis, donut charts, and regional insights.

- **Real-Time Data Filtering:**  
  Filter dashboard data by sector, topic, region, country, city, PESTLE, year, and intensity.

- **Responsive Enterprise UI:**  
  Fully optimized for desktop, tablet, and mobile devices.

- **Light & Dark Theme Support:**  
  Modern theme system with light, dark, and system mode support.

- **Advanced Sidebar Navigation:**  
  Multi-level expandable navigation with industry-style dashboard layout.

- **Interactive Search System:**  
  Smart global search with categorized results and quick navigation.

- **Insightful Statistics Section:**  
  Displays key business metrics and analytical summaries dynamically.

- **Interactive Data Table:**  
  Includes pagination, search, row actions, export functionality, and dynamic topic/category icons.

- **Country Flag Integration:**  
  Displays country-wise analytics with dynamic flag rendering.

- **Modern UI/UX Design:**  
  Glassmorphism-inspired enterprise dashboard interface with smooth transitions and hover effects.

- **REST API Integration:**  
  Fetches and manages analytics data through Express.js APIs.

- **MongoDB Data Management:**  
  Stores and retrieves structured analytics data efficiently.

- **Production-Ready Deployment:**  
  Frontend deployed on Vercel and backend deployed on Render.


---

## 🛠 Tech Stack

### Frontend
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![D3.js](https://img.shields.io/badge/d3-F9A03C?style=for-the-badge&logo=d3&logoColor=white)
![React Router](https://img.shields.io/badge/react_router-%23CA4245.svg?style=for-the-badge&logo=react-router&logoColor=white)

### Backend & Database
<img src="https://img.shields.io/badge/Node.js-5FA04E?style=for-the-badge&logo=nodedotjs&logoColor=white" />
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/mongoose-%23880000.svg?style=for-the-badge&logo=mongoose&logoColor=white)

### Deployment
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/render-%2346E3B7.svg?style=for-the-badge&logo=render&logoColor=white)


---

## 🌐 Live Links

**🔗 Frontend: [https://insight-board-sayankundu.vercel.app](https://insight-board-sayankundu.vercel.app)**  
**🔗 Backend API: [https://insightboard-kbzv.onrender.com](https://insightboard-kbzv.onrender.com)**

---


## Getting Started (Run Locally)

# 1. Clone the repo
   ```bash
   git clone https://github.com/sayank22/InsightBoard
cd InsightBoard
   ```

# 2. Backend Setup
   ```bash
  cd server
npm install

   ```
**Create a .env file in /Server:**
```ini
MONGO_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173 (Or your frontend deployed link)

```
**Run the server:**
```bash

node server.js

```

# 3. Frontend Setup
   ```bash
  cd client
npm install

   ```
**Create a .env file in /client:**
```ini
VITE_API_URL=http://localhost:5000 (Or your backend deployed link)

```
**Run the server:**
```bash

npm run dev

```
---

## Demo

See it live: [https://insight-board-sayankundu.vercel.app](https://insight-board-sayankundu.vercel.app)

![Desktop Demo 1](client/src/assets/Screenshot.png)