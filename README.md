# 🛍️ X-Shop - Full-Stack E-Commerce Platform (DevOps Practice Project)

X-Shop is a modern, full-stack e-commerce web application built with the MERN stack. This repository serves as a hands-on sandbox project dedicated to learning, implementing, and practicing core **DevOps principles, containerization, CI/CD pipelines, and Infrastructure as Code (IaC)**.

## ✨ Features

* **Glassmorphism UI/UX**: Modern dark theme with sleek UI components and responsive design.
* **Full E-Commerce Flow**: User authentication, dynamic category navigation, shopping cart management, and secure checkout.
* **Admin Dashboard**: Dedicated portal for store and product management.

## 🛠️ Tech Stack

* **Frontend:** React.js, Tailwind CSS, Vite
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **State Management:** React Context API

---

## 🚀 DevOps Road Map & Future Additions

This project is actively being used for advanced DevOps practice. The following automation and infrastructure components are planned to be integrated soon:

* **🐳 Docker & Docker Compose:** Containerizing the Frontend, Backend, and Admin services for seamless multi-container orchestration.
* **⚙️ Jenkins CI/CD:** Setting up automated build, test, and deployment pipelines upon code commits.
* **☁️ Terraform (IaC):** Provisioning and managing cloud infrastructure (AWS) programmatically.
* **☸️ Kubernetes (K8s):** Deploying containerized microservices for high availability and scalability.

---

## 📂 Project Structure

* `/frontend` - Customer-facing React application.
* `/admin` - Administrative dashboard.
* `/backend` - Node.js & Express REST API server.

## 👤 Author
**Ganesh Veeraboina**
* GitHub: [@GANESHVEERABOINA](https://github.com/GANESHVEERABOINA)

## Environment-independent API routing

The browser applications use relative `/api/...` routes. There is no backend IP or hostname in frontend/admin source code. Vite proxies `/api` to the local backend for `npm run dev`; the shared Nginx gateway routes `/api` to the backend Service in Docker Compose and Kubernetes. Kubernetes Pod IPs may change because the gateway talks to stable Service DNS names (`backend`, `frontend`, and `admin`).

### Local npm development

Run each command in a separate terminal:

```bash
cd backend && npm install && npm run server
cd frontend && npm install && npm run dev
cd admin && npm install && npm run dev
```

Open the storefront at `http://localhost:5173` and the admin panel at `http://localhost:5174`. The Vite proxy defaults to `http://127.0.0.1:4000`. If the backend itself runs somewhere other than the host machine, set `XSHOP_API_PROXY_TARGET` to that runtime's stable service DNS name (not a changing Pod IP) for the Vite process. The browser URL remains `/api/...`.

### Docker Compose

1. Copy the root template to `.env` and set a strong URL-safe alphanumeric MongoDB password:

   ```bash
   cp .env.example .env
   ```

2. Make sure `backend/.env` contains the backend secrets for your environment. For a fresh clone, create it only if missing:

   ```bash
   cp -n backend/.env.example backend/.env
   ```

   Keep real payment/Cloudinary credentials private. The sample uses a local, authenticated MongoDB service; Compose overrides `MONGODB_URI` internally to `mongo` DNS, so no Pod/container IP is needed.

3. Start the stack:

   ```bash
   docker compose up --build -d
   docker compose ps
   docker compose logs -f backend gateway
   ```

   Storefront: `http://localhost:8080/`; admin: `http://localhost:8080/admin/`. Change the published HTTP port only by setting `XSHOP_HTTP_PORT` in the root `.env`; no code URLs need editing. The MongoDB data is persisted in the `xshop-mongo-data` volume and its port is not published to the host.

### Kubernetes

See [`k8s/README.md`](k8s/README.md) and `k8s/x-shop.yaml`. The Kubernetes gateway routes to stable ClusterIP Services; it never targets Pod IPs. Build and push the app images to a registry the cluster can access, create the `xshop-backend-secrets` Secret with a managed MongoDB URI, then apply the manifest. For a local cluster, `kubectl port-forward svc/xshop-gateway 8080:80` exposes the same URL contract.

### API routing contract

- Browser frontend/admin → `/api/...` on the same origin.
- Vite dev server → backend on port `4000` through the Vite proxy.
- Docker Compose gateway → `backend:4000` over the Compose network.
- Kubernetes gateway → `backend:4000` via the Kubernetes Service DNS name.
- Backend → MongoDB via `MONGODB_URI` supplied at runtime; never from browser code.

The route contract stays fixed; only deployment wiring and secrets are environment-specific. Payment endpoints return a clear `503` while Stripe/Razorpay credentials are not configured, instead of preventing the backend from booting.

### Security note

The current public repository includes a tracked `backend/.env` file. Treat any real credentials in it as exposed: rotate the Cloudinary/API credentials and any other non-placeholder secrets, then remove the file from Git tracking while keeping your local copy (`git rm --cached backend/.env`). Adding `.gitignore` alone does not untrack a file already committed, and deleting it in a new commit does not erase old Git history. Never commit a real `.env`, Kubernetes Secret, or payment secret.
