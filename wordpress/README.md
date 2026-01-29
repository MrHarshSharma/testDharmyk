# Dharmyk WordPress Backend

This directory contains the WordPress backend for the Dharmyk app, running in Docker.

## Quick Start

1. **Start Docker containers:**
   ```bash
   cd wordpress
   docker-compose up -d
   ```

2. **Access WordPress:**
   - Frontend: http://localhost:8080
   - Admin: http://localhost:8080/wp-admin

3. **Initial Setup:**
   - Complete WordPress installation wizard
   - Username: `admin` (or your choice)
   - Password: Choose a strong password

4. **Activate Plugin and Theme:**
   - Go to Plugins → Installed Plugins
   - Activate "Dharmyk Core"
   - Go to Appearance → Themes
   - Activate "Dharmyk AMP"

5. **Install Required Plugins:**
   - Go to Plugins → Add New
   - Search and install:
     - "AMP" (Official AMP Plugin for WordPress)
     - "Advanced Custom Fields" (ACF)
   - Activate both plugins

## API Endpoint

Once set up, the Sadhana API will be available at:
```
GET http://localhost:8080/wp-json/dharmyk/v1/sadhana?date=YYYY-MM-DD
```

## AMP Card URLs

Individual cards can be accessed at:
```
http://localhost:8080/sadhana/{post_id}?card=intro
http://localhost:8080/sadhana/{post_id}?card=shloka
http://localhost:8080/sadhana/{post_id}?card=katha
http://localhost:8080/sadhana/{post_id}?card=smriti
http://localhost:8080/sadhana/{post_id}?card=manana
```

## Stopping Docker

```bash
docker-compose down
```

To remove all data (reset):
```bash
docker-compose down -v
```
