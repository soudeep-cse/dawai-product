# 🚀 Dawai Medicine Platform - VPS Deployment Guide

**Date:** 2026-09-22  
**Platform:** Docker + PostgreSQL + Nginx on VPS

---

## 📋 Prerequisites

- VPS with Ubuntu 20.04+ (Recommended: DigitalOcean, Linode, AWS EC2)
- 2GB RAM minimum (4GB+ recommended)
- 20GB storage minimum
- SSH access to VPS
- Domain name (optional but recommended)

---

## 🔧 Step 1: VPS Initial Setup

### Connect to VPS
```bash
ssh root@your-vps-ip
```

### Update System
```bash
apt update && apt upgrade -y
```

### Install Docker & Docker Compose
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install -y docker-compose

# Add current user to docker group
usermod -aG docker $USER
newgrp docker

# Verify installation
docker --version
docker compose --version
```

### Install Git
```bash
apt install -y git
```

### Install Certbot (for SSL certificates)
```bash
apt install -y certbot python3-certbot-nginx
```

---

## 📁 Step 2: Clone Project to VPS

```bash
# Navigate to desired directory
cd /opt

# Clone repository
git clone https://github.com/your-repo/dawai-website.git
cd dawai-website

# Or if using SSH key
git clone git@github.com:your-repo/dawai-website.git
cd dawai-website
```

---

## 🔐 Step 3: Configure Environment Variables

```bash
# Copy production environment file
cp .env.production .env.production.local

# Edit with your production values
nano .env.production.local
```

**Set these values:**
- `DB_PASSWORD` - Use strong password: `openssl rand -base64 32`
- `JWT_SECRET` - Generate: `openssl rand -base64 32`
- `OPENAI_API_KEY` - Your actual OpenAI key
- `NEXT_PUBLIC_APP_URL` - Your domain or IP
- `SMS_API_KEY` - Real SMS provider key

---

## 🗄️ Step 4: Start Services

```bash
# Export environment variables
export $(cat .env.production.local | xargs)

# Start services with docker compose
docker compose -f docker-compose.prod.yml up -d

# Check services are running
docker compose -f docker-compose.prod.yml ps

# Check logs
docker compose -f docker-compose.prod.yml logs -f app
```

**Expected output:**
```
NAME                COMMAND             STATUS
dawai-db-prod       postgres            Up (healthy)
dawai-app-prod      node...             Up
dawai-nginx-prod    nginx               Up
```

---

## 📡 Step 5: SSL Certificate Setup (HTTPS)

### Option A: Let's Encrypt (Recommended - Free)

```bash
# Stop Nginx temporarily
docker compose -f docker-compose.prod.yml stop nginx

# Generate certificate
certbot certonly --standalone -d your-domain.com -d www.your-domain.com

# Create SSL directory and copy certificates
mkdir -p ssl
cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ssl/
cp /etc/letsencrypt/live/your-domain.com/privkey.pem ssl/

