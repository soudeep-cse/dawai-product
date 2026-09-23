# 🚀 Dawai Medicine Platform - AWS Deployment Guide

**Date:** 2026-09-23  
**Platform:** AWS EC2 + RDS/Docker PostgreSQL + Nginx  
**Region:** ap-south-1 (Mumbai) - Recommended for Bangladesh

---

## 📋 Prerequisites

1. **AWS Account** (with billing enabled)
2. **AWS CLI** installed locally
3. **Domain Name** (optional but recommended)
4. **Credit Card** for AWS payment
5. **SSH Key Pair** for EC2

---

## 🔑 Step 1: Create AWS Account & Setup

### 1.1 Create Free Tier Account
- Go to https://aws.amazon.com/free/
- Sign up for Free Tier account
- Verify email and add payment method
- Complete account setup

### 1.2 Create IAM User (Recommended)
```bash
# Don't use root account for security
# Go to AWS Console → IAM → Users → Create New User
# Grant permissions: EC2FullAccess, RDSFullAccess, S3FullAccess
```

### 1.3 Create Key Pair
```bash
# AWS Console → EC2 → Key Pairs → Create New Key Pair
# Name: dawai-key-pair
# Format: .pem (for Linux/Mac) or .ppk (for Windows PuTTY)
# Save safely - download and store in ~/.ssh/
chmod 400 ~/.ssh/dawai-key-pair.pem
```

---

## 🖥️ Step 2: Launch EC2 Instance

### 2.1 Launch EC2 Instance
```
AWS Console → EC2 → Instances → Launch New Instance
```

**Configuration:**

| Setting | Value |
|---------|-------|
| **AMI** | Ubuntu Server 22.04 LTS |
| **Instance Type** | t2.medium (1 year free) or t3.small |
| **Region** | ap-south-1 (Mumbai) |
| **Storage** | 30 GB (20GB Free) |
| **Key Pair** | dawai-key-pair |
| **Security Group** | Create new: Allow SSH (22), HTTP (80), HTTPS (443) |

**Security Group Rules:**
```
Type: SSH      | Port: 22    | Source: 0.0.0.0/0 (Or your IP)
Type: HTTP     | Port: 80    | Source: 0.0.0.0/0
Type: HTTPS    | Port: 443   | Source: 0.0.0.0/0
Type: Custom TCP | Port: 5432 | Source: 172.31.0.0/16 (VPC only)
```

### 2.2 Get Instance Details
- After instance starts, note down:
  - **Public IPv4 Address** (e.g., 3.111.123.456)
  - **Public IPv4 DNS** (e.g., ec2-3-111-123-456.compute.amazonaws.com)

---

## 🔗 Step 3: Database Setup (Choose One)

### Option A: Use RDS PostgreSQL (Recommended for Production)

**Advantages:**
- AWS managed backups
- Automatic patching
- Better security
- More reliable

**Steps:**
```
AWS Console → RDS → Create Database
```

| Setting | Value |
|---------|-------|
| **Engine** | PostgreSQL 15 |
| **Template** | Free Tier (if eligible) |
| **DB Instance** | dawai-db |
| **Master Username** | postgres |
| **Master Password** | [Generate strong password] |
| **VPC** | Same as EC2 |
| **Storage** | 20 GB |
| **Backup** | 7 days |

**Get Connection Details:**
- Endpoint: `dawai-db.xxxxx.ap-south-1.rds.amazonaws.com`
- Port: `5432`
- Database: Create after connecting

### Option B: Docker PostgreSQL on EC2 (Lower Cost)

**Advantages:**
- No additional charges
- Total control
- Simple backup strategy

Use the existing `docker-compose.yml` setup

---

## 🚀 Step 4: Connect to EC2 & Setup Project

### 4.1 SSH into EC2
```bash
ssh -i ~/.ssh/dawai-key-pair.pem ubuntu@your-ec2-ip

# Or if using EC2 Instance Connect in AWS Console
# Just click "Connect" and use web terminal
```

### 4.2 Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 4.3 Install Docker & Git
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose
sudo apt install -y docker-compose

# Install Git
sudo apt install -y git

# Install Node.js (for building)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
docker --version
docker compose --version
git --version
```

### 4.4 Clone Project
```bash
cd /opt
sudo git clone https://github.com/your-username/dawai-website.git
cd dawai-website
sudo chown -R $USER:$USER .
```

---

## 🔐 Step 5: Configure Environment & Secrets

### 5.1 Create Production .env
```bash
cp .env.production .env.local

# Edit with production values
nano .env.local
```

**Required Environment Variables:**

```env
# Database
DATABASE_URL="postgresql://postgres:PASSWORD@ENDPOINT:5432/dawai"
# If using Docker: DATABASE_URL="postgresql://dawai_user:dawai_pass@localhost:5432/dawai"

# Security
JWT_SECRET="[Generate: openssl rand -base64 32]"
NEXTAUTH_SECRET="[Generate: openssl rand -base64 32]"

# Application
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NODE_ENV="production"

# APIs (Get from respective services)
OPENAI_API_KEY="sk-xxx..."
SMS_API_KEY="[Your SMS provider key]"

# Database (if using Docker)
POSTGRES_USER="dawai_user"
POSTGRES_PASSWORD="[Strong password]"
POSTGRES_DB="dawai"
```

### 5.2 Generate Strong Passwords
```bash
openssl rand -base64 32  # Run this twice for JWT_SECRET and DB password
```

---

## 🏗️ Step 6: Start Application

### Option A: Using Docker Compose (Recommended)

```bash
# Start all services
docker compose -f docker-compose.prod.yml up -d

