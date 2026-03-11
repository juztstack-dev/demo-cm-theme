/* empty css     */const a="juzt-orbit\\:mobile-menu{position:fixed;top:0;right:-100%;width:100%;max-width:400px;height:100%;background-color:#000;display:flex;flex-direction:column;z-index:9999999;transition:right .5s ease-in-out}.mobile-menu-open{background:none;border:none;color:#fff;font-size:4rem;cursor:pointer}@media(min-width:768px){.mobile-menu-open{display:none}}@media(max-width:768px){.site-header-nav{display:none}}juzt-orbit\\:mobile-menu .overlay{position:fixed;inset:0;background:#00000080;z-index:1;opacity:0;pointer-events:none;transition:opacity .5s ease-in-out}juzt-orbit\\:mobile-menu.open .overlay{opacity:1;pointer-events:all}juzt-orbit\\:mobile-menu>div{position:relative;z-index:2;height:100%}juzt-orbit\\:mobile-menu.open{right:0}juzt-orbit\\:mobile-menu.open .overlay{opacity:1}juzt-orbit\\:mobile-menu .mobile-menu-nav{display:flex;flex-direction:column;align-items:flex-start;justify-content:center}juzt-orbit\\:mobile-menu .mobile-menu-nav ul{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;width:100%}juzt-orbit\\:mobile-menu .mobile-menu-nav ul li{border-bottom:1px solid #fff;padding:10px 30px;transition:all .3s ease}juzt-orbit\\:mobile-menu .mobile-menu-nav ul li:hover{background-color:#6132fb}juzt-orbit\\:mobile-menu .mobile-menu-nav li a{color:#fff;font-size:1.5rem;text-decoration:none}juzt-orbit\\:mobile-menu .mobile-menu-header{display:flex;justify-content:flex-end;padding:5px 20px;background-color:#6132fb}juzt-orbit\\:mobile-menu .mobile-menu-header .mobile-menu-close{background:none;border:none;color:#fff;font-size:4rem;cursor:pointer}";class c extends HTMLElement{constructor(){super(),this.boundHandleToggle=this.handleToggle.bind(this);const e="juzt-orbit-mobile-menu-styles";if(!document.getElementById(e)){const t=document.createElement("style");t.id=e,t.textContent=a,document.head.appendChild(t)}}connectedCallback(){document.addEventListener("juzt-orbit:toggle-menu",this.boundHandleToggle),this.handleEvents()}disconnectedCallback(){document.removeEventListener("juzt-orbit:toggle-menu",this.boundHandleToggle)}handleToggle(){this.classList.toggle("open")}handleEvents(){document.querySelectorAll("[data-event]").forEach(e=>{const t=e.getAttribute("data-event");e.addEventListener("click",()=>{document.dispatchEvent(new CustomEvent(t,{bubbles:!0,composed:!0}))})}),this.querySelector(".overlay").addEventListener("click",()=>{this.classList.remove("open")})}}class l extends HTMLElement{static get observedAttributes(){return["post-id","user-id"]}async attributeChangedCallback(e,t,o){e==="post-id"&&t!==o?(this.form.post_id=o,this.isConnected&&this.render()):e==="user-id"&&t!==o&&(this.form.user_id=o,this.isConnected&&await this.getUser(o))}constructor(){super(),this.apiBase="/wp-json/juzt-orbit/v1",this.comments=[],this.current=null,this._loading=!0,this.user=null,this.form={post_id:null,comment:{parent:null,content:null,author_name:null,author_email:null}},this.attachShadow({mode:"open"}),this.onSubmit=this.onSubmit.bind(this),this.onClick=this.onClick.bind(this),this.addEventListener("comment-submit",e=>{this.submitComment(e.detail)})}async connectedCallback(){this.shadowRoot.addEventListener("submit",this.onSubmit),this.shadowRoot.addEventListener("click",this.onClick),this.form.post_id||(this.form.post_id=this.getAttribute("post-id")),await this.getComments(),this._loading=!1,this.render()}disconnectedCallback(){this.shadowRoot.removeEventListener("submit",this.onSubmit),this.shadowRoot.removeEventListener("click",this.onClick)}escapeHtml(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}sanitizeHtml(e){const t=String(e??""),o=document.createElement("template");return o.innerHTML=t,o.content.querySelectorAll("script, iframe, object, embed, link, meta").forEach(n=>{n.remove()}),o.content.querySelectorAll("*").forEach(n=>{[...n.attributes].forEach(i=>{const r=i.name.toLowerCase(),s=i.value.toLowerCase();if(r.startsWith("on")){n.removeAttribute(i.name);return}(r==="href"||r==="src")&&s.startsWith("javascript:")&&n.removeAttribute(i.name)})}),o.innerHTML}onSubmit(e){const t=e.target;if(!t||t.id!=="comment-form")return;e.preventDefault();const o=new FormData(t),n={post_id:o.get("post_id"),comment:{parent:o.get("parent")||null,content:o.get("content")||null,author_name:o.get("author_name")||null,author_email:o.get("author_email")||null}};this.form=n,this.dispatchEvent(new CustomEvent("comment-submit",{bubbles:!0,composed:!0,detail:n})),this.form.comment.content=null,this.current&&(this.current=null,this.form.comment.parent=null,this.render())}onClick(e){if(e.target.closest(".cancel-reply-button")){this.current=null,this.form.comment.parent=null,this.form.comment.content=null,this.render();return}const o=e.target.closest(".reply-button");if(!o)return;const n=o.dataset.commentId||null;this.form.comment.parent=n,this.current=n,this.render(),this.dispatchEvent(new CustomEvent("comment-reply",{bubbles:!0,composed:!0,detail:{parent:n}}))}getStyles(){return`
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
        `}renderForm(e,t,o="main"){const n=o==="reply",i=n?"Responder":"Submit Comment",r=t?`<p class="replying">Replying to comment #${t}</p>`:"",s=n?`
                <div class="form-actions">
                    <button type="submit">${i}</button>
                    <button type="button" class="cancel-reply-button">Cancelar</button>
                </div>
            `:`<button type="submit">${i}</button>`;return`
            <form id="comment-form" class="comment-form">
                <input type="hidden" name="post_id" value="${e}">
                <input type="hidden" name="parent" value="${t}">
                ${r}
                <div>
                    <input placeholder="Name" type="text" id="author_name" name="author_name" value="${this.escapeHtml(this.form.comment.author_name)}" required>
                </div>
                <div>
                    <input placeholder="Email" type="email" id="author_email" name="author_email" value="${this.escapeHtml(this.form.comment.author_email)}" required>
                </div>
                <div>
                    <textarea placeholder="Comment" id="content" name="content" required>${this.escapeHtml(this.form.comment.content)}</textarea>
                </div>
                ${s}
            </form>
        `}renderCommentItem(e,t){const o=this.escapeHtml(e?.comment_ID),n=Array.isArray(e?.children)?e.children:[];return`
            <article data-comment-id="${o}" id="comment-${o}" class="comment">
                <p class="comment-meta">
                    <strong>${this.escapeHtml(e?.comment_author)}</strong>
                    (${this.escapeHtml(e?.comment_author_email)})
                </p>
                <div class="comment-content">${this.sanitizeHtml(e?.comment_content)}</div>
                <button data-comment-id="${o}" class="reply-button" type="button">Reply</button>
                ${String(this.current)===String(e?.comment_ID)?`<div class="inline-reply">${this.renderForm(t,o,"reply")}</div>`:""}
                ${n.length>0?`<div class="comment-children">${n.map(i=>this.renderCommentItem(i,t)).join("")}</div>`:""}
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
        `}async getComments(e=!1){if(this.form.post_id)try{const t=e?`?t=${Date.now()}`:"",o=await fetch(`${this.apiBase}/comments/${this.form.post_id}${t}`,{method:"GET",cache:"no-store"});if(!o.ok)throw new Error(`Error fetching comments: ${o.statusText}`);this.comments=await o.json(),this.render()}catch(t){console.error(t)}}async getUser(e){try{if(e==null||e==="0")return;const t=await fetch(`${this.apiBase}/user/${e}`);if(!t.ok)throw new Error(`Error fetching user: ${t.statusText}`);this.user=await t.json(),this.form.comment.author_name=this.user.display_name,this.form.comment.author_email=this.user.user_email,console.log("User data:",this.user),this.render()}catch(t){console.error(t)}}async submitComment(e){try{const t=await fetch(`${this.apiBase}/comments`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!t.ok)throw new Error(`Error submitting comment: ${t.statusText}`);const o=await t.json();if(!o?.success)throw new Error(o?.message||"Failed to submit comment.");await this.getComments(!0),this.form.comment.content=null,this.form.comment.parent=null,this.form.comment.author_email=this.form.comment.author_email??"",this.form.comment.author_name=this.form.comment.author_name??"",this.current=null,this.render()}catch(t){console.error(t)}}render(){this._loading?this.shadowRoot.innerHTML=this.skeleton():this.shadowRoot.innerHTML=this.template()}}class d{static MobileMenu=void 0;static Comments=void 0;constructor(){}init(){console.log("Juzt Orbit module initialized."),window.customElements.define("juzt-orbit:mobile-menu",c),this.MobileMenu=window.customElements.get("juzt-orbit:mobile-menu"),window.customElements.define("juzt-orbit:comments",l),this.Comments=window.customElements.get("juzt-orbit:comments")}}document.addEventListener("DOMContentLoaded",()=>{window.JuztOrbit=new d,window.JuztOrbit.init()});
