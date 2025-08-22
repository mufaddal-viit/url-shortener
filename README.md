# 🔗 Short URL with Authentication (Node.js + Express)

This project is a **URL shortener service** built with Node.js and Express, extended with **authentication and session handling**.  
Users must log in to access their dashboard and manage their shortened URLs.  

It demonstrates **cookie-based sessions**, **middleware-based route protection**, and a clean MVC project structure.

---

## ✨ Features

- Shorten long URLs into shareable short links.
- User authentication with cookies (session-based).
- Middleware to protect routes (`restrictToLoggedinUserOnly`).
- In-memory session management (`Map`).
- EJS views for rendering pages.
- Separation of concerns (controllers, routes, services, middlewares).

---
## ⚙️ How Authentication Works

### 1. User Login
- User submits login form (username/password).
- Server validates credentials.
- Generates a **unique session ID** (e.g., using `uuid`).
- this is used for subsequent requests to the server. Brower sends the stored cookie everytime.

##Request Flow
- Accessing Protected Route
- Browser → GET /dashboard
# Middleware (restrictToLoggedinUserOnly):
- Looks for uid cookie.
- If missing → redirect to /login.
- If found → retrieves user via getUser(uid).
- Attaches user to req.user.
- Proceeds to route handler → dashboard page.
  # Logging In
  - Browser → POST /login with credentials.
  - Server:
  - Validates user.

# Creates session ID.

Calls setUser(sessionId, user).

Sends back Set-Cookie: uid=sessionId.

Browser stores cookie → used in all future requests.

3. Visiting Public Page

Browser → GET /login

Middleware (checkAuth):

Reads cookie (if any).

Sets req.user (null if not logged in).

Route can render login page (or redirect if already logged in).

## 🧠 Key Concepts

Cookie-based Authentication
Authentication state is tracked by a cookie containing a session ID.

Middleware
Express middleware enforces access control before routes are executed.

Session Store (in-memory)
A Map is used to store active sessions.
This resets when the server restarts (not persistent).

## Modular Design

middlewares/auth.js: Guards routes.

service/auth.js: Session logic.

controllers/: Business logic.

views/: Rendered pages.
