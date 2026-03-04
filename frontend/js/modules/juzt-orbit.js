import MobileMenu from "../components/MobileMenu";

export class JuztOrbit {
    static MobileMenu = undefined;
    constructor() {
    }
    
    init() {
        console.log('Juzt Orbit module initialized.');
        window.customElements.define('juzt-orbit:mobile-menu', MobileMenu);
        this.MobileMenu = window.customElements.get('juzt-orbit:mobile-menu');
    }
}