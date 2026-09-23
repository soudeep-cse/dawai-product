# 🚀 Deploy Dawai to AWS EC2 with GitHub Actions + Caddy

This guide automates deployment: push to `main` → GitHub Actions builds & deploys to EC2 automatically. Caddy handles SSL/domain without manual config.

---

## 📋 Prerequisites

- AWS Account with EC2 access (ap-south-1 region recommended)
- GitHub repository push access
- Domain name (optional, but recommended for Caddy)

---

## Step 1: Launch EC2 Instance

### 1.1 AWS Console
```
EC2 → Instances → Launch New Instance
```

**Configuration:**
- **AMI:** Ubuntu Server 22.04 LTS
- **Instance Type:** `t3.small` (2GB RAM, ~$15/month)
- **Region:** `ap-south-1` (Mumbai)
- **Storage:** 30 GB
- **Security Group:** Allow SSH (22), HTTP (80), HTTPS (443)

### 1.2 Get Instance Details
After launch, note:
- **Public IPv4 Address** (e.g., `3.111.123.45`)
- **Public IPv4 DNS** (e.g., `ec2-3-111-123-45.compute-1.amazonaws.com`)

---

## Step 2: SSH Setup & Initial Configuration

### 2.1 Connect to EC2
```bash
# Using your key pair (download from AWS)
ssh -i ~/.ssh/your-key.pem ubuntu@3.111.123.45
```

### 2.2 Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 2.3 Install Docker & Docker Compose
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose plugin
sudo apt install -y docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Verify
docker --version
docker compose --version
```

### 2.4 Install Git
```bash
sudo apt install -y git
```

### 2.5 Install Caddy (Free SSL)
```bash
# Add Caddy repository
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl https://dl.filippo.io/caddy/pkg | sudo bash
sudo apt update

# Install Caddy
sudo apt install -y caddy

# Verify
caddy version
```

---

## Step 3: Clone Project & Setup

### 3.1 Clone Repository
```bash
cd /opt
sudo git clone https://github.com/soudeep-cse/dawai-product.git dawai-website
cd dawai-website
sudo chown -R $USER:$USER .
```

### 3.2 Create Environment File
```bash
cp .env.production .env.local
nano .env.local
```

**Edit with actual values:**
```env
# Database
DB_USER="dawai_user"
DB_PASSWORD="generate-strong-password-here"
DB_NAME="dawai"

# JWT Secret (generate: openssl rand -base64 32)
JWT_SECRET="your-generated-secret"

# App URL (update after domain is configured)
NEXT_PUBLIC_APP_URL="http://3.111.123.45"

# APIs (add if available)
OPENAI_API_KEY="sk-..."
SMS_API_KEY="your-sms-key"
SMS_SENDER_ID="DAWAI"
```

**Generate strong values:**
```bash
# Generate JWT secret
openssl rand -base64 32

# Generate DB password
openssl rand -base64 20
```

---

## Step 4: GitHub Actions Setup

### 4.1 Add GitHub Secrets
Go to GitHub → Settings → Secrets and add:

```
VPS_HOST = 3.111.123.45
VPS_USER = ubuntu
VPS_SSH_KEY = (content of your downloaded .pem file)
```

**To get your SSH key content:**
```bash
cat ~/.ssh/your-key.pem
```
Copy the entire output and paste into `VPS_SSH_KEY` secret.

### 4.2 First Deployment (Manual)
```bash
cd /opt/dawai-website

# Build and start
docker compose -f docker-compose.vps.yml up -d --build

# Wait for database
sleep 10

# Run migrations
docker compose -f docker-compose.vps.yml exec app npx prisma migrate deploy

# Seed admin user and categories
docker compose -f docker-compose.vps.yml exec app node scripts/seed-admin.js
docker compose -f docker-compose.vps.yml exec app node scripts/seed-final-categories.js

