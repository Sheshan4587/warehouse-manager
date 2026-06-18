# Warehouse Manager

A full-featured inventory and warehouse management system built with **Laravel 13**, **React**, **Inertia.js**, and **Tailwind CSS**.

## Tech Stack

| Layer      | Technology          |
|------------|---------------------|
| Backend    | Laravel 13          |
| Frontend   | React + Inertia.js  |
| Styling    | Tailwind CSS        |
| Build Tool | Vite                |
| Database   | MySQL               |

## Local Development Setup

### Requirements
- PHP 8.3+
- Composer
- Node.js 20+
- MySQL 8+

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/warehouse-manager.git
cd warehouse-manager

# 2. Install dependencies
composer install
npm install

# 3. Set up environment
cp .env.example .env
php artisan key:generate

# 4. Configure your database in .env, then run migrations
php artisan migrate

# 5. Start dev servers (two terminals)
php artisan serve
npm run dev
```

## Features (Planned)

- [ ] Dashboard with live stock overview
- [ ] Shipment intake — log incoming deliveries
- [ ] Product & category management
- [ ] Daily sales entry
- [ ] Stock level tracking with low-stock alerts
- [ ] Supplier management
- [ ] Transaction history & reports
- [ ] Export to Excel/PDF