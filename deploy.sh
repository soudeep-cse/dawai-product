#!/bin/bash

###############################################
# Dawai Medicine Platform - Quick Deploy Script
# Usage: ./deploy.sh [production|staging]
###############################################

set -e  # Exit on error

COLOR_GREEN='\033[0;32m'
COLOR_YELLOW='\033[1;33m'
COLOR_RED='\033[0;31m'
COLOR_BLUE='\033[0;34m'
NC='\033[0m' # No Color

ENVIRONMENT=${1:-production}
PROJECT_DIR="/opt/dawai-website"
BACKUP_DIR="$PROJECT_DIR/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Functions
log_info() {
    echo -e "${COLOR_BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${COLOR_GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${COLOR_YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${COLOR_RED}❌ $1${NC}"
}

# Check if running as root
check_sudo() {
    if [[ $EUID -ne 0 ]]; then
        log_error "This script must be run as root or with sudo"
        exit 1
    fi
}

# Create backup
backup_database() {
    log_info "Creating database backup..."
    mkdir -p "$BACKUP_DIR"

    docker compose -f docker-compose.prod.yml exec -T postgres pg_dump \
        -U ${DB_USER:-dawai_user} ${DB_NAME:-dawai} \
        > "$BACKUP_DIR/backup_${TIMESTAMP}.sql"

    log_success "Database backed up to: $BACKUP_DIR/backup_${TIMESTAMP}.sql"
}

# Pull latest code
pull_code() {
    log_info "Pulling latest code from repository..."
    cd "$PROJECT_DIR"
    git pull origin main
    log_success "Code pulled successfully"
}

# Load environment
load_env() {
    log_info "Loading environment variables..."

    if [ "$ENVIRONMENT" == "production" ]; then
        if [ -f "$PROJECT_DIR/.env.local" ]; then
            export $(cat "$PROJECT_DIR/.env.local" | xargs)
            log_success "Production environment loaded"
        else
            log_error ".env.local not found! Copy from .env.production.example"
            exit 1
        fi
    else
        export $(cat "$PROJECT_DIR/.env" | xargs)
        log_success "Development environment loaded"
    fi
}

# Build and start application
deploy_application() {
    log_info "Building and starting application..."
    cd "$PROJECT_DIR"

    # Stop running containers
    log_info "Stopping current containers..."
    docker compose -f docker-compose.prod.yml down || true

    # Build and start
    log_info "Building and starting new containers..."
    docker compose -f docker-compose.prod.yml up -d

    # Wait for services to be healthy
    log_info "Waiting for services to be healthy (30 seconds)..."
    sleep 30

    # Check status
    if docker compose -f docker-compose.prod.yml ps | grep -q "healthy\|running"; then
        log_success "Containers started successfully"
    else
        log_error "Containers failed to start!"
        docker compose -f docker-compose.prod.yml logs
        exit 1
    fi
}

# Run migrations
run_migrations() {
    log_info "Running database migrations..."

    docker compose -f docker-compose.prod.yml exec app npx prisma migrate deploy || {
        log_warning "Migrations already up to date or skipped"
    }

    log_success "Migrations completed"
}

# Seed database (optional)
seed_database() {
    log_info "Seeding admin and categories..."

    docker compose -f docker-compose.prod.yml exec app node scripts/seed-admin.js && \
    docker compose -f docker-compose.prod.yml exec app node scripts/seed-final-categories.js || {
        log_warning "Seed scripts failed or already seeded"
    }

    log_success "Database seeding completed"
}

# Health check
health_check() {
    log_info "Performing health checks..."

    # Check if app is responding
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        log_success "Application health check passed"
    else
        log_error "Application health check failed!"
        log_info "Trying to get logs..."
        docker compose -f docker-compose.prod.yml logs app | tail -20
        exit 1
    fi

    # Check database
    if docker compose -f docker-compose.prod.yml exec postgres pg_isready -U ${DB_USER:-dawai_user} > /dev/null 2>&1; then
        log_success "Database health check passed"
    else
        log_error "Database health check failed!"
        exit 1
    fi
}

# Restart Nginx
restart_nginx() {
    log_info "Restarting Nginx..."

    if command -v nginx &> /dev/null; then
        sudo systemctl restart nginx
        log_success "Nginx restarted"
    else
        log_warning "Nginx not found, skipping restart"
    fi
}

# Show status
show_status() {
    log_info "\n📊 Deployment Status:\n"

    log_info "Docker Containers:"
    docker compose -f docker-compose.prod.yml ps

    log_info "\n📈 Application Info:"
    log_info "URL: https://yourdomain.com (or http://$(hostname -I | awk '{print $1}'):3000)"
    log_info "Environment: $ENVIRONMENT"
    log_info "Timestamp: $TIMESTAMP"

    log_info "\n📝 Recent Logs:"
    docker compose -f docker-compose.prod.yml logs --tail=5 app
}

# Main deployment flow
main() {
    log_info "\n🚀 Starting Dawai Deployment (${ENVIRONMENT})\n"

    check_sudo

    # Step 1: Backup
    backup_database

    # Step 2: Pull code
    pull_code

    # Step 3: Load environment
    load_env

    # Step 4: Deploy
    deploy_application

    # Step 5: Migrations
    run_migrations

    # Step 6: Seed (optional, comment out if not needed)
    # seed_database

    # Step 7: Health checks
    health_check

    # Step 8: Restart Nginx
    restart_nginx

    # Step 9: Show status
    show_status

    log_success "\n✅ Deployment completed successfully!\n"

    # Cleanup old backups (keep last 10)
    log_info "Cleaning up old backups..."
    ls -1t "$BACKUP_DIR"/backup_*.sql 2>/dev/null | tail -n +11 | xargs -r rm
    log_success "Old backups cleaned"
}

# Rollback function
rollback() {
    log_warning "\n🔄 Rolling back deployment...\n"

    LATEST_BACKUP=$(ls -1t "$BACKUP_DIR"/backup_*.sql 2>/dev/null | head -1)

    if [ -z "$LATEST_BACKUP" ]; then
        log_error "No backup found to restore!"
        exit 1
    fi

    log_info "Restoring from: $LATEST_BACKUP"

    docker compose -f docker-compose.prod.yml exec -T postgres psql \
        -U ${DB_USER:-dawai_user} ${DB_NAME:-dawai} < "$LATEST_BACKUP"

    log_success "Rollback completed"
}

# Show help
show_help() {
    cat << EOF
Dawai Medicine Platform - Deployment Script

Usage: ./deploy.sh [command] [environment]

Commands:
  deploy      Deploy application (default)
  rollback    Rollback to latest backup
  logs        Show application logs
  status      Show deployment status
  backup      Create database backup only
  help        Show this help message

Environments:
  production  Production deployment (default)
  staging     Staging deployment

Examples:
  ./deploy.sh                    # Deploy to production
  ./deploy.sh deploy staging     # Deploy to staging
  ./deploy.sh logs               # Show logs
  ./deploy.sh rollback           # Rollback changes
  ./deploy.sh status             # Show status

EOF
}

# Parse commands
case "${1:-deploy}" in
    deploy)
        main
        ;;
    rollback)
        load_env
        rollback
        ;;
    logs)
        cd "$PROJECT_DIR"
        docker compose -f docker-compose.prod.yml logs -f app
        ;;
    status)
        cd "$PROJECT_DIR"
        show_status
        ;;
    backup)
        load_env
        backup_database
        ;;
    help)
        show_help
        ;;
    *)
        log_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
