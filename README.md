# SkillPort - EdTech Platform

SkillPort is a full-stack educational platform that connects instructors and students, offering a wide range of courses across various categories. The platform includes features for user authentication, course creation, content management, payment processing, and more.

## 🚀 Features

- **User Authentication** - Secure login/signup with email verification and password reset
- **Role-Based Access Control** - Different dashboards for students, instructors, and admins
- **Course Management** - Create, update, and manage course content
- **Content Organization** - Structured courses with sections and subsections
- **Media Integration** - Support for video lectures and downloadable resources
- **Payment Processing** - Integrated with Razorpay for secure transactions
- **Rating and Reviews** - Student feedback system for courses
- **Responsive Design** - Works seamlessly across devices
- **User Dashboard** - Personalized experience for all users
- **Course Progress Tracking** - Students can track their progress through courses
- **Profile Management** - Users can update their profile information and profile picture

## 🛠️ Tech Stack

### Frontend
- React.js
- Redux Toolkit (State Management)
- Tailwind CSS (Styling)
- React Router (Navigation)
- Axios (API calls)
- Chart.js (Data visualization)
- React Form Hook (Form validation)
- React Hot Toast (Notifications)

### Backend
- Node.js
- Express.js
- MongoDB (Database)
- Mongoose (ODM)
- JWT (Authentication)
- Bcrypt (Password hashing)
- Cloudinary (Media storage)
- Nodemailer (Email services)
- Razorpay (Payment gateway)

## 📋 Prerequisites

- Node.js (v14.0.0 or later)
- MongoDB (local or Atlas URI)
- Cloudinary account for media storage
- Razorpay account for payment processing
- Code editor (VS Code recommended)

## 🚦 Getting Started

Follow these steps to set up and run the SkillPort project on your local machine:

### 1. Clone the Repository

```bash
git clone https://github.com/Sparkonix11/SkillPort.git
cd SkillPort
```

### 2. Install Dependencies

Install frontend dependencies:
```bash
npm install
```

Install backend dependencies:
```bash
cd server
npm install
cd ..
```

### 3. Environment Configuration

#### Frontend Environment Setup

Create a `.env` file in the root directory:
```
REACT_APP_BASE_URL=http://localhost:4000/api/v1
```

#### Backend Environment Setup

Create a `.env` file in the server directory with the following variables:
```
# Server Configuration
PORT=4000
MONGODB_URL=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Cloudinary Configuration
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
FOLDER_NAME=your_folder_name

# Razorpay Configuration
RAZORPAY_KEY=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_key_secret

# Email Configuration
MAIL_HOST=your_mail_host
MAIL_USER=your_mail_user
MAIL_PASS=your_mail_password
```

### 4. Database Setup

Ensure MongoDB is running locally or use MongoDB Atlas. The application will create the necessary collections automatically.

### 5. Run the Application

Start both frontend and backend concurrently:
```bash
npm run dev
```

This will start:
- Frontend server at http://localhost:3000
- Backend server at http://localhost:4000

### 6. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 📂 Project Structure

```
Edtech-website/
├── public/                 # Static files
├── server/                 # Backend code
│   ├── config/             # Server configurations
│   ├── controllers/        # Request handlers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middlewares
│   ├── utils/              # Utility functions
│   └── index.js            # Server entry point
└── src/                    # Frontend code
    ├── assets/             # Images, fonts, etc.
    ├── components/         # Reusable components
    ├── data/               # Static data
    ├── hooks/              # Custom React hooks
    ├── pages/              # Application pages
    ├── reducers/           # Redux reducers
    ├── services/           # API services
    ├── slices/             # Redux slices
    └── utils/              # Utility functions
```

## 🧪 Testing

Run tests for the frontend:
```bash
npm test
```

## 🚢 Deployment

### Frontend Deployment
The frontend can be deployed to platforms like Vercel, Netlify, or AWS Amplify.

```bash
npm run build
```

### Backend Deployment
The backend can be deployed to platforms like Heroku, AWS, or DigitalOcean.

Happy Learning with SkillPort! 📚
