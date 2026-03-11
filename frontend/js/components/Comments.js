class Comments extends HTMLElement {
    static get observedAttributes() {
        return ['post-id', 'user-id'];
    }

    async attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'post-id' && oldValue !== newValue) {
            this.form.post_id = newValue;
            if (this.isConnected) {
                this.render();
            }
        } else if (name === 'user-id' && oldValue !== newValue) {
            this.form.user_id = newValue;
            if (this.isConnected) {
                await this.getUser(newValue);
            }
        }
    }

    constructor() {
        super();
        this.apiBase = '/wp-json/juzt-orbit/v1';
        this.comments = [];
        this.current = null;
        this._loading = true;
        this.user = null;
        this.form = {
            post_id: null,
            comment: {
                parent: null,
                content: null,
                author_name: null,
                author_email: null,
            }
        };
        this.attachShadow({ mode: 'open' });
        this.onSubmit = this.onSubmit.bind(this);
        this.onClick = this.onClick.bind(this);

        this.addEventListener('comment-submit', (event) => {
            this.submitComment(event.detail);
        });
    }

    async connectedCallback() {
        this.shadowRoot.addEventListener('submit', this.onSubmit);
        this.shadowRoot.addEventListener('click', this.onClick);

        if (!this.form.post_id) {
            this.form.post_id = this.getAttribute('post-id');
        }

        await this.getComments();
        // await this.getUser(this.form.user_id);
        this._loading = false;
        this.render();
    }

    disconnectedCallback() {
        this.shadowRoot.removeEventListener('submit', this.onSubmit);
        this.shadowRoot.removeEventListener('click', this.onClick);
    }

    escapeHtml(value) {
        const content = value ?? '';
        return String(content)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    sanitizeHtml(value) {
        const content = String(value ?? '');
        const template = document.createElement('template');
        template.innerHTML = content;

        template.content.querySelectorAll('script, iframe, object, embed, link, meta').forEach((node) => {
            node.remove();
        });

        template.content.querySelectorAll('*').forEach((element) => {
            [...element.attributes].forEach((attr) => {
                const attrName = attr.name.toLowerCase();
                const attrValue = attr.value.toLowerCase();

                if (attrName.startsWith('on')) {
                    element.removeAttribute(attr.name);
                    return;
                }

                if ((attrName === 'href' || attrName === 'src') && attrValue.startsWith('javascript:')) {
                    element.removeAttribute(attr.name);
                }
            });
        });

        return template.innerHTML;
    }

    onSubmit(event) {
        const form = event.target;
        if (!form || form.id !== 'comment-form') {
            return;
        }

        event.preventDefault();

        const formData = new FormData(form);
        const payload = {
            post_id: formData.get('post_id'),
            comment: {
                parent: formData.get('parent') || null,
                content: formData.get('content') || null,
                author_name: formData.get('author_name') || null,
                author_email: formData.get('author_email') || null,
            }
        };

        this.form = payload;

        this.dispatchEvent(new CustomEvent('comment-submit', {
            bubbles: true,
            composed: true,
            detail: payload,
        }));

        this.form.comment.content = null;

        if (this.current) {
            this.current = null;
            this.form.comment.parent = null;
            this.render();
        }
    }

    onClick(event) {
        const cancelButton = event.target.closest('.cancel-reply-button');
        if (cancelButton) {
            this.current = null;
            this.form.comment.parent = null;
            this.form.comment.content = null;
            this.render();
            return;
        }

        const button = event.target.closest('.reply-button');
        if (!button) {
            return;
        }

        const commentId = button.dataset.commentId || null;
        this.form.comment.parent = commentId;
        this.current = commentId;
        this.render();

        this.dispatchEvent(new CustomEvent('comment-reply', {
            bubbles: true,
            composed: true,
            detail: { parent: commentId },
        }));
    }

    getStyles() {
        return `
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
        `;
    }

    renderForm(postId, parent, mode = 'main') {
        const isReply = mode === 'reply';
        const submitLabel = isReply ? 'Responder' : 'Submit Comment';
        const replying = parent
            ? `<p class="replying">Replying to comment #${parent}</p>`
            : '';

        const actions = isReply
            ? `
                <div class="form-actions">
                    <button type="submit">${submitLabel}</button>
                    <button type="button" class="cancel-reply-button">Cancelar</button>
                </div>
            `
            : `<button type="submit">${submitLabel}</button>`;

        return `
            <form id="comment-form" class="comment-form">
                <input type="hidden" name="post_id" value="${postId}">
                <input type="hidden" name="parent" value="${parent}">
                ${replying}
                <div>
                    <input placeholder="Name" type="text" id="author_name" name="author_name" value="${this.escapeHtml(this.form.comment.author_name)}" required>
                </div>
                <div>
                    <input placeholder="Email" type="email" id="author_email" name="author_email" value="${this.escapeHtml(this.form.comment.author_email)}" required>
                </div>
                <div>
                    <textarea placeholder="Comment" id="content" name="content" required>${this.escapeHtml(this.form.comment.content)}</textarea>
                </div>
                ${actions}
            </form>
        `;
    }

    renderCommentItem(comment, postId) {
        const commentId = this.escapeHtml(comment?.comment_ID);
        const children = Array.isArray(comment?.children) ? comment.children : [];

        return `
            <article data-comment-id="${commentId}" id="comment-${commentId}" class="comment">
                <p class="comment-meta">
                    <strong>${this.escapeHtml(comment?.comment_author)}</strong>
                    (${this.escapeHtml(comment?.comment_author_email)})
                </p>
                <div class="comment-content">${this.sanitizeHtml(comment?.comment_content)}</div>
                <button data-comment-id="${commentId}" class="reply-button" type="button">Reply</button>
                ${String(this.current) === String(comment?.comment_ID)
                    ? `<div class="inline-reply">${this.renderForm(postId, commentId, 'reply')}</div>`
                    : ''}
                ${children.length > 0
                    ? `<div class="comment-children">${children.map((child) => this.renderCommentItem(child, postId)).join('')}</div>`
                    : ''}
            </article>
        `;
    }

    renderComments() {
        const postId = this.escapeHtml(this.form.post_id);
        const comments = Array.isArray(this.comments) ? this.comments : [];

        return `
            <div id="comments-list" class="comment-list">
                ${comments.map((comment) => this.renderCommentItem(comment, postId)).join('')}
            </div>
        `;
    }

    template() {
        const postId = this.escapeHtml(this.form.post_id);
        const parent = this.escapeHtml(this.form.comment.parent);

        return `
            <style>${this.getStyles()}</style>
            <section class="comments">
                ${this.current ? '' : this.renderForm(postId, parent, 'main')}
                ${this.renderComments()}
            </section>
        `;
    }

    skeleton(){
        // Placeholder content while loading
        return `
            <style>${this.getStyles()}</style>
            <section class="comments">
                <div class="comment-form">
                    <div style="background: #e5e7eb; height: 1.5rem; width: 50%; margin-bottom: 0.75rem;"></div>
                    <div style="background: #e5e7eb; height: 1.5rem; width: 70%; margin-bottom: 0.75rem;"></div>
                    <div style="background: #e5e7eb; height: 4rem; width: 100%; margin-bottom: 0.75rem;"></div>
                    <div style="background: #e5e7eb; height: 2.5rem; width: 30%;"></div>
                </div>
                <div id="comments-list" class="comment-list">
                    ${[1,2,3].map(() => `
                        <article class="comment">
                            <div style="background: #e5e7eb; height: 1.5rem; width: 40%; margin-bottom: 0.35rem;"></div>
                            <div style="background: #e5e7eb; height: 3rem; width: 100%; margin-bottom: 0.75rem;"></div>
                            <div style="background: #e5e7eb; height: 2.5rem; width: 20%;"></div>
                        </article>
                    `).join('')}
                </div>
            </section>
        `;
    }

    async getComments(force = false) {
        if (!this.form.post_id) {
            return;
        }

        try {
            const cacheBuster = force ? `?t=${Date.now()}` : '';
            const response = await fetch(`${this.apiBase}/comments/${this.form.post_id}${cacheBuster}`, {
                method: 'GET',
                cache: 'no-store',
            });

            if (!response.ok) {
                throw new Error(`Error fetching comments: ${response.statusText}`);
            }

            this.comments = await response.json();
            this.render();
        } catch (error) {
            console.error(error);
        }
    }

    async getUser(userId) {
        try {
            if(userId === null || userId === undefined || userId === '0') return;

            const response = await fetch(`${this.apiBase}/user/${userId}`);
            if (!response.ok) {
                throw new Error(`Error fetching user: ${response.statusText}`);
            }
            this.user = await response.json();
            this.form.comment.author_name = this.user.display_name;
            this.form.comment.author_email = this.user.user_email;
            console.log('User data:', this.user);
            this.render();
        } catch (error) {
            console.error(error);
        }
    }

    async submitComment(commentData) {
        try {
            const response = await fetch(`${this.apiBase}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(commentData),
            });

            if (!response.ok) {
                throw new Error(`Error submitting comment: ${response.statusText}`);
            }

            const newComment = await response.json();
            if (!newComment?.success) {
                throw new Error(newComment?.message || 'Failed to submit comment.');
            }

            await this.getComments(true);
            this.form.comment.content = null;
            this.form.comment.parent = null;
            this.form.comment.author_email = this.form.comment.author_email ?? '';
            this.form.comment.author_name = this.form.comment.author_name ?? '';
            this.current = null;
            this.render();
        } catch (error) {
            console.error(error);
        }
    }

    render() {
        if (this._loading) {
            this.shadowRoot.innerHTML = this.skeleton();
        } else {
            this.shadowRoot.innerHTML = this.template();
        }
    }
}

export default Comments;