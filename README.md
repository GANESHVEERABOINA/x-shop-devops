# 🛒 X-Shop: High-Availability E-Commerce Platform — End-to-End DevSecOps Implementation

![Kubernetes](https://img.shields.io/badge/Kubernetes-K3s_Cluster-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)
![Terraform](https://img.shields.io/badge/Terraform-AWS_IaC-7B42BC?style=for-the-badge&logo=terraform&logoColor=white)
![Ansible](https://img.shields.io/badge/Ansible-Configuration-EE0000?style=for-the-badge&logo=ansible&logoColor=white)
![Jenkins](https://img.shields.io/badge/Jenkins-CI%2FCD_Pipeline-D24939?style=for-the-badge&logo=jenkins&logoColor=white)
![Helm](https://img.shields.io/badge/Helm-Package_Manager-0F1689?style=for-the-badge&logo=helm&logoColor=white)
![Security](https://img.shields.io/badge/DevSecOps-Gitleaks_|_SonarQube_|_Trivy_|_Vault-2EA44F?style=for-the-badge&logo=security&logoColor=white)

---

## 📌 Project Overview & Role Statement

**X-Shop** is a full-stack, 3-tier e-commerce web application consisting of a **Customer Storefront (React/Vite)**, an **Admin Dashboard (React/Vite)**, and a **RESTful Backend API (Node.js/Express)** integrated with **MongoDB Atlas** and **Cloudinary**.

> 💡 **Note on Application Development vs. DevSecOps Engineering:**
> - **Web Development (AI-Generated):** The entire 3-tier full-stack application codebase (`frontend`, `admin`, and `backend`) was generated using **Artificial Intelligence (AI)**.
> - **DevSecOps & Cloud Engineering (My Implementation):** My core focus and contribution to this project is taking this raw AI-generated application and engineering a **production-grade, automated, and secure DevSecOps lifecycle** around it—from containerization and Helm packaging to Infrastructure as Code (Terraform), Configuration Management (Ansible), Shift-Left Security (Gitleaks, SonarQube, Trivy), Enterprise Secrets Management (HashiCorp Vault), and High-Availability Kubernetes (K3s) orchestration on AWS.

---

## 🏗️ System Architecture & Pod Distribution

In this hybrid DevSecOps model, the **Local Linux Workstation** acts as the Master Control & CI/CD Node (running Terraform, Ansible, Jenkins, and security scanners), while **AWS Cloud** hosts the **K3s Kubernetes Cluster** (`1 Master + Worker Nodes`) running application workloads.

```mermaid
flowchart TB
    subgraph Local["💻 Local Linux Workstation (DevSecOps Control & CI/CD Node)"]
        TF["Terraform CLI (IaC)"]
        ANS["Ansible Dynamic Inventory"]
        JNK["Jenkins CI/CD Pipeline"]
        VAULT["HashiCorp Vault Plugin"]
        SEC["Security Suite: Gitleaks + SonarQube + Trivy"]
        HLM["Helm CLI + Kubeconfig"]
        
        JNK --> VAULT --> SEC --> HLM
    end

    subgraph Registry["🐙 Source & Container Registry"]
        GH["GitHub Repository"]
        DH["Docker Hub Registry (ganeshveeraboina)"]
    end

    subgraph AWS["☁️ AWS Cloud Infrastructure"]
        subgraph K3sCluster["☸️ K3s High-Availability Kubernetes Cluster"]
            Master["🖥️ K3s Master Node\nControl Plane & API Server (:6443)\nTaint: NoSchedule"]
            
            subgraph Workers["⚙️ K3s Worker Nodes (Autoscaled)"]
                W_FE["Frontend Pods"]
                W_BE["Backend Pods"]
                W_AD["Admin Pods"]
            end
            
            Master ==>|"Schedules Workloads"| Workers
        end
    end

    subgraph External["🌐 External Managed Cloud Services"]
        MONGO[("MongoDB Atlas (xshop DB)")]
        CLD[("Cloudinary Media API")]
    end

    TF -->|"1. Provisions Infrastructure & SG"| AWS
    ANS -->|"2. Dynamic Inventory Discovery & K3s Setup"| K3sCluster
    GH -->|"3. Webhook Trigger"| JNK
    SEC -->|"4. Pushes Verified Images"| DH
    HLM -->|"5. Deploys Charts (-f secrets.yml)"| Master
    DH -.->|"Pulls Container Images"| Workers
    W_BE -->|"Database R/W"| MONGO
    W_BE -->|"Product Image Uploads"| CLD
```

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
- Automated the creation of Ubuntu Linux EC2 Instances on AWS:
  - **1x K3s Master Node:** Dedicated to running the K3s Control Plane, API Server, and Scheduler.
  - **K3s Worker Nodes:** Dedicated to running scalable application workloads.
- Configured AWS Security Groups to allow cluster communication, Flannel VXLAN overlay networking (`UDP 8472`), and Kubernetes API access (`TCP 6443`).

### 4. Automated Cluster Configuration with Ansible & Dynamic Inventory
- Implemented **Ansible Dynamic Inventory plugins** to automatically discover newly provisioned EC2 instances in real time.
- Built playbooks executed from the local control workstation over SSH (`.pem` key authentication).
- Automated the installation of **K3s Master** (with `--tls-san` for external Kubeconfig access) and automated token extraction to join worker nodes seamlessly.
- Applied `NoSchedule` taints on the Master Node so application pods schedule strictly across worker nodes.

### 5. Shift-Left DevSecOps CI/CD Pipeline (Jenkins & HashiCorp Vault)
- **Stage 1 — Secret Detection (Gitleaks):** Scans the Git repository history and commits to prevent accidental credential leaks (`.gitleaksignore` & `.gitignore` enforced for `secrets.yml`).
- **Stage 2 — Static Code Analysis (SonarQube):** Analyzes JavaScript/React/Node.js code quality, bugs, and security hotspots before building images.
- **Stage 3 — Vulnerability Scanning (Trivy):** Scans IaC files (Helm charts, Dockerfiles) and built Docker images for Critical/High CVEs.
- **Stage 4 — Build & Registry Push:** Authenticates securely with Docker Hub using dynamic credentials retrieved from **HashiCorp Vault** via Jenkins Vault plugins, then builds versioned container images and pushes them to Docker Hub (`ganeshveeraboina/x-shop-three-tire-app`).
- **Stage 5 — Automated Helm Deployment:** Connects to the AWS K3s Master Node API (`:6443`) using Jenkins secret `kubeconfig` and deploys all charts while injecting runtime secrets (`helm upgrade --install ... -f secrets.yml`).

---

## 🚀 Future Implementation Roadmap (Phase 2 Enhancements)

To evolve this architecture into an enterprise-grade cloud environment, the following infrastructure and security upgrades are planned:

- [ ] **Custom AWS VPC & Network Isolation:** Replace default networking with a custom VPC featuring **Public Subnets** (for Bastion Host & Load Balancers) and **Private Subnets** (for K3s Master & Worker nodes) with NAT Gateways.
- [ ] **Strict Security Group Hardening:** Transition from open testing ports (`All TCP`) to least-privilege firewall rules—allowing only ports `80/443` publicly, restricting `6443` to the CI/CD IP, and limiting internal node traffic strictly to VPC CIDR blocks.
- [ ] **AWS Application Load Balancer (ALB) & SSL/TLS:** Integrate an external AWS Load Balancer with **Cert-Manager** and **Let's Encrypt** (or AWS ACM) to enforce HTTPS (`SSL/TLS`) termination across the storefront and admin panel.
- [ ] **Horizontal Pod Autoscaler (HPA) & Cluster Autoscaling:** Configure Kubernetes Metrics Server and HPA to dynamically scale workloads based on real-time CPU/Memory spikes.
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
│   ├── admin/                    # Admin Deployment, Service & Values
│   ├── backend/                  # Backend Deployment, Service, Secret Templates & Values
│   ├── frontend/                 # Frontend Deployment, Service & Values
│   └── ingress/                  # Path-based Nginx Ingress Routing Rules (/, /admin, /api)
├── infra-configure/              # Terraform IaC and Ansible Playbooks/Dynamic Inventory
├── .gitignore                    # Excludes node_modules, dist, .env, and plain-text secrets.yml
├── .gitleaksignore               # Baseline exclusions for Gitleaks secret scanner
└── README.md                     # Project Documentation & DevSecOps Architecture
```

---

## ⚡ Quick Start & Deployment Guide

```bash
# 1. Initialize and provision cloud infrastructure via Terraform
cd infra-configure/terraform
terraform init && terraform apply --auto-approve

# 2. Run Ansible playbooks using dynamic inventory for K3s cluster setup
cd ../ansible
ansible-playbook -i dynamic_inventory.aws_ec2.yml setup-cluster.yml

# 3. Verify cluster health and active worker nodes
kubectl get nodes -o wide

# 4. Deploy microservices using Helm charts with secure secret mapping
helm upgrade --install backend-release ./K8s-Helm/backend -f ./K8s-Helm/backend/secrets.yml
helm upgrade --install frontend-release ./K8s-Helm/frontend
helm upgrade --install admin-release ./K8s-Helm/admin
helm upgrade --install ingress-release ./K8s-Helm/ingress

# 5. Check live pod distribution across worker nodes
kubectl get pods -o wide
```

---

## 👨‍💻 Author & DevSecOps Practitioner

**Ganesh Veeraboina**
- **Role:** DevOps & Cloud Engineer (Actively Learning & Implementing DevSecOps)
- **Focus Areas:** Cloud Infrastructure Automation (AWS, Terraform, Ansible), Kubernetes & K3s Orchestration, Helm, CI/CD Pipelines (Jenkins), Shift-Left Security, and Enterprise Secrets Management (HashiCorp Vault).
