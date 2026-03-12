/* empty css     */const m="juzt-orbit\\:mobile-menu{position:fixed;top:0;right:-100%;width:100%;max-width:400px;height:100%;background-color:#000;display:flex;flex-direction:column;z-index:9999999;transition:right .5s ease-in-out}.mobile-menu-open{background:none;border:none;color:#fff;font-size:4rem;cursor:pointer}@media(min-width:768px){.mobile-menu-open{display:none}}@media(max-width:768px){.site-header-nav{display:none}}juzt-orbit\\:mobile-menu .overlay{position:fixed;inset:0;background:#00000080;z-index:1;opacity:0;pointer-events:none;transition:opacity .5s ease-in-out}juzt-orbit\\:mobile-menu.open .overlay{opacity:1;pointer-events:all}juzt-orbit\\:mobile-menu>div{position:relative;z-index:2;height:100%}juzt-orbit\\:mobile-menu.open{right:0}juzt-orbit\\:mobile-menu.open .overlay{opacity:1}juzt-orbit\\:mobile-menu .mobile-menu-nav{display:flex;flex-direction:column;align-items:flex-start;justify-content:center}juzt-orbit\\:mobile-menu .mobile-menu-nav ul{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;width:100%}juzt-orbit\\:mobile-menu .mobile-menu-nav ul li{border-bottom:1px solid #fff;padding:10px 30px;transition:all .3s ease}juzt-orbit\\:mobile-menu .mobile-menu-nav ul li:hover{background-color:#6132fb}juzt-orbit\\:mobile-menu .mobile-menu-nav li a{color:#fff;font-size:1.5rem;text-decoration:none}juzt-orbit\\:mobile-menu .mobile-menu-header{display:flex;justify-content:flex-end;padding:5px 20px;background-color:#6132fb}juzt-orbit\\:mobile-menu .mobile-menu-header .mobile-menu-close{background:none;border:none;color:#fff;font-size:4rem;cursor:pointer}";class c extends HTMLElement{constructor(){super(),this.boundHandleToggle=this.handleToggle.bind(this);const e="juzt-orbit-mobile-menu-styles";if(!document.getElementById(e)){const t=document.createElement("style");t.id=e,t.textContent=m,document.head.appendChild(t)}}connectedCallback(){document.addEventListener("juzt-orbit:toggle-menu",this.boundHandleToggle),this.handleEvents()}disconnectedCallback(){document.removeEventListener("juzt-orbit:toggle-menu",this.boundHandleToggle)}handleToggle(){this.classList.toggle("open")}handleEvents(){document.querySelectorAll("[data-event]").forEach(e=>{const t=e.getAttribute("data-event");e.addEventListener("click",()=>{document.dispatchEvent(new CustomEvent(t,{bubbles:!0,composed:!0}))})}),this.querySelector(".overlay").addEventListener("click",()=>{this.classList.remove("open")})}}class d extends HTMLElement{static get observedAttributes(){return["post-id","user-id"]}async attributeChangedCallback(e,t,o){e==="post-id"&&t!==o?(this.form.post_id=o,this.isConnected&&this.render()):e==="user-id"&&t!==o&&(this.form.user_id=o,this.isConnected&&await this.getUser(o))}constructor(){super(),this.apiBase="/wp-json/juzt-orbit/v1",this.comments=[],this.current=null,this._loading=!0,this.user=null,this.form={post_id:null,comment:{parent:null,content:null,author_name:null,author_email:null}},this.attachShadow({mode:"open"}),this.onSubmit=this.onSubmit.bind(this),this.onClick=this.onClick.bind(this),this.addEventListener("comment-submit",e=>{this.submitComment(e.detail)})}async connectedCallback(){this.shadowRoot.addEventListener("submit",this.onSubmit),this.shadowRoot.addEventListener("click",this.onClick),this.form.post_id||(this.form.post_id=this.getAttribute("post-id")),await this.getComments(),this._loading=!1,this.render()}disconnectedCallback(){this.shadowRoot.removeEventListener("submit",this.onSubmit),this.shadowRoot.removeEventListener("click",this.onClick)}escapeHtml(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}sanitizeHtml(e){const t=String(e??""),o=document.createElement("template");return o.innerHTML=t,o.content.querySelectorAll("script, iframe, object, embed, link, meta").forEach(r=>{r.remove()}),o.content.querySelectorAll("*").forEach(r=>{[...r.attributes].forEach(i=>{const s=i.name.toLowerCase(),n=i.value.toLowerCase();if(s.startsWith("on")){r.removeAttribute(i.name);return}(s==="href"||s==="src")&&n.startsWith("javascript:")&&r.removeAttribute(i.name)})}),o.innerHTML}onSubmit(e){const t=e.target;if(!t||t.id!=="comment-form")return;e.preventDefault();const o=new FormData(t),r={post_id:o.get("post_id"),comment:{parent:o.get("parent")||null,content:o.get("content")||null,author_name:o.get("author_name")||null,author_email:o.get("author_email")||null}};this.form=r,this.dispatchEvent(new CustomEvent("comment-submit",{bubbles:!0,composed:!0,detail:r})),this.form.comment.content=null,this.current&&(this.current=null,this.form.comment.parent=null,this.render())}onClick(e){if(e.target.closest(".cancel-reply-button")){this.current=null,this.form.comment.parent=null,this.form.comment.content=null,this.render();return}const o=e.target.closest(".reply-button");if(!o)return;const r=o.dataset.commentId||null;this.form.comment.parent=r,this.current=r,this.render(),this.dispatchEvent(new CustomEvent("comment-reply",{bubbles:!0,composed:!0,detail:{parent:r}}))}getStyles(){return`
            :host {
                display: block;
                font-family: inherit;
                color: #1f2937;
                min-height: 300px;
            }

            .comments {
                display: grid;
                gap: 1rem;
            }

            .comment-form {
                display: grid;
                gap: 0.75rem;
                padding: 1rem;
                border: 1px solid #e5e7eb;
                border-radius: 0.75rem;
                background: #ffffff;
            }

            .comment-form input,
            .comment-form textarea {
                width: 100%;
                padding: 0.625rem 0.75rem;
                border: 1px solid #d1d5db;
                border-radius: 0.5rem;
                font: inherit;
                color: inherit;
                box-sizing: border-box;
            }

            .comment-form textarea {
                min-height: 110px;
                resize: vertical;
            }

            .comment-form button,
            .reply-button {
                border: 0;
                border-radius: 0.5rem;
                padding: 0.55rem 0.8rem;
                font: inherit;
                cursor: pointer;
            }

            .comment-form button {
                justify-self: start;
                background: var(--primary-color, #111827);
                color: #ffffff;
            }

            .comment-form button:hover {
                background: var(--primary-color-hover, #0f172a);
            }

            .comment-list {
                display: grid;
                gap: 0.75rem;
            }

            .comment {
                padding: 0.875rem;
                border: 1px solid #e5e7eb;
                border-radius: 0.75rem;
                background: #ffffff;
            }

            .comment-children {
                margin-top: 0.75rem;
                margin-left: 1rem;
                padding-left: 0.75rem;
                border-left: 1px solid #e5e7eb;
                display: grid;
                gap: 0.75rem;
            }

            .comment-meta {
                margin: 0 0 0.35rem;
                font-size: 0.9rem;
                color: #4b5563;
            }

            .comment-content {
                margin: 0 0 0.75rem;
                white-space: pre-wrap;
            }

            .reply-button {
                background: var(--secondary-color, #f3f4f6);
                color: var(--primary-color, #111827);
            }

            .reply-button:hover {
                background: var(--secondary-color-hover, #e5e7eb);
            }

            .form-actions {
                display: flex;
                gap: 0.5rem;
                align-items: center;
            }

            .cancel-reply-button {
                background: var(--secondary-color, #f3f4f6);
                color: var(--primary-color, #111827);
            }

            .cancel-reply-button:hover {
                background: var(--secondary-color-hover, #e5e7eb);
            }

            .inline-reply {
                margin-top: 0.75rem;
                border-top: 1px solid var(--secondary-color-hover, #e5e7eb);
                padding-top: 0.75rem;
            }

            .replying {
                font-size: 0.85rem;
                color: var(--secondary-color, #6b7280);
                margin: 0;
            }
        `}renderForm(e,t,o="main"){const r=o==="reply",i=r?"Responder":"Submit Comment",s=t?`<p class="replying">Replying to comment #${t}</p>`:"",n=r?`
                <div class="form-actions">
                    <button type="submit">${i}</button>
                    <button type="button" class="cancel-reply-button">Cancelar</button>
                </div>
            `:`<button type="submit">${i}</button>`;return`
            <form id="comment-form" class="comment-form">
                <input type="hidden" name="post_id" value="${e}">
                <input type="hidden" name="parent" value="${t}">
                ${s}
                <div>
                    <input placeholder="Name" type="text" id="author_name" name="author_name" value="${this.escapeHtml(this.form.comment.author_name)}" required>
                </div>
                <div>
                    <input placeholder="Email" type="email" id="author_email" name="author_email" value="${this.escapeHtml(this.form.comment.author_email)}" required>
                </div>
                <div>
                    <textarea placeholder="Comment" id="content" name="content" required>${this.escapeHtml(this.form.comment.content)}</textarea>
                </div>
                ${n}
            </form>
        `}renderCommentItem(e,t){const o=this.escapeHtml(e?.comment_ID),r=Array.isArray(e?.children)?e.children:[];return`
            <article data-comment-id="${o}" id="comment-${o}" class="comment">
                <p class="comment-meta">
                    <strong>${this.escapeHtml(e?.comment_author)}</strong>
                    (${this.escapeHtml(e?.comment_author_email)})
                </p>
                <div class="comment-content">${this.sanitizeHtml(e?.comment_content)}</div>
                <button data-comment-id="${o}" class="reply-button" type="button">Reply</button>
                ${String(this.current)===String(e?.comment_ID)?`<div class="inline-reply">${this.renderForm(t,o,"reply")}</div>`:""}
                ${r.length>0?`<div class="comment-children">${r.map(i=>this.renderCommentItem(i,t)).join("")}</div>`:""}
            </article>
        `}renderComments(){const e=this.escapeHtml(this.form.post_id);return`
            <div id="comments-list" class="comment-list">
                ${(Array.isArray(this.comments)?this.comments:[]).map(o=>this.renderCommentItem(o,e)).join("")}
            </div>
        `}template(){const e=this.escapeHtml(this.form.post_id),t=this.escapeHtml(this.form.comment.parent);return`
            <style>${this.getStyles()}</style>
            <section class="comments">
                ${this.current?"":this.renderForm(e,t,"main")}
                ${this.renderComments()}
            </section>
        `}skeleton(){return`
            <style>${this.getStyles()}</style>
            <section class="comments">
                <div class="comment-form">
                    <div style="background: #e5e7eb; height: 1.5rem; width: 50%; margin-bottom: 0.75rem;"></div>
                    <div style="background: #e5e7eb; height: 1.5rem; width: 70%; margin-bottom: 0.75rem;"></div>
                    <div style="background: #e5e7eb; height: 4rem; width: 100%; margin-bottom: 0.75rem;"></div>
                    <div style="background: #e5e7eb; height: 2.5rem; width: 30%;"></div>
                </div>
                <div id="comments-list" class="comment-list">
                    ${[1,2,3].map(()=>`
                        <article class="comment">
                            <div style="background: #e5e7eb; height: 1.5rem; width: 40%; margin-bottom: 0.35rem;"></div>
                            <div style="background: #e5e7eb; height: 3rem; width: 100%; margin-bottom: 0.75rem;"></div>
                            <div style="background: #e5e7eb; height: 2.5rem; width: 20%;"></div>
                        </article>
                    `).join("")}
                </div>
            </section>
        `}async getComments(e=!1){if(this.form.post_id)try{const t=e?`?t=${Date.now()}`:"",o=await fetch(`${this.apiBase}/comments/${this.form.post_id}${t}`,{method:"GET",cache:"no-store"});if(!o.ok)throw new Error(`Error fetching comments: ${o.statusText}`);this.comments=await o.json(),this.render()}catch(t){console.error(t)}}async getUser(e){try{if(e==null||e==="0")return;const t=await fetch(`${this.apiBase}/user/${e}`);if(!t.ok)throw new Error(`Error fetching user: ${t.statusText}`);this.user=await t.json(),this.form.comment.author_name=this.user.display_name,this.form.comment.author_email=this.user.user_email,console.log("User data:",this.user),this.render()}catch(t){console.error(t)}}async submitComment(e){try{const t=await fetch(`${this.apiBase}/comments`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!t.ok)throw new Error(`Error submitting comment: ${t.statusText}`);const o=await t.json();if(!o?.success)throw new Error(o?.message||"Failed to submit comment.");await this.getComments(!0),this.form.comment.content=null,this.form.comment.parent=null,this.form.comment.author_email=this.form.comment.author_email??"",this.form.comment.author_name=this.form.comment.author_name??"",this.current=null,this.render()}catch(t){console.error(t)}}render(){this._loading?this.shadowRoot.innerHTML=this.skeleton():this.shadowRoot.innerHTML=this.template()}}class u extends HTMLElement{constructor(){super(),this._loading=!0,this.error=null,this._loading_form=!1,this.attachShadow({mode:"open"})}connectedCallback(){this._loading=!1,this.render(),this.listeners()}getStyles(){const e=document.createElement("style");return e.textContent=`
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
        `,e.outerHTML}skeleton(){return`
        <div class="auth-register-skeleton">
            <div class="skeleton-title"></div>
            <div class="skeleton-input"></div>
            <div class="skeleton-input"></div>
            <div class="skeleton-input"></div>
            <div class="skeleton-button"></div>
        </div>`}listeners(){this.shadowRoot.querySelector("#register-form").addEventListener("submit",async e=>{if(e.preventDefault(),this._loading_form)return;this._loading_form=!0;const t=new FormData(this.shadowRoot.querySelector("#register-form")),o=Object.fromEntries(t.entries());try{const r=await fetch("/wp-json/juzt-orbit/v1/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)}),i=await r.json();r.ok?(window.JuztOrbit.Notification.show("Registration successful! Please check your email to verify your account.","success"),this.shadowRoot.querySelector("#register-form").reset()):window.JuztOrbit.Notification.show(i.message||"Registration failed. Please try again.","error")}catch{window.JuztOrbit.Notification.show("An error occurred. Please try again later.","error")}finally{this._loading_form=!1}})}form(){return`
        <div class="auth-register">
            <h2>Register</h2>
            <form name="register_form" id="register-form">
                <input type="text" name="username" placeholder="Username" required>
                <input type="email" name="email" placeholder="Email" required>
                <input type="password" name="password" placeholder="Password" required>
                <button type="submit">Register</button>
            </form>
        </div>`}render(){let e=this.getStyles();e+=this._loading?this.skeleton():this.form(),this.shadowRoot.innerHTML=e}}class h extends HTMLElement{static get observedAttributes(){return["allow-recovery"]}async attributeChangedCallback(e,t,o){e==="allow-recovery"&&t!==o&&(this.allowRecovery=o==="1"||o==="true",console.log("x",this.allowRecovery),this.isConnected&&(this.render(),this.listeners()))}constructor(){super(),this._loading=!0,this._loading_form=!1,this._view="login",this.error=null,this.form={username:""},this.allowRecovery=!1,this.attachShadow({mode:"open"})}connectedCallback(){this._loading=!1,this.checkView(),this.render(),this.listeners()}checkView(){const e=window.location.hash.replace("#","");e==="login"||e==="register"||e==="recovery"?this._view=e:this._view="login",window.location.hash=this._view}getStyles(){const e=document.createElement("style");return e.textContent=`
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
        `,e}render(){this.shadowRoot.innerHTML="",this.shadowRoot.appendChild(this.getStyles());const e=document.createElement("div");e.classList.add("auth-login","auth-login--enter");let t=`<h2 class="login-title">${this._view==="login"?"Login":"Password Recovery"}</h2>`;t+=`
            ${this._view==="login"?`<form id="login-form">
                <input type="email" id="email" placeholder="Email" required />
                <input type="password" id="password" placeholder="Password" required />
                ${this.allowRecovery?'<a class="login-link" href="#recovery" id="forgot-password">Forgot password?</a>':""}
                <button type="submit">Login</button>
            </form>`:`<form id="recovery-form">
                <input type="email" id="email" placeholder="Email" required />
                ${this.allowRecovery?'<a class="login-link" href="#login" id="login-link">Login</a>':""}
                <button type="submit">Restore password</button>
            </form>`}
        `,e.innerHTML=t,this.shadowRoot.appendChild(e)}listeners(){this.shadowRoot.querySelector("#login-form")?.addEventListener("submit",async r=>{if(r.preventDefault(),this._loading_form)return;this._loading_form=!0;const i=this.shadowRoot.querySelector("#email").value,s=this.shadowRoot.querySelector("#password").value;try{const n=await fetch("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:i,password:s})});if(!n.ok)throw new Error("Login failed");const l=await n.json();console.log("Login successful:",l)}catch(n){console.error("Error:",n)}finally{this._loading_form=!1}});const t=this.shadowRoot.querySelector("#forgot-password");t&&t.addEventListener("click",r=>{r.preventDefault(),this.toggleView("recovery")});const o=this.shadowRoot.querySelector("#login-link");o&&o.addEventListener("click",r=>{r.preventDefault(),this.toggleView("login")})}skeleton(){const e=document.createElement("style");return e.textContent=`
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
        `,e.outerHTML+`
        <div class="auth-login-skeleton">
            <div class="skeleton-title"></div>
            <div class="skeleton-input"></div>
            <div class="skeleton-input"></div>
            <div class="skeleton-button"></div>
        </div>`}toggleView(e){const t=this.shadowRoot.querySelector(".auth-login");if(t&&(t.classList.remove("auth-login--enter"),t.classList.add("auth-login--leave")),this._view===e)return;this._view=e,window.location.hash=e;const o=()=>{this.render(),this.listeners()};if(t){window.setTimeout(o,180);return}o()}}class f{constructor(){this.message="",this.type="info",document.head.querySelector("#notification-styles")||document.head.appendChild(this.getStyles())}getStyles(){const e=document.createElement("style");return e.id="notification-styles",e.textContent=`
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
        `,e}show(e,t="info"){this.message=e,this.type=t,this.render(),setTimeout(()=>this.hide(),3e3)}hide(){const e=document.querySelector(".notification");e&&(e.classList.remove("show"),setTimeout(()=>{document&&(document.innerHTML="")},300))}render(){document.body.innerHTML+=`
            <div class="notification ${this.type} show">
                ${this.message}
            </div>
        `}}class p{static MobileMenu=void 0;static Comments=void 0;static Notification=void 0;static AuthLogin=void 0;constructor(){}init(){console.log("Juzt Orbit module initialized."),window.customElements.define("juzt-orbit:mobile-menu",c),this.MobileMenu=window.customElements.get("juzt-orbit:mobile-menu"),window.customElements.define("juzt-orbit:comments",d),this.Comments=window.customElements.get("juzt-orbit:comments"),window.customElements.define("juzt-orbit:auth-register",u),window.customElements.define("juzt-orbit:auth-login",h),this.AuthLogin=window.customElements.get("juzt-orbit:auth-login"),this.Notification=new f}}document.addEventListener("DOMContentLoaded",()=>{window.JuztOrbit=new p,window.JuztOrbit.init()});