# Verify
docker compose -f docker-compose.vps.yml ps
curl http://localhost:3000/api/health
```

---

## Step 5: Caddy Setup (with or without Domain)

### 5.1 Update Caddyfile (Before Domain)
**Test without domain first:**

```bash
sudo nano /etc/caddy/Caddyfile
```

**For testing (without domain):**
```
http://3.111.123.45 {
    reverse_proxy localhost:3000
    encode gzip
    
    log {
        output stdout
    }
}
```

**Reload Caddy:**
```bash
sudo systemctl restart caddy
```

**Verify:**
```bash
curl http://3.111.123.45
```

### 5.2 Later: Update for Domain
Once you have a domain pointing to the EC2 IP:

```bash
sudo nano /etc/caddy/Caddyfile
```

**Replace with:**
```
yourdomain.com www.yourdomain.com {
    reverse_proxy localhost:3000 {
        header_up Connection *upgrade*
        header_up Upgrade websocket
        header_up X-Real-IP {http.request.remote.host}
        header_up X-Forwarded-For {http.request.remote.host}
        header_up X-Forwarded-Proto {http.request.proto}
    }
    
    encode gzip
    
    header / Strict-Transport-Security "max-age=31536000"
    header / X-Content-Type-Options "nosniff"
    header / X-Frame-Options "SAMEORIGIN"
    
    log {
        output stdout
        format json
    }
}
```

**Reload:**
```bash
sudo systemctl restart caddy
```

Caddy automatically generates SSL certificates! ✅

---

## Step 6: Enable Auto-Deploy

### 6.1 Test GitHub Actions
Push to main branch:
```bash
git add -A
git commit -m "Deploy setup complete"
git push origin main
```

Watch deployment at: **GitHub → Actions → Deploy to VPS**

### 6.2 What GitHub Actions Does
On each push to `main`:
1. ✅ Builds Next.js app
2. ✅ SSH into EC2
3. ✅ Pulls latest code
4. ✅ Builds Docker image
5. ✅ Runs migrations
6. ✅ Restarts app
7. ✅ Health checks

---

## 📊 Useful Commands

### Check App Status
```bash
docker compose -f docker-compose.vps.yml ps
docker compose -f docker-compose.vps.yml logs -f app
```

### Restart App (if needed)
```bash
docker compose -f docker-compose.vps.yml restart app
```

### Admin Login
```
URL: http://<your-ip>/admin/login
Email: admin@dawai.com
Password: admin123
```

### Database Backup
```bash
docker compose -f docker-compose.vps.yml exec postgres pg_dump \
  -U dawai_user dawai > backup.sql
```

### View Caddy Status
```bash
sudo systemctl status caddy
sudo journalctl -u caddy -f
```

---

## 🔒 Security Checklist

- [ ] EC2 security group restricts SSH to your IP (recommended) or uses key pair only
- [ ] `.env.local` is in `.gitignore` (already done)
- [ ] Strong `DB_PASSWORD` and `JWT_SECRET` generated
- [ ] Caddy auto-renews SSL certificates (check `/var/log/caddy/access.log`)
- [ ] Admin password changed from default `admin123`

---

## 💰 Cost Estimate (Monthly)

| Service | Cost |
|---------|------|
| EC2 t3.small (500 free hours/month) | $10-15 |
| Data transfer | $0.01-2 |
| Storage | $0-1 |
| **Total** | **~$10-20** |

---

## ❓ Troubleshooting

### App not accessible
```bash
# Check if running
docker compose -f docker-compose.vps.yml ps

# Check logs
docker compose -f docker-compose.vps.yml logs app

# Test health
curl http://localhost:3000/api/health
```

### GitHub Actions failing
1. Check **GitHub → Actions** tab for error logs
2. Verify secrets are set correctly:
   ```bash
   # On EC2, test SSH key:
   ssh -i ~/.ssh/your-key.pem ubuntu@localhost
   ```

### Caddy SSL not working
```bash
# Check Caddy status
sudo systemctl status caddy

# View logs
sudo journalctl -u caddy -n 50

# Restart
sudo systemctl restart caddy
```

### Database connection error
```bash
# Check if postgres is running
docker compose -f docker-compose.vps.yml logs postgres

# Test connection
docker compose -f docker-compose.vps.yml exec postgres \
  pg_isready -U dawai_user
```

---

## 📞 Next Steps

1. **Add Custom Domain** (when ready):
   - Point domain DNS A record to EC2 public IP
   - Update `Caddyfile` with domain name
   - Caddy auto-generates SSL certificate

2. **Monitor Performance**:
   - Watch GitHub Actions for deployment status
   - Check app logs for errors
   - Monitor CPU/Memory on AWS Console

3. **Backup Strategy**:
   - GitHub has your code history
   - Database backups stored in `/backups` directory
   - Consider AWS RDS for managed backups (future)

---

**Deployed successfully! 🎉**
