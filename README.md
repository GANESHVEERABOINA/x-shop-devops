# 🛒 X-Shop: High-Availability E-Commerce Platform — End-to-End DevSecOps Implementation

![Kubernetes](https://img.shields.io/badge/Kubernetes-K3s_Cluster-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)
![Terraform](https://img.shields.io/badge/Terraform-AWS_IaC-7B42BC?style=for-the-badge&logo=terraform&logoColor=white)
![Ansible](https://img.shields.io/badge/Ansible-Configuration-EE0000?style=for-the-badge&logo=ansible&logoColor=white)
![Jenkins](https://img.shields.io/badge/Jenkins-CI%2FCD_Pipeline-D24939?style=for-the-badge&logo=jenkins&logoColor=white)
![Helm](https://img.shields.io/badge/Helm-Package_Manager-0F1689?style=for-the-badge&logo=helm&logoColor=white)
![HashiCorp Vault](https://img.shields.io/badge/Vault-Secrets_Management-000000?style=for-the-badge&logo=vault&logoColor=white)
![Slack](https://img.shields.io/badge/Slack-Pipeline_Alerts-4A154B?style=for-the-badge&logo=slack&logoColor=white)
![Security](https://img.shields.io/badge/DevSecOps-Gitleaks_|_SonarQube_|_Trivy_|_ESO-2EA44F?style=for-the-badge&logo=security&logoColor=white)

---

## 📌 Project Overview & Role Statement

**X-Shop** is a full-stack, 3-tier e-commerce web platform consisting of a **Customer Storefront (React/Vite)**, an **Admin Dashboard (React/Vite)**, and a **RESTful Backend API (Node.js/Express)** integrated with **MongoDB Atlas** and **Cloudinary**.

> 💡 **Application Development vs. DevSecOps Engineering Context:**
> - **Web Application Layer:** The 3-tier application codebase (`frontend`, `admin`, and `backend`) was prototyped using modern full-stack web stacks.
> - **DevSecOps & Cloud Engineering (My Core Contribution):** My primary engineering focus was architecting and delivering a **production-grade, zero-trust, automated DevSecOps lifecycle**:
>   - **Infrastructure as Code (IaC):** Multi-node AWS EC2 provisioning via Terraform.
>   - **Configuration Management:** Automated K3s cluster bootstrap, node joins, and dynamic AWS inventory discovery via Ansible.
>   - **Enterprise Zero-Trust Secrets Management:** Native HashiCorp Vault deployment integrated with External Secrets Operator (ESO) — permanently removing plaintext secrets from Git repositories and Helm deployment values (architected with AI acceleration).
>   - **Shift-Left Security & Quality Gates:** Automated CI/CD scanning with SonarQube, Gitleaks, Trivy image vulnerability assessment, and real-time Slack team notifications.
>   - **Unified Ingress & Microservices Orchestration:** High-availability K3s orchestration with Traefik Ingress reverse proxying path-based traffic on standard HTTP Port 80 (`/`, `/admin`, `/api`).

---

## 🏗️ System Architecture & DevSecOps Lifecycle

```mermaid
flowchart TB
    subgraph CI_CD["💻 DevSecOps Automation & CI/CD Pipeline (Jenkins)"]
        SCM["GitHub SCM Trigger"]
        GL["Gitleaks (Commit-Time Secret Scan)"]
        SQ["SonarQube (Static Code Analysis / SAST)"]
        BUILD["Test & Multi-Stage Docker Builds"]
        TRIVY["Trivy (Container CVE Assessment)"]
        DH["Docker Hub Registry (Versioned Tags)"]
        HELM["Helm 3 Deployer"]
        SLACK["🔔 Slack Webhook Notifications (Success/Fail)"]

        SCM --> GL --> SQ --> BUILD --> TRIVY --> DH --> HELM --> SLACK
    end

    subgraph AWS["☁️ AWS Cloud Infrastructure (K3s Kubernetes Cluster)"]
        subgraph MasterNode["🖥️ K3s Control Plane (Master Node)"]
            K8sAPI["K3s API Server (:6443)"]
            Taint["Taint: CriticalAddonsOnly=true:NoSchedule"]
            Vault["🔒 HashiCorp Vault (v1.14+)"]
            ESO["🔑 External Secrets Operator (ESO)"]
        end

        subgraph WorkerNodes["⚙️ K3s Worker Nodes (2x EC2 Nodes)"]
            Traefik["🌐 Traefik Ingress Controller (:80)"]
            
            subgraph Workloads["Scalable Workloads (20 Pods Total)"]
                FE["8x Frontend Pods (Customer Storefront)"]
                BE["8x Backend Pods (Node.js/Express API)"]
                AD["4x Admin Pods (Admin Management Panel)"]
            end
            
            K8sSec["Kubernetes Secret (backend-secret)"]
        end

        K8sAPI --> Traefik
        Vault -.->|"Syncs KV-v2 Secrets"| ESO
        ESO -->|"Generates at Runtime"| K8sSec
        K8sSec -->|"envFrom Injected"| BE
    end

    subgraph External["🌐 External Cloud Services"]
        MONGO[("MongoDB Atlas Database")]
        CLOUDINARY[("Cloudinary Media CDN")]
    end

    HELM -->|"Deploys Charts via Kubeconfig"| K8sAPI
    BE -->|"Database Queries"| MONGO
    BE -->|"Media Uploads & CDN"| CLOUDINARY
    Traefik -->|"Path /"| FE
    Traefik -->|"Path /admin"| AD
    Traefik -->|"Path /api"| BE
```

---

## 🛡️ Shift-Left Security & Engineering Responsibilities (Dev vs. DevOps)

Security and quality assurance are distributed logically across development and operational workflows:

```mermaid
flowchart LR
    subgraph DevTeam["👨‍💻 Development Responsibilities"]
        D1["Source Code Logic"]
        D2["SonarQube SAST Remediation"]
        D3["App Bug & Code Smell Fixes"]
    end

    subgraph DevOpsTeam["🛠️ DevOps & Cloud Security Responsibilities"]
        O1["Gitleaks Secret Prevention (.gitignore / hooks)"]
        O2["Trivy Container & OS CVE Scans"]
        O3["DevOps Configs (Dockerfiles, Helm, K8s, Nginx)"]
        O4["HashiCorp Vault & Zero-Trust Secrets Lifecycle"]
        O5["Real-time Slack Pipeline Alerting"]
    end
```

| Security / Ops Tool | Stage | Role & Responsibility |
| :--- | :--- | :--- |
| **Gitleaks** | Pre-Commit / Build-Time | **DevOps:** Enforces `.gitignore` and `.gitleaksignore` patterns to prevent tokens, passwords, and private keys from ever entering Git commits or history. |
| **SonarQube** | Code Analysis (SAST) | **Development Team:** Analyzes JavaScript, React, and Node.js code for code smells, bugs, duplicate code, and security hotspots. Dev fixes application logic; DevOps configures quality gates. |
| **Trivy** | Vulnerability Assessment | **DevOps Team:** Scans built container images (`backend`, `frontend`, `admin`) for known CVEs, outdated base OS packages, and misconfigurations. DevOps patches base images (`bookworm-slim`, `alpine`). |
| **HashiCorp Vault + ESO** | Runtime Secrets Injection | **DevOps Team:** Centralized secrets vault outside Git. External Secrets Operator dynamically reconciles secrets into native Kubernetes secrets inside memory. |
| **Slack Webhooks** | Pipeline Post-Actions | **DevOps Team:** Automated alerts sent to dedicated Slack channels on pipeline completion, reporting build status, commit IDs, and direct console log links. |

---

## 🔒 Enterprise Secrets Management: HashiCorp Vault & External Secrets Operator (ESO)

To achieve strict **Zero-Trust Security** and prevent credential leakage in source control:

1. **HashiCorp Vault Deployment:**
   - Installed inside the K3s cluster under the dedicated `vault` namespace.
   - Configured with tolerations to safely run alongside the master control plane without consuming worker compute capacity.
2. **External Secrets Operator (ESO):**
   - Deployed with custom CRDs (`SecretStore` and `ExternalSecret` on `apiVersion: external-secrets.io/v1`).
   - Watches Vault KV-v2 path `secret/data/x-shop/backend` and automatically reconciles secrets into the native Kubernetes Secret `backend-secret`.
3. **Zero Plaintext Secrets in Git:**
   - Completely eradicated `secrets.yml` files.
   - Historical Git commits purged permanently using `git-filter-repo`.
   - Comprehensive `.gitignore` and `.gitleaksignore` rules preventing future accidental commits.
4. **All 11 Production Secrets Managed via Vault:**
   - `PORT`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `MONGODB_URI`
   - `CLOUDINARY_API_KEY`, `CLOUDINARY_SECRET_KEY`, `CLOUDINARY_NAME`
   - `STRIPE_SECRET_KEY`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`

---

## 🌐 Unified Ingress & Single-Port Access Architecture

Rather than opening scattered NodePorts (such as `30003`) across EC2 security groups, the application is fronted by **Traefik Ingress** on standard HTTP **Port 80**:

| Route | Destination Service | Description | Port | Status |
| :--- | :--- | :--- | :---: | :---: |
| `http://<Node_IP>/` | `frontend-service:80` | Customer-facing React Storefront | **80** | `200 OK` |
| `http://<Node_IP>/admin` | `admin-service:80` | Store Administration Dashboard | **80** | `200 OK` |
| `http://<Node_IP>/api` | `backend-service:80` | REST API Endpoints | **80** | `200 OK` |

### Key Ingress & Microservice Routing Fixes:
1. **IngressClass Alignment:** Configured `ingressClassName: traefik` in Helm templates to natively bind to K3s's built-in Traefik load balancer.
2. **Admin SPA Subpath Routing:** Resolved Vite base path `/admin/` asset lookup loops by introducing an internal Nginx symlink (`/usr/share/nginx/html/admin`) and a Kubernetes `postStart` lifecycle hook, preventing internal 500 redirection cycles.
3. **Dynamic Client Reverse-Proxying:** Updated `backendUrl` in both `frontend` and `admin` to relative paths (`""`), seamlessly proxying API requests through Port 80 without firewall barriers or CORS conflicts.

---

## 🛠️ Infrastructure & DevSecOps Toolchain

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Cloud Provider** | AWS (Amazon Web Services) | 3x EC2 Ubuntu Nodes (`1 Master + 2 Workers`) |
| **Infrastructure as Code** | Terraform (`>= 1.5`) | Declarative provisioning of EC2 instances and Security Groups |
| **Configuration Management**| Ansible | Dynamic AWS inventory discovery, cluster setup, Vault/ESO automation |
| **Container Orchestration** | K3s (Lightweight Kubernetes) | Multi-node cluster with Flannel CNI and Traefik Ingress |
| **Package Management** | Helm 3 | Templated charts for `frontend`, `backend`, `admin`, and `ingress` |
| **CI/CD Automation** | Jenkins Declarative Pipeline | End-to-end automated build, test, scan, and deploy pipeline |
| **Code Quality & Security** | SonarQube | Static Application Security Testing (SAST) & code smell detection |
| **Vulnerability Scanning** | Trivy & Gitleaks | Container image CVE scans and repository secret scanning |
| **Secrets Management** | HashiCorp Vault + ESO | Dynamic, out-of-band secret injection without disk persistence |
| **Collaboration & Alerting**| Slack Webhooks | Instant build/deploy notifications and error log routing |
| **Database & Media Storage** | MongoDB Atlas & Cloudinary | Fully managed cloud NoSQL database and media asset CDN |

---

## 🚀 Future Implementation Roadmap (Phase 2: Enterprise Cloud & Advanced DevSecOps)

To evolve this architecture into an enterprise-grade cloud environment, the following infrastructure, scaling, and advanced security tooling upgrades are planned:

### 1. ☁️ AWS Cloud & Network Hardening
- [ ] **Custom AWS Multi-AZ VPC:** Migrate from default VPC to a custom VPC architecture with **Public Subnets** (for Internet Gateway, NAT Gateway, Bastion Host, and Load Balancers) and **Private Subnets** (strictly isolating K3s Master and Worker nodes).
- [ ] **AWS Application Load Balancer (ALB) & SSL/TLS:** Integrate AWS ALB with **Cert-Manager** and **Let's Encrypt** (or AWS ACM) to enforce end-to-end HTTPS (`TLS 1.3`) termination.
- [ ] **Autoscaling (HPA & Cluster Autoscaler):** Implement Kubernetes Metrics Server with **Horizontal Pod Autoscaling (HPA)** based on CPU/Memory thresholds and AWS Auto Scaling Groups (ASG) for dynamic node provisioning.

### 2. 🛡️ Advanced DevSecOps Toolchain Expansion
- [ ] **Checkov (IaC Security Scanning):** Integrate Checkov into the Jenkins pipeline to scan Terraform files and Kubernetes/Helm manifests for security compliance (CIS Benchmarks, open security groups, privilege escalation).
- [ ] **DefectDojo (Unified Vulnerability Management):** Deploy DefectDojo to aggregate, deduplicate, and track vulnerabilities discovered across Gitleaks, SonarQube, Trivy, and Checkov in a single centralized dashboard.
- [ ] **OWASP ZAP (Dynamic Application Security Testing - DAST):** Introduce automated dynamic penetration testing into staging environments to test live endpoints against SQL injection, XSS, and broken access controls.
- [ ] **Falco (Cloud-Native Runtime Security):** Deploy Falco daemonsets across K3s worker nodes to monitor kernel system calls and immediately detect anomalous container behaviors (shell execution, namespace escapes, unexpected outbound connections).

---

## 📂 Repository Structure

```text
x-shop/
├── admin/                                  # React Admin Panel (Vite + TailwindCSS)
│   ├── Dockerfile                          # Multi-stage production build with Nginx
│   └── nginx.conf                          # Custom SPA routing configuration
├── backend/                                # Node.js / Express REST API
│   ├── config/                             # MongoDB & Cloudinary connectors
│   ├── controllers/                        # Business logic (User, Product, Cart, Order)
│   └── Dockerfile                          # Node.js production image
├── frontend/                               # React Customer Storefront (Vite + TailwindCSS)
│   ├── Dockerfile                          # Production Nginx container configuration
│   └── nginx.conf                          # SPA fallback configuration
├── K8s-Helm/                               # Production Helm Charts
│   ├── admin/                              # Admin Deployment (4 replicas) & Service
│   ├── backend/                            # Backend Deployment (8 replicas) & Service
│   │   └── templates/eso-secrets.yaml      # External Secrets Operator (SecretStore + ExternalSecret)
│   ├── frontend/                           # Frontend Deployment (8 replicas) & Service
│   └── ingress/                            # Traefik Ingress routing rules (/, /admin, /api)
├── infra-configure/
│   ├── terraform/                          # Terraform IaC files (main.tf, variables, security groups)
│   └── ansible/                            # Ansible setup playbooks & dynamic AWS EC2 inventory
│       └── playbooks/setup_vault_eso.yml   # Automated Vault & ESO deployment playbook
├── Jenkinsfile                             # Multi-stage DevSecOps Declarative Pipeline (SonarQube, Trivy, Slack)
├── .gitignore                              # Strict exclusions for secrets, node_modules, kubeconfigs
├── .gitleaksignore                         # Baseline exclusions for Gitleaks secret scanner
└── README.md                               # Project Architecture & Operations Documentation
```

---

## ⚡ Deployment & Operations Guide

### Step 1: Provision Cloud Infrastructure with Terraform
```bash
cd infra-configure/terraform
terraform init
terraform plan
terraform apply --auto-approve
```

### Step 2: Configure K3s Cluster & Bootstrap Vault via Ansible
```bash
cd ../ansible
# 1. Install K3s Control Plane and join Worker nodes
ansible-playbook -i dynamic_inventory.aws_ec2.yml playbooks/setup-cluster.yml

# 2. Deploy HashiCorp Vault, External Secrets Operator, and inject application secrets
ansible-playbook -i dynamic_inventory.aws_ec2.yml playbooks/setup_vault_eso.yml
```

### Step 3: Verify Cluster & Workload Health
```bash
# Verify all nodes are Ready
kubectl get nodes -o wide

# Verify ExternalSecret synchronization
kubectl get externalsecrets,secretstore -A

# Check all application pods across worker nodes (20 pods)
kubectl get pods -o wide
```

### Step 4: Access the Live Application (Standard Port 80)
Open any node's public IP address directly in your web browser:
- 🛍️ **Storefront:** `http://<PUBLIC_IP>/`
- ⚙️ **Admin Panel:** `http://<PUBLIC_IP>/admin`
- 🔌 **API Health:** `http://<PUBLIC_IP>/api/product/list`

---

## 👨‍💻 Author & DevSecOps Practitioner

**Ganesh Veeraboina**
- **Role:** DevOps & Cloud Security Engineer
- **Core Competencies:** Cloud Infrastructure Automation (AWS, Terraform, Ansible), Kubernetes/K3s Architecture, Helm Packaging, Jenkins CI/CD Pipelines, Shift-Left Security (SonarQube, Trivy, Gitleaks, Slack), and Zero-Trust Secrets Management (HashiCorp Vault & ESO).
