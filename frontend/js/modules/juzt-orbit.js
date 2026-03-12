import MobileMenu from "../components/MobileMenu";
import Comments   from "../components/Comments";
import AuthRegister from "../components/AuthRegister";
import AuthLogin from "../components/AuthLogin";
import Notification from "../utils/Notification";

export class JuztOrbit {
    static MobileMenu   = undefined;
    static Comments     = undefined;
    static Notification = undefined;
    static AuthLogin    = undefined;
    constructor() {
    }
    
    init() {
        console.log('Juzt Orbit module initialized.');
        
        window.customElements.define('juzt-orbit:mobile-menu', MobileMenu);
        this.MobileMenu = window.customElements.get('juzt-orbit:mobile-menu');

        window.customElements.define('juzt-orbit:comments', Comments);
        this.Comments = window.customElements.get('juzt-orbit:comments');
        
        window.customElements.define('juzt-orbit:auth-register', AuthRegister);
        window.customElements.define('juzt-orbit:auth-login', AuthLogin);
        
        this.AuthLogin = window.customElements.get('juzt-orbit:auth-login');
        this.Notification = new Notification();
    }
}