# Setup Instructions: Cleani Platform

## Requirements
- PHP 8.1 or higher
- MySQL / MariaDB
- Apache with `mod_rewrite` enabled (for clean URLs)

## Local Installation (XAMPP/WAMP)
1.  **Clone the repository** to your `htdocs` or `www` folder.
2.  **Database Setup**:
    - Open phpMyAdmin or your MySQL client.
    - Create a database named `cleani_db`.
    - Import the SQL schema from `scripts/schema.sql`.
3.  **Configuration**:
    - Open `config/db.php`.
    - Update the `username` and `password` to match your local database settings.
4.  **Accessing the Platform**:
    - Customer Website: `http://localhost/Cleani_Service/public/`
    - Admin Dashboard: `http://localhost/Cleani_Service/public/dashboard.html`

## Production Deployment
- Ensure `mod_rewrite` is enabled on your server.
- The `.htaccess` file handles URL routing.
- Set up a cron job for database backups (recommended).
- Enforce HTTPS for secure session management.

## Default Admin Credentials
*Note: You must manually create a user in the `users` table with `role_id=1` or use a seed script.*
- Seed script creates roles: 1 (Super Admin), 2 (Manager), 3 (Staff), 4 (Customer).
