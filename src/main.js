import Vue from 'vue';
import App from './App.vue';
import store from './store';

import Loading from './components/Loading.vue';

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

require('./assets/styles/main.scss');

Vue.use(BootstrapVue);

Vue.use(IconsPlugin);

Vue.component('Loading', Loading);

Vue.filter('toCurrency', function (value) {
    if (typeof value !== "number") {
        return value;
    }
    var formatter = new Intl.NumberFormat('en-US', {
        maximumSignificantDigits: 3,
        style: 'currency',
        currency: 'USD'
    });
    return formatter.format(value);
});

Vue.config.productionTip = false;

new Vue({
    store,
    render: h => h(App)
}).$mount('#app');
