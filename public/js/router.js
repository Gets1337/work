import './components/Cart.js';
import './components/Orders.js';
import './components/Toys.js';
import './components/Navigation.js';
import './components/Login.js';
import './components/Register.js';

const routes = {
    '/': 'app-toys',
    '/login': 'app-login',
    '/register': 'app-register',
    '/admin/toys': 'app-admin-toys',
    '/admin/users': 'app-admin-users',
    '/admin/orders': 'app-admin-orders',
    '/cart': 'app-cart',
    '/orders': 'app-orders'
};

function router() {
    const path = window.location.hash.slice(1) || '/';
    const component = routes[path] || 'app-404';
    
    const app = document.querySelector('#app');
    const oldComponent = app.firstElementChild;
    if (oldComponent) {
        app.removeChild(oldComponent);
    }
    
    const newComponent = document.createElement(component);
    app.appendChild(newComponent);
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router); 