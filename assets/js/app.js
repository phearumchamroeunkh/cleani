// assets/js/app.js

document.addEventListener('DOMContentLoaded', () => {
    fetchServices();
    fetchFAQ();
});

async function fetchServices() {
    const grid = document.getElementById('services-grid');
    try {
        const response = await fetch('/api/services');
        const result = await response.json();
        
        if (result.status === 200) {
            renderServices(result.data);
        } else {
            grid.innerHTML = `<p class="error">Error loading services: ${result.message}</p>`;
        }
    } catch (error) {
        grid.innerHTML = '<p class="error">Failed to connect to the server.</p>';
    }
}

function renderServices(services) {
    const grid = document.getElementById('services-grid');
    grid.innerHTML = services.map(service => `
        <div class="card">
            <h3>${service.name}</h3>
            <p>${service.description}</p>
            <div class="price">From $${service.base_price}</div>
            <a href="#booking" class="btn-primary" onclick="selectService('${service.id}')">Book This</a>
        </div>
    `).join('');
}

async function fetchFAQ() {
    const faqList = document.getElementById('faq-list');
    try {
        const response = await fetch('/api/faq');
        const result = await response.json();
        
        if (result.status === 200) {
            renderFAQ(result.data);
        }
    } catch (error) {
        console.error('Failed to fetch FAQ', error);
    }
}

function renderFAQ(faqs) {
    const faqList = document.getElementById('faq-list');
    faqList.innerHTML = faqs.map(faq => `
        <div class="faq-item">
            <h4>${faq.question}</h4>
            <p>${faq.answer}</p>
        </div>
    `).join('');
}

function selectService(serviceId) {
    // This will be handled by booking.js
    if (window.bookingManager) {
        window.bookingManager.setService(serviceId);
    }
}