# Verify services running
docker compose ps

# View logs
docker compose logs -f

# Run database migrations
docker compose exec web npx prisma migrate deploy
docker compose exec web npm run seed
```

### Option B: Manual Docker Start

```bash
# Build Next.js app
npm install
npm run build

# Start database
docker run -d --name postgres \
  -e POSTGRES_USER=dawai_user \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_DB=dawai \
  -v postgres_data:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres:15

# Run migrations
npx prisma migrate deploy
npm run seed

# Start app
npm run start
```

---

## 🌐 Step 7: Setup Nginx Reverse Proxy

### 7.1 Install Nginx
```bash
sudo apt install -y nginx
```

### 7.2 Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/dawai
```

**Paste this config:**

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL certificates (will add with Certbot)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
    limit_req zone=general burst=20 nodelay;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # API routes
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 7.3 Enable Nginx Config
```bash
sudo ln -s /etc/nginx/sites-available/dawai /etc/nginx/sites-enabled/
sudo nginx -t  # Test config
sudo systemctl start nginx
sudo systemctl enable nginx
```

---

## 🔒 Step 8: Setup SSL Certificate (Free with Let's Encrypt)

### 8.1 Point Domain to EC2
- Go to your Domain Registrar (GoDaddy, Namecheap, etc.)
- Update DNS A Record to point to EC2 Public IP
- Wait 24 hours for propagation (or use AWS Route53)

### 8.2 Install Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renew
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### 8.3 Verify SSL
```bash
# Test certificate
sudo certbot renew --dry-run

# Restart Nginx
sudo systemctl restart nginx
```

---

## 📊 Step 9: Monitor & Maintain

### 9.1 View Application Logs
```bash
# Docker logs
docker compose logs -f web

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### 9.2 Database Backups
```bash
# Manual backup
docker exec postgres pg_dump -U dawai_user dawai > backup.sql

# Or with RDS: Use AWS Backup service
```

### 9.3 Auto-restart on Reboot
```bash
# Add to crontab
crontab -e

# Add this line:
@reboot cd /opt/dawai-website && docker compose -f docker-compose.prod.yml up -d
```

### 9.4 Monitor Disk Space
```bash
df -h
du -sh /opt/dawai-website/*

# Clean old Docker images
docker image prune -a --force
```

---

## ⚠️ Step 10: Security Best Practices

### 10.1 Firewall Configuration
```bash
# Only allow necessary ports
sudo ufw enable
sudo ufw allow 22/tcp  # SSH
sudo ufw allow 80/tcp  # HTTP
sudo ufw allow 443/tcp # HTTPS
```

### 10.2 SSH Hardening
```bash
# Disable root login
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no

# Restart SSH
sudo systemctl restart ssh
```

### 10.3 Regular Updates
```bash
# Enable automatic security updates
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure unattended-upgrades
```

### 10.4 Environment Variables Security
```bash
# Never commit .env files
echo ".env.local" >> .gitignore

# Use AWS Secrets Manager for sensitive data
aws secretsmanager create-secret --name dawai/prod --secret-string file://secrets.json
```

---

## 🚀 Quick Deployment Command

Once everything is setup, deploy changes with:

```bash
cd /opt/dawai-website
git pull origin main
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d
docker compose exec web npx prisma migrate deploy
docker compose restart web
```

---

## 💰 AWS Pricing Estimate (Monthly)

| Service | Cost | Notes |
|---------|------|-------|
| EC2 t2.medium | $0 (1st year) | Free tier for 12 months |
| RDS PostgreSQL | $0-15 | db.t3.micro free tier |
| Data Transfer | ~$0.01 | 1GB free per month |
| **Total** | **$0-15** | **Minimal cost first year** |

---

## 🆘 Troubleshooting

### Application not loading
```bash
# Check if running
docker compose ps

# Check logs
docker compose logs web

# Restart
docker compose restart web
```

### Database connection error
```bash
# Test connection
docker compose exec web npx prisma db execute --stdin < /dev/null

# Check environment variables
docker compose exec web env | grep DATABASE
```

### SSL certificate issues
```bash
# Check certificate
sudo certbot certificates

# Renew manually
sudo certbot renew --force-renewal

# Verify Nginx
sudo nginx -t
```

### High disk usage
```bash
# Check space
df -h

# Clean Docker
docker system prune -a

# Clean logs
sudo journalctl --vacuum=50M
```

---

## 📞 Support & Resources

- **AWS Documentation:** https://docs.aws.amazon.com/
- **Let's Encrypt:** https://letsencrypt.org/
- **Docker Docs:** https://docs.docker.com/
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **PostgreSQL Docs:** https://www.postgresql.org/docs/

---

## ✅ Deployment Checklist

- [ ] AWS Account created & billing enabled
- [ ] EC2 instance launched (Ubuntu 22.04)
- [ ] Security group configured (SSH, HTTP, HTTPS)
- [ ] Key pair downloaded & secured
- [ ] Project cloned to EC2
- [ ] Docker & Docker Compose installed
- [ ] Environment variables configured
- [ ] Database setup (RDS or Docker)
- [ ] Application running (docker compose up)
- [ ] Nginx reverse proxy configured
- [ ] SSL certificate installed
- [ ] Domain pointing to EC2
- [ ] Health check working
- [ ] Backups configured
- [ ] Monitoring setup

---

**Deployed:** [Date]  
**Instance ID:** [Your EC2 Instance ID]  
**Domain:** [Your domain]  
**Public IP:** [Your EC2 IP]  

