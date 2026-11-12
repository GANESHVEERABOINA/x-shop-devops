+# 🛒 X-Shop: 3-Tier E-Commerce Platform — End-to-End DevSecOps Implementation

![Kubernetes](https://img.shields.io/badge/Kubernetes-K3s_Cluster-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)
![Terraform](https://img.shields.io/badge/Terraform-AWS_IaC-7B42BC?style=for-the-badge&logo=terraform&logoColor=white)
![Ansible](https://img.shields.io/badge/Ansible-Configuration-EE0000?style=for-the-badge&logo=ansible&logoColor=white)
![Jenkins](https://img.shields.io/badge/Jenkins-CI%2FCD_Pipeline-D24939?style=for-the-badge&logo=jenkins&logoColor=white)
![Helm](https://img.shields.io/badge/Helm-Package_Manager-0F1689?style=for-the-badge&logo=helm&logoColor=white)
![Security](https://img.shields.io/badge/DevSecOps-Gitleaks_|_SonarQube_|_Trivy-2EA44F?style=for-the-badge&logo=security&logoColor=white)

---

## 📌 Project Overview & Role Statement

**X-Shop** is a full-stack, 3-tier e-commerce web application consisting of a **Customer Storefront (React/Vite)**, an **Admin Dashboard (React/Vite)**, and a **RESTful Backend API (Node.js/Express)** integrated with **MongoDB Atlas** and **Cloudinary**.

> 💡 **Note on Application Development vs. DevSecOps Engineering:**
> - **Web Development (AI-Generated):** The entire 3-tier full-stack application codebase (`frontend`, `admin`, and `backend`) was generated using **Artificial Intelligence (AI)**.
> - **DevSecOps & Cloud Engineering (My Implementation):** My core focus and contribution to this project is taking this raw AI-generated application and engineering a **production-grade, automated, and secure DevSecOps lifecycle** around it—from containerization and Helm packaging to Infrastructure as Code (Terraform), Configuration Management (Ansible), Shift-Left Security (Gitleaks, SonarQube, Trivy), and High-Availability Kubernetes (K3s) orchestration on AWS.

---

## 🏗️ System Architecture & Pod Distribution

In this hybrid DevSecOps model, the **Local Linux Workstation** acts as the Master Control & CI/CD Node (running Terraform, Ansible, Jenkins, and security scanners), while **AWS Cloud** hosts the **3-Node K3s Kubernetes Cluster** (`1 Master + 2 Worker Nodes`) running **20 application pods**.

```mermaid
flowchart TB
    subgraph Local["💻 Local Linux Workstation (DevSecOps Control & CI/CD Node)"]
        TF["Terraform CLI (IaC)"]
        ANS["Ansible Engine"]
        JNK["Jenkins CI/CD Pipeline"]
        SEC["Security Suite: Gitleaks + SonarQube + Trivy + HashiCorp Vault"]
        HLM["Helm CLI + Kubeconfig"]
        
        JNK --> SEC --> HLM
    end

    subgraph Registry["🐙 Source & Container Registry"]
        GH["GitHub Repository"]
        DH["Docker Hub Registry (ganeshveeraboina)"]
    end

    subgraph AWS["☁️ AWS Cloud Infrastructure (ap-south-1)"]
        subgraph K3sCluster["☸️ K3s High-Availability Kubernetes Cluster"]
            Master["🖥️ K3s Master Node (t3.small)\nControl Plane & API Server (:6443)\nTaint: NoSchedule"]
            
            subgraph Worker1["⚙️ K3s Worker Node 1 "]
                W1_FE["Frontend Pods "]
                W1_BE["Backend Pods "]
                W1_AD["Admin Pods "]
            end

            subgraph Worker2["⚙️ K3s Worker Node 2 "]
                W2_FE["Frontend Pods "]
                W2_BE["Backend Pods "]
                W2_AD["Admin Pods "]
            end
            
    end

    subgraph External["🌐 External Managed Cloud Services"]
        MONGO[("MongoDB Atlas (xshop DB)")]
        CLD[("Cloudinary Media API")]
    end

    TF -->|"1. Provisions 3 EC2s & SG"| AWS
    ANS -->|"2. Installs K3s & Joins Workers via SSH"| K3sCluster
    GH -->|"3. Webhook Trigger"| JNK
    SEC -->|"4. Pushes Verified Images"| DH
    HLM -->|"5. Deploys Charts (-f secrets.yml)"| Master
    DH -.->|"Pulls Container Images"| Worker1 & Worker2
    W1_BE & W2_BE -->|"Database R/W"| MONGO
    W1_BE & W2_BE -->|"Product Image Uploads"| CLD
```

### 📊 Cluster Capacity & Pod Scaling Strategy (20 Replicas Total)

To ensure high availability and zero-downtime traffic handling across both worker nodes, the Helm charts are configured to distribute **20 application pods** evenly across the cluster:

| Microservice | Tech Stack | Worker Node 1 | Worker Node 2 | Total Replicas (`values.yaml`) | Internal Port | Resource Limits (Per Pod) |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **Frontend Store** | React 18, Vite, Nginx | x Pods | x Pods | **`x`** | `80` | `500m` CPU / `256Mi` RAM |
| **Backend API** | Node.js, Express, Mongoose | x Pods | x Pods | **`x`** | `4000` | `500m` CPU / `256Mi` RAM |
| **Admin Panel** | React 18, Tailwind, Nginx | x Pods | x Pods | **`x`** | `80` | `500m` CPU / `256Mi` RAM |
| **Total Workload** | **3-Tier Architecture** | **x Pods** | **x Pods** | **`x Pods`** | **Ingress Routed** | **~2.6 GB Total Cluster RAM** |

---

## ✅ Present Implementation (Current DevSecOps Workflow)

### 1. Containerization & Local Kubernetes Validation (Minikube)
- Wrote multi-stage, production-ready `Dockerfile` configurations for `frontend`, `admin` (served via custom Nginx configurations), and `backend`.
- Tested the complete 3-tier routing locally on **Minikube** with Nginx Ingress Controller:
  - `/` $\rightarrow$ `frontend-service:80`
  - `/admin` $\rightarrow$ `admin-service:80`
  - `/api` $\rightarrow$ `backend-service:4000`
- Resolved container-level IPv6 DNS resolution bottlenecks with external APIs (Cloudinary) using Node.js runtime flags (`--dns-result-order=ipv4first`).

### 2. Modular Kubernetes Packaging with Helm (`K8s-Helm/`)
- Created dedicated Helm charts for **Frontend**, **Backend**, **Admin**, and **Ingress**.
- Designed dynamic Kubernetes `Secret` templates (`{{ .Values.appName }}-secret`) injected into pods via `envFrom.secretRef` so sensitive credentials (`MONGODB_URI`, `JWT_SECRET`, `CLOUDINARY_SECRET_KEY`, `ADMIN_PASSWORD`) are never hardcoded in deployment manifests.

### 3. Cloud Infrastructure Provisioning with Terraform
- Automated the creation of **3 Ubuntu 22.04 LTS EC2 Instances** on AWS:
  - **1x K3s Master Node (`x-type`):** Dedicated to running the K3s Control Plane, API Server, and Scheduler.
  - **2x K3s Worker Nodes (`x-type`):** Dedicated to running application workloads (x pods per node).

### 4. Automated Cluster Configuration with Ansible
- Built Ansible inventories and playbooks executed from the local control workstation over SSH (`.pem` key authentication).
- Automated the installation of **K3s Master** (with `--tls-san` for external Kubeconfig access) and automated token extraction to join **Worker 1** and **Worker 2** seamlessly.
- Applied `NoSchedule` taints on the Master Node so 100% of application pods schedule strictly across Worker 1 and Worker 2.

### 5. Shift-Left DevSecOps CI/CD Pipeline (Jenkins)
- **Stage 1 — Secret Detection (Gitleaks):** Scans the Git repository history and commits to prevent accidental credential leaks (`.gitleaksignore` & `.gitignore` enforced for `secrets.yml`).
- **Stage 2 — Static Code Analysis (SonarQube):** Analyzes JavaScript/React/Node.js code quality, bugs, and security hotspots before building images.
- **Stage 3 — Vulnerability Scanning (Trivy):** Scans IaC files (Helm charts, Dockerfiles) and built Docker images for Critical/High CVEs.
**Stage 4 — Build & Registry Push:** Authenticates securely with Docker Hub using dynamic credentials retrieved from **HashiCorp Vault** via Jenkins Vault plugins, then builds versioned container images and pushes them to Docker Hub (`ganeshveeraboina/x-shop-three-tire-app`).
- **Stage 5 — Automated Helm Deployment:** Connects to the AWS K3s Master Node API (`:6443`) using Jenkins secret `kubeconfig` and deploys all charts while injecting runtime secrets (`helm upgrade --install ... -f secrets.yml`).

---

## 🚀 Future Implementation Roadmap (Phase 2 Enhancements)

To evolve this architecture into an enterprise-grade cloud environment, the following infrastructure and security upgrades are planned:

- [ ] **Custom AWS VPC & Network Isolation:** Replace default networking with a custom VPC featuring **Public Subnets** (for Bastion Host & Load Balancers) and **Private Subnets** (for K3s Master & Worker nodes) with NAT Gateways.
- [ ] **Strict Security Group Hardening:** Transition from open testing ports (`All TCP`) to least-privilege firewall rules—allowing only ports `80/443` publicly, restricting `6443` to the CI/CD IP, and limiting internal node traffic strictly to VPC CIDR blocks.
- [ ] **AWS Application Load Balancer (ALB) & SSL/TLS:** Integrate an external AWS Load Balancer with **Cert-Manager** and **Let's Encrypt** (or AWS ACM) to enforce HTTPS (`SSL/TLS`) termination across the storefront and admin panel.
- [ ] **Horizontal Pod Autoscaler (HPA) & Cluster Autoscaling:** Configure Kubernetes Metrics Server and HPA to dynamically scale Frontend and Backend pods from `8` up to `20+` replicas based on real-time CPU/Memory spikes.
- [ ] **Observability & Monitoring Stack:** Deploy **Prometheus** and **Grafana** via Helm to monitor K3s node health, pod resource consumption, and API latency in real time.
- [ ] **GitOps Continuous Delivery with ArgoCD:** Decouple deployment from Jenkins by introducing **ArgoCD** inside the K3s cluster to automatically sync Helm chart states directly from GitHub.

---

## 📂 Repository Directory Structure

```text
x-shop-devops/
├── admin/                        # AI-Generated React Admin Panel + Dockerfile & Nginx Config
├── backend/                      # AI-Generated Node.js/Express API + Dockerfile
├── frontend/                     # AI-Generated React Customer Storefront + Dockerfile & Nginx Config
├── K8s-Helm/                     # Production Helm Charts for Kubernetes Deployment
│   ├── admin/                    # Admin Deployment, Service & Values (replicaCount: 4)
│   ├── backend/                  # Backend Deployment, Service, Secret Templates & Values (replicaCount: 8)
│   ├── frontend/                 # Frontend Deployment, Service & Values (replicaCount: 8)
│   └── ingress/                  # Path-based Nginx Ingress Routing Rules (/, /admin, /api)
├── .gitignore                    # Excludes node_modules, dist, .env, and plain-text secrets.yml
├── .gitleaksignore               # Baseline exclusions for Gitleaks secret scanner
└── README.md                     # Project Documentation & DevSecOps Architecture
```

---

## ⚡ Quick Deployment Commands (Helm on K3s)

```bash
# 1. Verify K3s Cluster Nodes (1 Master, 2 Workers)
kubectl get nodes -o wide

# 2. Deploy Backend with Secret Injection (x Pods total -> x per Worker)
helm upgrade --install backend-release ./K8s-Helm/backend -f ./K8s-Helm/backend/secrets.yml

# 3. Deploy Frontend Storefront (x Pods total -> x per Worker)
helm upgrade --install frontend-release ./K8s-Helm/frontend

# 4. Deploy Admin Dashboard (x Pods total -> x per Worker)
helm upgrade --install admin-release ./K8s-Helm/admin

# 5. Deploy Ingress Routing Rules
helm upgrade --install ingress-release ./K8s-Helm/ingress

# 6. Verify x Pods Distributed Across Worker 1 & Worker 2
kubectl get pods -o wide
```

---

## 👨‍💻 Author & DevOps & Cloud Engineer (Actively Learning & Implementing DevSecOps)

**Ganesh Veeraboina**
- Focus Areas: Cloud Infrastructure Automation (AWS, Terraform, Ansible), Kubernetes & K3s Orchestration, Helm, CI/CD Pipelines (Jenkins), Shift-Left Security, and Enterprise Secrets Management (HashiCorp Vault).
