class Notification
{
    constructor()
    {
        this.message = '';
        this.type    = 'info';
        document.head.querySelector('#notification-styles') || document.head.appendChild(this.getStyles());        
    }

    getStyles()
    {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                z-index: 9999999;
                position: fixed;
                top: 1rem;
                right: 1rem;
                background: var(--primary-color, #111827);
                color: #ffffff;
                padding: 1rem 2rem;
                border-radius: 1rem;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                opacity: 0;
                transform: translateY(-20px);
                transition: opacity 0.3s ease, transform 0.3s ease;
            }

            .notification.show {
                opacity: 1;
                transform: translateY(0);
            }
            
            .notification.info {
                background: var(--primary-color, #111827);
            }

            .notification.success {
                background: var(--success-color, #10b981);
            }

            .notification.error {
                background: var(--error-color, #ef4444);
            }
        `;
        return style;
    }

    show(message, type = 'info')
    {
        this.message = message;
        this.type = type;
        this.render();
        setTimeout(() => this.hide(), 3000);
    }

    hide()
    {
        const notification = document.querySelector('.notification');
        if (notification) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document) {
                    document.innerHTML = '';
                }
            }, 300);
        }
    }

    render()
    {
        document.body.innerHTML += `
            <div class="notification ${this.type} show">
                ${this.message}
            </div>
        `;
    }
}

export default Notification;