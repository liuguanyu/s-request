import Vue from 'vue';
import App from './app.vue';

import SRequest from '../src/s-request.vue';

import path from 'path';

Vue.use(SRequest);

new Vue({
    el: "#app",
    template: '<App />',
    components: {
        App
    }
});