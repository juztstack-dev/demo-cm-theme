import MobileMenu from "../components/MobileMenu";
import Comments   from "../components/Comments";

export class JuztOrbit {
    static MobileMenu = undefined;
    static Comments   = undefined;
    constructor() {
    }
    
    init() {
        console.log('Juzt Orbit module initialized.');
        
        window.customElements.define('juzt-orbit:mobile-menu', MobileMenu);
        this.MobileMenu = window.customElements.get('juzt-orbit:mobile-menu');

        window.customElements.define('juzt-orbit:comments', Comments);
        this.Comments = window.customElements.get('juzt-orbit:comments');
    }
}