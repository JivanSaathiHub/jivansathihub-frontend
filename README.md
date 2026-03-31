# 📚 JeevanSaathiHub – Frontend

A modern, scalable, and responsive frontend application for the **JeevanSaathiHub** platform, built using React.
This project delivers a seamless user experience for profile discovery, matchmaking, communication, and membership management.

## 🚀 Features

* 🔐 **Authentication UI** – Login & Register flows
* 👤 **User Dashboard** – Profile overview and activity
* 🔍 **Advanced Search & Filters** – Find matches efficiently
* 💬 **Real-time Messaging UI** (Socket integrated)
* ❤️ **Interests & Shortlist System**
* 💳 **Membership Plans & Checkout Flow**
* 🛠️ **Admin Panel UI** (secure access via secret route)
* ⚡ **Custom Navigation System (No React Router)**
* 📱 Fully **Responsive Design** (Mobile + Desktop)


## 🛠️ Tech Stack

* **Frontend:** React.js
* **State Management:** Context API (Auth, Admin, Socket, Navigation)
* **Styling:** Custom CSS (Modern UI)
* **API Handling:** Axios / Fetch
* **Realtime:** Socket Integration


## 📁 Folder Structure

src/
 ├── components/              # Reusable UI components
 │     └── PlanSelectModal.js
 │
 ├── context/                 # Global state management (React Context)
 │     ├── AuthContext.js
 │     ├── AdminContext.js
 │     ├── SocketContext.js
 │     └── FooterNavContext.js
 │
 ├── pages/
 │     ├── user/              # User-facing pages
 │     │     ├── HomePage.js
 │     │     ├── AboutPage.js
 │     │     ├── RegisterPage.js
 │     │     ├── LoginPage.js
 │     │     ├── HelpPage.js
 │     │     ├── SearchPage.js
 │     │     ├── ProfileDetail.js
 │     │     ├── MembershipPlansPage.js
 │     │     ├── CheckoutPage.js
 │     │     ├── PaymentSuccessPage.js
 │     │     ├── InterestsPage.js
 │     │     ├── DashboardPage.js
 │     │     ├── ProfilePage.js
 │     │     ├── MatchesPage.js
 │     │     ├── MessagesPage.js
 │     │     ├── VerificationPage.js
 │     │     ├── EditProfilePage.js
 │     │     ├── SettingsPage.js
 │     │     └── ShortlistPage.js
 │
 │     └── admin/             # Admin panel pages
 │           ├── AdminLayout.js
 │           └── AdminLoginPage.js
 │
 ├── styles/                  # Global styles
 │     └── global.css
 │
 ├── App.js                   # Custom routing & navigation logic
 └── index.js                 # Entry point

## 🧠 Architecture Highlight

This project uses a **custom state-based navigation system** instead of React Router.

* Routing handled inside `App.js`
* Page switching via `useState`
* Centralized navigation functions
* Clean separation of user & admin flows

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

git clone https://github.com/JivanSaathiHub/jivansathihub-frontend.git

### 2️⃣ Navigate to project

cd jivansathihub-frontend

### 3️⃣ Install dependencies

npm install


### 4️⃣ Start development server

npm start


## 🔑 Environment Variables

Create a `.env` file in the root directory:


REACT_APP_API_URL=http://localhost:5000/api



## 📸 Screenshots

> Add your UI screenshots here (Home, Dashboard, Search, Messages, Admin Panel)


## 🌐 Live Demo

> Add deployed link (Netlify / Vercel)


## 🔮 Future Enhancements

* 🔔 Notifications system
* 📊 Advanced analytics dashboard
* 🌍 Multi-language support
* ⚡ Performance optimization (lazy loading)


## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch
3. Commit your changes
4. Push and create a Pull Request


## 📄 License

This project is licensed under the **MIT License**.


## 👨‍💻 Author

**Sahil Pathan**
Frontend Developer 🚀


## ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub!
