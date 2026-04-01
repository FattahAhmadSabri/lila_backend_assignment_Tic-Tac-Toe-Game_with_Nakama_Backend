# lila_backend_assignment_Tic-Tac-Toe-Game_with_Nakama_Backend
Multiplayer Tic-Tac-Toe built with Nakama using a server-authoritative architecture for real-time and secure gameplay.
# 🎮 Multiplayer Tic-Tac-Toe (Nakama + Docker)

A **production-ready multiplayer Tic-Tac-Toe backend** built using **Nakama** with a **server-authoritative architecture**, containerized using **Docker** for easy setup and deployment.

---

## 🚀 Tech Stack

* **Nakama** – Real-time game server
* **Docker & Docker Compose** – Containerization
* **PostgreSQL** – Database for Nakama
* **TypeScript / Lua (optional)** – Server logic (if implemented)
* **React (Frontend - optional)** – Client-side UI

---

## 📂 Project Structure

```
.
├── docker-compose.yml
├── nakama/
│   ├── modules/        # Server authoritative game logic
│   └── data/           # Persistent storage (optional)
├── postgres/
│   └── init.sql        # DB initialization (optional)
├── README.md
```

---

## ⚙️ Prerequisites

Make sure you have installed:

* Docker
* Docker Compose

Check versions:

```bash
docker -v
docker-compose -v
```

---

## 🐳 Setup & Run (Step-by-Step)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd <your-project-folder>
```

---

### 2. Start Services

```bash
docker-compose up
```

👉 This will start:

* Nakama server → `http://localhost:7350`
* PostgreSQL database

---

### 3. Run in Detached Mode (Optional)

```bash
docker-compose up -d
```

---

### 4. Stop Services

```bash
docker-compose down
```

---

## 🔐 Default Credentials

* **Username:** admin
* **Password:** password

---

## 🎯 Features

* ✅ Server-authoritative game logic
* ✅ Multiplayer matchmaking
* ✅ Room creation & joining
* ✅ Real-time gameplay updates
* ✅ Cheat prevention (server validation)
* ✅ Scalable backend using Nakama

---

## 🧠 Game Logic (Server Authoritative)

* All moves are validated on the server
* Game state is stored and updated server-side
* Clients cannot manipulate the game directly
* Server broadcasts updates to all players

---

## 📡 API Endpoints (Nakama)

* `http://localhost:7350` → Game server
* `http://localhost:7350/v2/account/authenticate` → Authentication

---

## 🛠️ Common Commands

### Restart Containers

```bash
docker-compose restart
```

### View Logs

```bash
docker-compose logs -f
```

### Rebuild Containers

```bash
docker-compose up --build
```

---

## 🐞 Troubleshooting

### ❌ Nakama exits immediately

* Check logs:

  ```bash
  docker-compose logs nakama
  ```

### ❌ Database connection issue

* Ensure PostgreSQL container is running
* Check environment variables in `docker-compose.yml`

### ❌ Port already in use

* Change ports in `docker-compose.yml`

---

## 📦 Deployment Tips

* Use **separate repositories** for frontend and backend
* Deploy backend (Nakama) on:

  * AWS EC2
  * Railway / Render (if supported)
* Use managed PostgreSQL for production

---

## ✨ Future Improvements

* Add leaderboard system
* Add player authentication (JWT/custom auth)
* Add game history storage
* Improve matchmaking algorithm

---

## 👨‍💻 Author

**Fattah Ahmad Sabri**
Backend Developer (Node.js | Nakama | MongoDB)

---

## 📄 License

This project is licensed under the MIT License.

---

⭐ If you found this helpful, consider giving it a star!
