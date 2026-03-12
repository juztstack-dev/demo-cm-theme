class AuthLogin extends HTMLElement {
    static get observedAttributes() {
        return ['allow-recovery'];
    }

    async attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'allow-recovery' && oldValue !== newValue) {
            this.allowRecovery = newValue === '1' || newValue === 'true';
            console.log("x", this.allowRecovery);
            if (this.isConnected) {
                this.render();
                this.listeners();
            }
        }
    }

    constructor() {
        super();
        this._loading      = true;
        this._loading_form = false;
        this._view         = 'login';
        this.error         = null;
        this.form = {
            username: ''
        };
        this.allowRecovery = false;
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this._loading = false;
        this.checkView();
        this.render();
        this.listeners();
    }

    checkView(){
        const hash = window.location.hash.replace('#', '');
        if(hash === 'login' || hash === 'register' || hash === 'recovery'){
            this._view = hash;
        } else {
            this._view = 'login';
        }

        window.location.hash = this._view;
    }

    getStyles() {
        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: flex;
                justify-content: center;
                align-items: center;
                font-family: var(--main-font, sans-serif);
                color: var(--text-color, #111827);
                min-height: calc(100vh - 156px);
            }
            .login-link {
                font-size: 0.875rem;
                color: var(--primary-color, #111827);
                text-decoration: none;
                margin-bottom: 1rem;
            }
            .login-title {
                font-size: 1.5rem;
                font-weight: bold;
                margin-bottom: 1rem;
            }
            .auth-login {
                max-width: 400px;
                width: 100%;
                margin: 0 auto;
                padding: 1rem;
                background: var(--background-color, #ffffff);
                border-radius: 0.5rem;
                opacity: 1;
                transform: translateY(0);
                transition: opacity 180ms ease, transform 180ms ease;
            }

            .auth-login--enter {
                animation: auth-login-fade-in 180ms ease;
            }

            .auth-login--leave {
                opacity: 0;
                transform: translateY(6px);
            }

            .auth-login form {
                display: flex;
                flex-direction: column;
            }

            .auth-login input {
                margin-bottom: 1rem;
                padding: 0.5rem;
                border: 1px solid var(--primary-color, #111827);
                border-radius: 0.25rem;
                font-family: var(--main-font, sans-serif);
            }

            .auth-login button {
                padding: 0.5rem;
                background: var(--primary-color, #111827);
                color: #ffffff;
                border: none;
                border-radius: 0.25rem;
                cursor: pointer;
            }

            .auth-login button:hover {
                background: var(--primary-color-dark, #1f2937);
            }

            @keyframes auth-login-fade-in {
                from {
                    opacity: 0;
                    transform: translateY(-6px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @media (prefers-reduced-motion: reduce) {
                .auth-login,
                .auth-login--enter,
                .auth-login--leave {
                    transition: none;
                    animation: none;
                    transform: none;
                }
            }
        `;
        return style;
    }

    render() {
        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(this.getStyles());
        const container = document.createElement('div');
        container.classList.add('auth-login', 'auth-login--enter');
        
        let html = `<h2 class="login-title">${this._view === 'login' ? 'Login' : 'Password Recovery'}</h2>`;
        
        html += `
            ${this._view === 'login' ? `<form id="login-form">
                <input type="email" id="email" placeholder="Email" required />
                <input type="password" id="password" placeholder="Password" required />
                ${this.allowRecovery ? '<a class="login-link" href="#recovery" id="forgot-password">Forgot password?</a>' : ''}
                <button type="submit">Login</button>
            </form>` : `<form id="recovery-form">
                <input type="email" id="email" placeholder="Email" required />
                ${this.allowRecovery ? '<a class="login-link" href="#login" id="login-link">Login</a>' : ''}
                <button type="submit">Restore password</button>
            </form>`}
        `;
        container.innerHTML = html;
        this.shadowRoot.appendChild(container);
    }

    listeners() {
        const form = this.shadowRoot.querySelector('#login-form');
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (this._loading_form) return;
            this._loading_form = true;

            const email = this.shadowRoot.querySelector('#email').value;
            const password = this.shadowRoot.querySelector('#password').value;

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });

                if (!response.ok) {
                    throw new Error('Login failed');
                }

                const data = await response.json();
                console.log('Login successful:', data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                this._loading_form = false;
            }
        });
        const forgotPasswordLink = this.shadowRoot.querySelector('#forgot-password');
        if (forgotPasswordLink) {
            forgotPasswordLink.addEventListener('click', (event) => {
                event.preventDefault();
                this.toggleView('recovery');
            });
        }
        const loginLink = this.shadowRoot.querySelector('#login-link');
        if (loginLink) {
            loginLink.addEventListener('click', (event) => {
                event.preventDefault();
                this.toggleView('login');
            });
        }
    }

    skeleton() {
        const style = document.createElement('style');
        style.textContent = `
            .auth-login-skeleton {
                max-width: 400px;
                margin: 0 auto;
                padding: 1rem;
                background: var(--background-color, #ffffff);
                border-radius: 0.5rem;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            .auth-login-skeleton .skeleton-title {
                width: 50%;
                height: 1.5rem;
                background: var(--primary-color, #111827);
                border-radius: 0.25rem;
                margin-bottom: 1rem;
            }

            .auth-login-skeleton .skeleton-input {
                width: 100%;
                height: 2.5rem;
                background: var(--primary-color, #111827);
                border-radius: 0.25rem;
                margin-bottom: 1rem;
            }

            .auth-login-skeleton .skeleton-button {
                width: 100%;
                height: 2.5rem;
                background: var(--primary-color, #111827);
                border-radius: 0.25rem;
            }
        `;
        return style.outerHTML + `
        <div class="auth-login-skeleton">
            <div class="skeleton-title"></div>
            <div class="skeleton-input"></div>
            <div class="skeleton-input"></div>
            <div class="skeleton-button"></div>
        </div>`;
    }

    toggleView(view) {
        const currentContainer = this.shadowRoot.querySelector('.auth-login');

        if (currentContainer) {
            currentContainer.classList.remove('auth-login--enter');
            currentContainer.classList.add('auth-login--leave');
        }

        if (this._view === view) {
            return;
        }

        this._view = view;
        window.location.hash = view;

        const commitViewChange = () => {
            this.render();
            this.listeners();
        };

        if (currentContainer) {
            window.setTimeout(commitViewChange, 180);
            return;
        }

        commitViewChange();
    }
}

export default AuthLogin;