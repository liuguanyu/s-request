import Vue from 'vue';
import App from './app.vue';

import SRequest from '../src/s-request.vue';

Vue.use(SRequest, {
    headers: {
        src: "s-request"
    }
});

new Vue({
    el: "#app",
    template: '<App />',
    components: {
        App
    }
});