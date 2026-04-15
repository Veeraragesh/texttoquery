<div align="center">

# 🧠 Text-to-Query
### Natural Language → SQL. Instantly. Offline. Private.

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat-square&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react&logoColor=black)
![Ollama](https://img.shields.io/badge/Ollama-Mistral-black?style=flat-square)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=flat-square&logo=mysql&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=flat-square&logo=postgresql&logoColor=white)

**Query any database in plain English — no SQL knowledge needed.**  
Powered by Mistral LLM running locally via Ollama. Zero cloud. Zero data leaks.

[Features](#-features) · [Demo](#-demo) · [Getting Started](#-getting-started) · [How It Works](#-how-it-works) · [Tech Stack](#-tech-stack)

</div>

---

## 🚀 What Is This?

Text-to-Query lets you talk to your database like you'd talk to a person.

Instead of writing:
```sql
SELECT department, AVG(salary) FROM employees
WHERE hire_date > '2022-01-01'
GROUP BY department ORDER BY AVG(salary) DESC;
```

You just type:
> *"Show me average salary by department for employees hired after 2022, highest first"*

And it runs. That's it.

---

## ✨ Features

- 🔒 **100% Offline** — Mistral LLM runs locally via Ollama. Your data never leaves your machine.
- 🗄️ **Multi-Database Support** — Works with both MySQL and PostgreSQL.
- 🔌 **Dynamic Credentials** — Connect to any database on the fly with your own credentials.
- ⚡ **Instant Results** — AI-generated SQL is validated and executed in real time.
- 🧾 **Transparent Output** — See the generated SQL *and* the live query results side by side.
- 🛡️ **Safe Execution** — Backend validates and sanitizes queries before running them.

---

## 🏗️ How It Works

```
User types a question in plain English
        │
        ▼
 React frontend sends request to FastAPI
        │
        ▼
 FastAPI calls Mistral LLM (via Ollama, running locally)
        │
        ▼
 Mistral generates SQL based on DB schema + question
        │
        ▼
 FastAPI validates and safely executes the SQL query
        │
        ▼
 Results returned → Frontend shows SQL + result table
```

No external API calls. No third-party services. Everything runs on your machine.

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Backend | FastAPI (Python) |
| LLM | Mistral 7B via Ollama |
| Databases | MySQL, PostgreSQL |
| Communication | REST API |

---

## ⚙️ Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- [Ollama](https://ollama.ai) installed
- MySQL or PostgreSQL running locally or remotely

### 1. Clone the repository

```bash
git clone https://github.com/Veeraragesh/texttoquery.git
cd texttoquery
```

### 2. Pull the Mistral model

```bash
ollama pull mistral
```

### 3. Set up the backend

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### 4. Set up the frontend

```bash
cd frontend
npm install
npm run dev
```

### 5. Open the app

Visit `http://localhost:5173` in your browser.

---

## 📖 Usage

1. **Select your database type** — MySQL or PostgreSQL
2. **Enter your connection credentials** — host, port, database name, username, password
3. **Type your question** in plain English
4. **Hit Run** — see the generated SQL and live results instantly

---


## 🔐 Privacy & Security

- All LLM inference happens **locally** on your machine via Ollama
- No query data, credentials, or results are sent to any external server
- Backend validates generated SQL before execution to prevent destructive queries

---

## 🛣️ Roadmap

- [ ] Schema auto-detection from connected database
- [ ] Query history and saved queries
- [ ] Support for SQLite
- [ ] Export results as CSV / Excel
- [ ] Natural language explanation of query results

---

## 👤 Author

**Veeraragesh V** — Full Stack Developer  
[LinkedIn](https://linkedin.com/in/veeraragesh) · [GitHub](https://github.com/Veeraragesh) · [Portfolio](https://veeraragesh-portfolio.netlify.app)

---

<div align="center">
  <sub>Built with FastAPI + React + Mistral LLM · Runs 100% offline</sub>
</div>
