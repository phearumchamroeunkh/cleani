// assets/js/dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
});

async function initDashboard() {
    // 1. Basic Auth Check
    const userRole = localStorage.getItem('cleani_role');
    if (!userRole) {
        // Simple mock check, real app would verify session via API
        // window.location.href = '/public/login.html';
    }

    setupNavigation();
    loadModule('overview');
}

function setupNavigation() {
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const module = link.dataset.module;
            
            document.querySelectorAll('.sidebar-nav a').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            loadModule(module);
        });
    });

    document.getElementById('logout-btn').addEventListener('click', async () => {
        await fetch('/api/logout');
        localStorage.removeItem('cleani_role');
        window.location.href = '/public/index.html';
    });
}

function loadModule(module) {
    const content = document.getElementById('dashboard-content');
    const title = document.getElementById('module-title');
    title.textContent = module.charAt(0).toUpperCase() + module.slice(1);
    
    content.innerHTML = '<div class="loading">Loading...</div>';

    switch (module) {
        case 'overview':
            renderOverview();
            break;
        case 'bookings':
            renderBookings();
            break;
        case 'team':
            content.innerHTML = '<h3>Team Management</h3><p>Coming soon...</p>';
            break;
        case 'payments':
            content.innerHTML = '<h3>Payments & Invoices</h3><p>Coming soon...</p>';
            break;
        default:
            content.innerHTML = '<h3>Module Not Found</h3>';
    }
}

async function renderOverview() {
    const content = document.getElementById('dashboard-content');
    
    // Mock data for now, real app would fetch from api/dashboard_stats.php
    const stats = {
        todayBookings: 8,
        pendingPayments: 3,
        staffOnDuty: 5,
        totalRevenue: '$1,240'
    };

    content.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card"><h4>Today's Bookings</h4><div class="value">${stats.todayBookings}</div></div>
            <div class="stat-card"><h4>Pending Payments</h4><div class="value">${stats.pendingPayments}</div></div>
            <div class="stat-card"><h4>Staff On Duty</h4><div class="value">${stats.staffOnDuty}</div></div>
            <div class="stat-card"><h4>Weekly Revenue</h4><div class="value">${stats.totalRevenue}</div></div>
        </div>
        <div class="recent-activity">
            <h3>Recent Bookings</h3>
            <div id="recent-bookings-list">Loading...</div>
        </div>
    `;
    
    fetchRecentBookings();
}

async function fetchRecentBookings() {
    const list = document.getElementById('recent-bookings-list');
    try {
        const response = await fetch('/api/dashboard_bookings');
        const result = await response.json();
        
        if (result.status === 200) {
            list.innerHTML = `
                <div class="data-table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Customer</th>
                                <th>Service</th>
                                <th>Schedule</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${result.data.map(b => `
                                <tr>
                                    <td>#${b.id}</td>
                                    <td>${b.customer_name}</td>
                                    <td>${b.service_name}</td>
                                    <td>${b.schedule_date}</td>
                                    <td><span class="status-badge status-${b.status}">${b.status}</span></td>
                                    <td><button class="btn-secondary btn-small">Edit</button></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }
    } catch (e) {
        list.innerHTML = 'Error loading recent bookings.';
    }
}

async function renderBookings() {
    // Full bookings management module
    renderOverview(); // For now, share logic or refine
}
