import { JuztOrbit } from "../modules/juzt-orbit";

class AuthRegister extends HTMLElement 
{
    constructor()
    {
        super();
        this._loading = true;
        this.error = null;
        this._loading_form = false;
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback()
    {
        this._loading = false;
        this.render();
        this.listeners();
    }

    getStyles()
    {
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

            .auth-register {
                max-width: 400px;
                width: 100%;
                margin: 0 auto;
                padding: 1rem;
                background: var(--background-color, #ffffff);
                border-radius: 0.5rem;
            }

            .auth-register h2 {
                font-size: 1.5rem;
                font-weight: bold;
                margin-bottom: 1rem;
            }

            .auth-register form {
                display: flex;
                flex-direction: column;
            }

            .auth-register input {
                margin-bottom: 1rem;
                padding: 0.5rem;
                border: 1px solid var(--primary-color, #111827);
                border-radius: 0.25rem;
                font-family: var(--main-font, sans-serif);
            }

            .auth-register button {
                padding: 0.5rem;
                background: var(--primary-color, #111827);
                color: #ffffff;
                border: none;
                border-radius: 0.25rem;
                cursor: pointer;
            }

            .auth-register button:hover {
                background: var(--primary-color-dark, #1f2937);
            }

            /* Skeleton styles */
            .auth-register-skeleton {
                max-width: 400px;
                margin: 0 auto;
                padding: 1rem;
                background: var(--background-color, #ffffff);
                border-radius: 0.5rem;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            .skeleton-title {
                width: 50%;
                height: 1.5rem;
                background: var(--primary-color, #111827);
                margin-bottom: 1rem;
                border-radius: 0.25rem;
            }

            .skeleton-input {
                width: 100%;
                height: 2.5rem;
                background: var(--primary-color, #111827);
                margin-bottom: 1rem;
                border-radius: 0.25rem;
            }

            .skeleton-button {
                width: 100%;
                height: 2.5rem;
                background: var(--primary-color, #111827);
                border-radius: 0.25rem;
            }
        `;
        return style.outerHTML;
    }

    skeleton()
    {
        return `
        <div class="auth-register-skeleton">
            <div class="skeleton-title"></div>
            <div class="skeleton-input"></div>
            <div class="skeleton-input"></div>
            <div class="skeleton-input"></div>
            <div class="skeleton-button"></div>
        </div>`;
    }

    listeners(){
        this.shadowRoot.querySelector('#register-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            if(this._loading_form) return;
            this._loading_form = true;
            const formData = new FormData(this.shadowRoot.querySelector('#register-form'));
            const data = Object.fromEntries(formData.entries());
            try {
                const response = await fetch('/wp-json/juzt-orbit/v1/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
                const result = await response.json();
                if (response.ok) {
                    window.JuztOrbit.Notification.show('Registration successful! Please check your email to verify your account.', 'success');
                    this.shadowRoot.querySelector('#register-form').reset();
                } else {
                    window.JuztOrbit.Notification.show(result.message || 'Registration failed. Please try again.', 'error');
                }
            } catch (error) {
                window.JuztOrbit.Notification.show('An error occurred. Please try again later.', 'error');
            } finally {
                this._loading_form = false;
            }
        });
    }

    form()
    {
        return `
        <div class="auth-register">
            <h2>Register</h2>
            <form name="register_form" id="register-form">
                <input type="text" name="username" placeholder="Username" required>
                <input type="email" name="email" placeholder="Email" required>
                <input type="password" name="password" placeholder="Password" required>
                <button type="submit">Register</button>
            </form>
        </div>`;
    }

    render()
    {
        let response = this.getStyles();
        response += this._loading ? this.skeleton() : this.form();
        this.shadowRoot.innerHTML = response; 
    }
}

export default AuthRegister;