# Fix permissions
chmod 644 ssl/*.pem
```

### Update nginx.conf
Uncomment the HTTPS section in `nginx.conf`:
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    # ... rest of config
}
```

### Restart services
```bash
docker compose -f docker-compose.prod.yml up -d nginx
```

### Setup Auto-Renewal
```bash
# Create renewal script
cat > /opt/renew-cert.sh << 'EOF'
#!/bin/bash
cd /opt/dawai-website
docker compose -f docker-compose.prod.yml stop nginx
certbot renew --quiet
cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ssl/
cp /etc/letsencrypt/live/your-domain.com/privkey.pem ssl/
docker compose -f docker-compose.prod.yml up -d nginx
EOF

chmod +x /opt/renew-cert.sh

# Add to crontab (runs monthly)
crontab -e
# Add: 0 2 1 * * /opt/renew-cert.sh
```

---

## ✅ Step 6: Verify Deployment

### Check Services
```bash
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs app | tail -20
```

### Test API Endpoint
```bash
curl http://your-vps-ip:3000/api/health
```

### Visit Website
```
http://your-domain.com  (or http://your-vps-ip if no domain)
```

---

## 🔄 Step 7: Database Backup Strategy

### Automatic Daily Backup
```bash
# Create backup script
cat > /opt/backup-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/dawai-website/backups"
DATE=$(date +%Y-%m-%d_%H-%M-%S)

# Backup database
docker exec dawai-db-prod pg_dump -U $DB_USER $DB_NAME | \
  gzip > "$BACKUP_DIR/dawai-backup-$DATE.sql.gz"

# Keep only last 7 days
find $BACKUP_DIR -name "dawai-backup-*.sql.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR/dawai-backup-$DATE.sql.gz"
EOF

chmod +x /opt/backup-db.sh

# Schedule daily backup at 2 AM
crontab -e
# Add: 0 2 * * * /opt/backup-db.sh
```

### Manual Backup (Anytime)
```bash
cd /opt/dawai-website
docker exec dawai-db-prod pg_dump -U $(grep DB_USER .env.production.local | cut -d= -f2) \
  $(grep DB_NAME .env.production.local | cut -d= -f2) | \
  gzip > backups/manual-backup-$(date +%Y%m%d-%H%M%S).sql.gz
```

### Restore from Backup
```bash
# Restore specific backup
gunzip -c backups/dawai-backup-2026-09-22_14-30-00.sql.gz | \
  docker exec -i dawai-db-prod psql -U $DB_USER $DB_NAME
```

---

## 📊 Step 8: Monitoring & Logs

### View Logs
```bash
# App logs
docker compose -f docker-compose.prod.yml logs -f app

# Database logs
docker compose -f docker-compose.prod.yml logs -f postgres

# Nginx logs
docker compose -f docker-compose.prod.yml logs -f nginx

# All logs
docker compose -f docker-compose.prod.yml logs -f
```

### Check Resource Usage
```bash
# CPU, Memory, Network stats
docker stats

# Detailed container info
docker compose -f docker-compose.prod.yml top app
docker compose -f docker-compose.prod.yml top postgres
```

### Setup Monitoring (Optional)
```bash
# Install monitoring tools
apt install -y htop iotop nethogs

# Monitor real-time
htop
```

---

## 🛡️ Step 9: Security Hardening

### Firewall Configuration
```bash
# Install UFW
apt install -y ufw

# Allow SSH
ufw allow 22/tcp

# Allow HTTP/HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Enable firewall
ufw enable

# Check rules
ufw status
```

### SSH Security
```bash
# Disable root login
sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config

# Disable password auth (use SSH keys)
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config

# Restart SSH
systemctl restart sshd
```

### Database Security
- ✅ Database only accessible internally (127.0.0.1)
- ✅ Strong password in `.env.production.local`
- ✅ Regular backups
- ✅ Connection pooling enabled

---

## 🚀 Step 10: Daily Operations

### Restart Services
```bash
docker compose -f docker-compose.prod.yml restart
```

### Update Application (New Deployment)
```bash
cd /opt/dawai-website

# Pull latest code
git pull origin main

# Rebuild and restart
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d --build

# Verify
docker compose -f docker-compose.prod.yml ps
```

### Check Service Health
```bash
# HTTP health check
curl -s http://localhost:3000/api/health | jq .

# Database connectivity
docker compose -f docker-compose.prod.yml exec postgres pg_isready -U $(grep DB_USER .env.production.local | cut -d= -f2)
```

### View Recent Changes
```bash
git log --oneline -10
docker compose -f docker-compose.prod.yml logs --tail=50 app
```

---

## 🆘 Troubleshooting

### Container Won't Start
```bash
# Check logs
docker compose -f docker-compose.prod.yml logs app

# Common issues:
# 1. Port already in use
docker ps -a
docker compose -f docker-compose.prod.yml down

# 2. Out of memory
free -h
docker stats

# 3. Database connection issue
docker compose -f docker-compose.prod.yml exec postgres psql -U $(grep DB_USER .env.production.local | cut -d= -f2) -l
```

### Database Connection Failed
```bash
# Check if DB is running
docker compose -f docker-compose.prod.yml ps postgres

# Restart database
docker compose -f docker-compose.prod.yml restart postgres

# Check database logs
docker compose -f docker-compose.prod.yml logs postgres
```

### High CPU/Memory Usage
```bash
# Monitor processes
docker stats
htop

# Restart app container
docker compose -f docker-compose.prod.yml restart app

# Check for stuck processes
ps aux | grep node
```

### SSL Certificate Issues
```bash
# Check certificate expiration
openssl x509 -in ssl/fullchain.pem -noout -dates

# Renew manually
certbot renew --force-renewal

# Copy to ssl directory
cp /etc/letsencrypt/live/your-domain.com/* ssl/
chmod 644 ssl/*.pem

# Restart nginx
docker compose -f docker-compose.prod.yml restart nginx
```

---

## 📈 Performance Optimization

### Enable Caching
Already configured in `nginx.conf`:
- Static files cached for 30 days
- Gzip compression enabled
- Connection pooling in database

### Monitor Performance
```bash
# Check response times
curl -w "@curl-format.txt" -o /dev/null -s http://your-domain.com/

# Use Apache Bench for load testing
ab -n 1000 -c 10 http://your-domain.com/
```

---

## 🎯 Deployment Checklist

- [ ] VPS created and SSH access verified
- [ ] Docker & Docker Compose installed
- [ ] Code cloned from Git
- [ ] `.env.production.local` configured
- [ ] Services started successfully
- [ ] Database initialized and healthy
- [ ] SSL certificate installed
- [ ] Firewall configured
- [ ] Domain points to VPS IP
- [ ] Health check endpoint responding
- [ ] Backup script scheduled
- [ ] Monitoring setup complete
- [ ] Team has documentation

---

## 📞 Support & Monitoring

### Monitor Dashboard (Optional Setup)
```bash
# Install Portainer for visual management
docker run -d -p 8000:8000 -p 9000:9000 \
  --name=portainer \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce

# Access at: http://your-vps-ip:9000
```

### Email Alerts (Optional)
Setup monitoring that sends alerts for:
- Service down
- High CPU/Memory
- Database issues
- Backup failures

---

## ✅ Status

**Deployment Ready:** All configurations in place for production deployment.

**Next Steps:**
1. Prepare VPS
2. Follow deployment guide
3. Test thoroughly
4. Monitor performance
5. Plan scaling if needed

---

**Created:** 2026-09-22  
**For:** Dawai Medicine Delivery Platform  
**Environment:** Production (Docker + PostgreSQL + Nginx)
