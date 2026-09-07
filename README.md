Folia Backend 🔐

REST API backend for Folia, a full-stack notes management application.

The API provides user authentication, email verification, password recovery, account management and CRUD operations for personal notes.

🌐 Live Application

Folia — Live Demo

🛠️ Technologies
Node.js
Express.js
MongoDB
Mongoose
JSON Web Tokens (JWT)
bcrypt
Nodemailer
dotenv
CORS
✨ Features
Authentication
User registration
Email account verification
User login
JWT-based authentication
Protected routes
Password recovery through email
Password reset
Account deletion
Notes

Authenticated users can:

Create notes
Retrieve their own notes
Update notes
Delete notes

Each note belongs to a specific user, ensuring that users can only access their own notes.

Account Management

Users can permanently delete their account.

When an account is deleted, all notes associated with that account are also removed from the database.

🏗️ Project Structure

The backend follows a modular architecture that separates responsibilities between different layers.

src/
├── config/
├── controllers/
├── helpers/
├── middlewares/
├── models/
├── routes/
└── main.js

Main responsibilities
Routes — Define API endpoints and HTTP methods.
Controllers — Handle requests and application logic.
Models — Define MongoDB data models using Mongoose.
Middlewares — Handle authentication and request processing.
Helpers — Contain reusable application logic.
Config — Manage database and environment configuration.
main.js — Configures the Express application, middleware, routes and server.
🔐 Authentication

Folia uses JWT-based authentication to protect private resources.

Authentication is required for:

Notes endpoints
Account deletion
Profile endpoint

The notes router applies the authentication middleware to all of its routes, ensuring that every notes operation is performed by an authenticated user.

📡 API Endpoints
Authentication
Method	Endpoint	Authentication	Description
POST	/api/auth/register	No	Register a new user
GET	/api/auth/verify-email	No	Verify a user's email
POST	/api/auth/login	No	Authenticate a user
POST	/api/auth/forgot-password	No	Request password recovery
POST	/api/auth/reset-password	No	Reset the user's password
DELETE	/api/auth/delete-account	🔒 Yes	Delete the authenticated user's account
Notes

All notes endpoints require authentication.

Method	Endpoint	Authentication	Description
GET	/api/notes	🔒 Yes	Retrieve the authenticated user's notes
POST	/api/notes	🔒 Yes	Create a new note
PUT	/api/notes/:id	🔒 Yes	Update a note
DELETE	/api/notes/:id	🔒 Yes	Delete a note
Profile
Method	Endpoint	Authentication	Description
GET	/api/profile	🔒 Yes	Access the authenticated user's profile
📧 Email Integration

The application uses Nodemailer to handle email-based processes such as:

Account verification
Password recovery

This allows users to verify their accounts and securely recover their passwords through email.

🗄️ Database

The application uses MongoDB as its database, with Mongoose for data modeling and database interaction.

User accounts and notes are stored as related resources, allowing each authenticated user to access only their own notes.

🌍 CORS

The API is configured with CORS to control which frontend applications can communicate with the backend.

During development, cross-origin requests are allowed for local testing.

In production, the allowed frontend origin is configured through environment variables.

⚙️ Environment Variables

Create a .env file and configure the required environment variables.

Example:

PORT=your_port
MODE=development
URL_FRONTEND=http://localhost:5173
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_password


Never commit your .env file or expose your credentials publicly.

🚀 Getting Started
Prerequisites
Node.js
npm
MongoDB database
Installation

Clone the repository:

git clone https://github.com/guidoese/folia_backend.git


Navigate to the project:

cd folia_backend


Install dependencies:

npm install


Configure your environment variables in a .env file.

Start the development server:

npm run dev


The API will be available at the configured local port.

🔗 Related Projects
Frontend

Folia — React Frontend

Live Application

Folia

📚 About the Project

Folia Backend was developed as a practical Full Stack Web Development project as part of my training at Universidad Tecnológica Nacional (UTN).

The project allowed me to practice building a REST API with Node.js and Express, implementing JWT authentication, working with MongoDB and Mongoose, protecting routes with middleware, handling user-related data and integrating email-based account verification and password recovery.

👨‍💻 Author

Guido Suarez

Junior Full Stack Web Developer

GitHub
