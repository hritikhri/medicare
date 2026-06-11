# 🏥 MediConnect

<div align="center">

Full-Stack Healthcare Appointment Management Platform

Built with React.js, Node.js, Express.js, MongoDB, Socket.IO, and Cloudinary

</div>

---

## 📖 Overview

MediConnect is a full-stack healthcare management platform that streamlines the appointment booking process between doctors and patients. The application provides secure authentication, real-time appointment updates, cloud-based document management, and role-based access control to deliver a seamless healthcare experience.

---

## ✨ Key Features

- 🔐 Secure JWT Authentication & Authorization
- 👨‍⚕️ Role-Based Access for Doctors and Patients
- 📅 Appointment Scheduling & Management
- 🔔 Real-Time Notifications using Socket.IO
- ☁️ Cloudinary Integration for Image Uploads
- 📄 Medical Record Management
- 📱 Fully Responsive User Interface
- ⚡ RESTful API Architecture

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- JavaScript (ES6+)
- Tailwind CSS
- Axios

### Backend

- Node.js
- Express.js
- JWT Authentication
- Bcrypt.js
- Socket.IO

### Database

- MongoDB
- Mongoose

### Tools & Services

- Git & GitHub
- Cloudinary
- Postman

---

## 🏗️ System Architecture

```text
Client (React)
      │
      ▼
Express REST APIs
      │
      ▼
Authentication Layer
      │
      ▼
MongoDB Database
      │
      ▼
Cloudinary Storage

Socket.IO ↔ Real-Time Notifications
```

---

## 📸 Screenshots

| Home Page | Dashboard |
|-----------|-----------|
<img width="2958" height="1403" alt="image" src="https://github.com/user-attachments/assets/d7f0b551-4675-471f-b603-b1a3d17872b6" />
<img width="2932" height="1396" alt="image" src="https://github.com/user-attachments/assets/ddf5500b-422d-42d3-8932-eb859808f018" />
<img width="2269" height="1087" alt="image" src="https://github.com/user-attachments/assets/d7bd1903-0e34-4557-9cc6-30d695e4846a" />




| Appointment Booking | Profile Management |
|---------------------|-------------------|
<img width="2898" height="1391" alt="image" src="https://github.com/user-attachments/assets/ee852746-ddb3-4e6e-8326-0f7cc407be80" />
<img width="2908" height="1396" alt="image" src="https://github.com/user-attachments/assets/caaff382-f964-4634-af9b-70820b585999" />
<img width="2668" height="1281" alt="image" src="https://github.com/user-attachments/assets/ce37fe17-ad2c-4ea6-8c23-121ac52a995f" />
<img width="2385" height="1130" alt="image" src="https://github.com/user-attachments/assets/0c0b715b-0313-49fe-850b-230da0b957de" />

|Doctor's Profile|
| Home Page | Dashboard |
|-----------|-----------|
<img width="2667" height="1273" alt="image" src="https://github.com/user-attachments/assets/de3503c6-dc41-42c0-b89c-150b7576fc6d" />
<img width="2902" height="1372" alt="image" src="https://github.com/user-attachments/assets/2d522189-4389-4dad-abeb-fa75d5830d02" />
<img width="2820" height="1374" alt="image" src="https://github.com/user-attachments/assets/307da5f5-c20f-4857-80fc-4966d2b56f8b" />
<img width="2756" height="1374" alt="image" src="https://github.com/user-attachments/assets/a0f99c15-1136-455b-a6d4-06c3bb6ffc29" />


---

## 🚀 Getting Started

### Prerequisites

- Node.js
- MongoDB
- Git

### Installation

```bash
# Clone Repository
git clone https://github.com/yourusername/mediconnect.git

# Navigate to Project
cd mediconnect

# Install Client Dependencies
cd client
npm install

# Install Server Dependencies
cd ../server
npm install
```

### Environment Variables

Create a `.env` file inside the server directory:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret
```

### Run Application

```bash
# Start Backend
npm run server

# Start Frontend
npm run dev
```

---

## 📂 Project Structure

```text
MediConnect
│
├── client
│   ├── src
│   ├── components
│   ├── pages
│   └── services
│
├── server
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── sockets
│   └── config
│
└── README.md
```

---

## 🔒 Security Features

- Password Hashing with Bcrypt
- JWT-Based Authentication
- Protected API Routes
- Secure User Sessions
- Role-Based Authorization

---

## 📈 Future Enhancements

- Video Consultation System
- Online Payment Integration
- Email & SMS Notifications
- AI-Based Appointment Recommendations
- Admin Analytics Dashboard

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

---

## 👨‍💻 Author

**Hritik Kumar**

- GitHub: https://github.com/hritikhri
- LinkedIn: https://linkedin.com/in/https://www.linkedin.com/in/hritik-kumar-7808935260987654485587578/

---

## ⭐ Support

If you found this project useful, consider giving it a star on GitHub.

```
⭐ Star the repository if you like the project.
```
