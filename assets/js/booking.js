// assets/js/booking.js

class BookingManager {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.bookingData = {
            serviceId: '',
            details: {},
            schedule: '',
            contact: {}
        };
        
        this.init();
    }

    init() {
        this.renderStep();
        this.setupEventListeners();
        window.bookingManager = this;
    }

    setupEventListeners() {
        document.getElementById('next-btn').addEventListener('click', () => this.nextStep());
        document.getElementById('prev-btn').addEventListener('click', () => this.prevStep());
    }

    setService(serviceId) {
        this.bookingData.serviceId = serviceId;
        this.currentStep = 2;
        this.renderStep();
        document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
    }

    renderStep() {
        const content = document.getElementById('step-content');
        const nextBtn = document.getElementById('next-btn');
        const prevBtn = document.getElementById('prev-btn');
        
        // Update indicators
        document.querySelectorAll('.step').forEach(el => {
            el.classList.toggle('active', parseInt(el.dataset.step) === this.currentStep);
        });

        // Toggle buttons
        prevBtn.classList.toggle('hidden', this.currentStep === 1);
        nextBtn.textContent = this.currentStep === this.totalSteps ? 'Confirm Booking' : 'Continue';

        switch (this.currentStep) {
            case 1:
                content.innerHTML = `
                    <h3>Select a Service</h3>
                    <p>Please choose a service from the list above to get started.</p>
                `;
                break;
            case 2:
                content.innerHTML = `
                    <h3>Property Details</h3>
                    <div class="form-group">
                        <label>Property Type</label>
                        <select id="property-type">
                            <option value="apartment">Apartment</option>
                            <option value="house">Single Family House</option>
                            <option value="office">Office Space</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Number of Rooms</label>
                        <input type="number" id="rooms" min="1" value="1">
                    </div>
                `;
                break;
            case 3:
                content.innerHTML = `
                    <h3>Schedule</h3>
                    <div class="form-group">
                        <label>Date</label>
                        <input type="date" id="booking-date">
                    </div>
                    <div class="form-group">
                        <label>Preferred Time</label>
                        <select id="booking-time">
                            <option value="09:00">09:00 AM</option>
                            <option value="13:00">01:00 PM</option>
                            <option value="17:00">05:00 PM</option>
                        </select>
                    </div>
                `;
                break;
            case 4:
                content.innerHTML = `
                    <h3>Contact Information</h3>
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" id="full-name" required>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="email" required>
                    </div>
                    <div class="form-group">
                        <label>Phone</label>
                        <input type="tel" id="phone" required>
                    </div>
                `;
                break;
        }
    }

    nextStep() {
        if (this.currentStep < this.totalSteps) {
            this.saveStepData();
            this.currentStep++;
            this.renderStep();
        } else {
            this.submitBooking();
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.renderStep();
        }
    }

    saveStepData() {
        if (this.currentStep === 2) {
            this.bookingData.details = {
                type: document.getElementById('property-type').value,
                rooms: document.getElementById('rooms').value
            };
        } else if (this.currentStep === 3) {
            this.bookingData.schedule = {
                date: document.getElementById('booking-date').value,
                time: document.getElementById('booking-time').value
            };
        } else if (this.currentStep === 4) {
            this.bookingData.contact = {
                name: document.getElementById('full-name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value
            };
        }
    }

    async submitBooking() {
        this.saveStepData();
        console.log('Submitting booking:', this.bookingData);
        
        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.bookingData)
            });
            const result = await response.json();
            
            if (result.status === 200 || result.status === 201) {
                alert('Booking successful! We will contact you shortly.');
                window.location.reload();
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            alert('Failed to submit booking. Please try again later.');
        }
    }
}

new BookingManager();
