import SRquest from './src/s-request';

if (typeof window !== 'undefined' && window.Vue) {
    const install = (Vue, opts = {}) => {
        Vue.component(SRquest.name, SRquest);

        let mixin = {
            created: () => {
                this.baseOpts = opts ? opts : {};
            }
        };

        Vue.mixin(mixin);
    }

    if (typeof window !== 'undefined' && window.Vue) {
        install(window.Vue, opts);
    }
}

export default SRquest;