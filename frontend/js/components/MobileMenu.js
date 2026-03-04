import styles from '../../css/components/MobileMenu.css?inline';

class MobileMenu extends HTMLElement {
    constructor() {
        super();
        this.boundHandleToggle = this.handleToggle.bind(this);

        const styleId = 'juzt-orbit-mobile-menu-styles';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = styles;
            document.head.appendChild(style);
        }
    }

    connectedCallback() {
        document.addEventListener('juzt-orbit:toggle-menu', this.boundHandleToggle);
        this.handleEvents();
    }

    disconnectedCallback() {
        document.removeEventListener('juzt-orbit:toggle-menu', this.boundHandleToggle);
    }

    handleToggle() {
        this.classList.toggle('open');
    }

    handleEvents() {
        document.querySelectorAll('[data-event]').forEach(el => {
            const eventName = el.getAttribute('data-event');
            el.addEventListener('click', () => {
                document.dispatchEvent(new CustomEvent(eventName, {
                    bubbles: true,
                    composed: true
                }));
            });
        });

        this.querySelector('.overlay').addEventListener('click', () => {
            this.classList.remove('open');
        });
    }
}

export default MobileMenu;