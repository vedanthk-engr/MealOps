# 🍱 MealOps | Smart Hostel Mess Management

MealOps is a comprehensive solution for managing large-scale hostel mess operations with ease. It integrates a **FastAPI** backend, a **Next.js** administrative/user portal, and a **Flutter** mobile application for smart nutrition tracking and attendance.

---

## 🏗️ Project Architecture

The project is structured as a monorepo containing three main components:

| Module | Technology | Description |
| :--- | :--- | :--- |
| **`mealops_backend`** | FastAPI, Prisma, SQLite | Core logic, API services, database management. |
| **`mealops_flutter`** | Flutter, Riverpod, GoRouter | Cross-platform mobile app for students and mess workers. |
| **`mealops_web`** | Next.js, Tailwind CSS, Zustand | Web dashboard for admin operations and analytics. |

---

## ✨ Key Features

- **Smart Attendance**: QR-based scanning for quick entry and exit.
- **Nutrition Tracking**: Insightful analytics on daily intake and meal quality.
- **Menu Management**: Real-time updates for mess menus and special announcements.
- **Admin Dashboard**: Comprehensive control panel for staff and management.
- **Multimodal Scanning**: AI-powered image analysis for food waste monitoring (planned).

---

## 🚀 Getting Started

### 1. Prerequisites
- **Python 3.12+**
- **Flutter SDK**
- **Node.js 20+**

### 2. Installation & Setup

#### **Backend (FastAPI)**
```bash
cd mealops_backend
pip install -r requirements.txt
python -m prisma generate
uvicorn main:app --reload
```

#### **Web Frontend (Next.js)**
```bash
cd mealops_web
npm install
npm run dev
```

#### **Mobile App (Flutter)**
```bash
cd mealops_flutter
flutter pub get
flutter run
```

---

## 🛠️ Tech Stack

- **Backend**: FastAPI, Prisma (ORM), SQLite (Development), Uvicorn.
- **Frontend**: Next.js, React, Tailwind CSS, Shadcn/UI, Framer Motion.
- **Mobile**: Flutter, Riverpod (State Management), Dio (Networking).
- **Other Tools**: Clarifai (Vision AI), Cloudinary (Image Storage), JWT (Authentication).

---

## 🤝 Contribution

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## ⚖️ License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  <i>Developed for VIT Chennai Smart Hostel. Built with ❤️ by the MealOps Team.</i>
</p>
