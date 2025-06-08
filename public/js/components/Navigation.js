export class Navigation extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        window.addEventListener('storage', () => this.render());
    }

    isLoggedIn() {
        return !!localStorage.getItem('token');
    }

    isAdmin() {
        const role = localStorage.getItem('role');
        return role === 'ADMIN';
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.hash = '#/';
        this.render();
    }

    render() {
        this.innerHTML = `
            <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
                <div class="container">
                    <a class="navbar-brand" href="#/">Магазин игрушек</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav me-auto">
                            <li class="nav-item">
                                <a class="nav-link" href="#/">Каталог</a>
                            </li>
                            ${this.isLoggedIn() ? `
                                <li class="nav-item">
                                    <a class="nav-link" href="#/cart">
                                        <i class="bi bi-cart"></i> Корзина
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="#/orders">
                                        <i class="bi bi-box"></i> Мои заказы
                                    </a>
                                </li>
                            ` : ''}
                            ${this.isAdmin() ? `
                                <li class="nav-item dropdown">
                                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                                        Администрирование
                                    </a>
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" href="#/admin/toys">Управление товарами</a></li>
                                        <li><a class="dropdown-item" href="#/admin/users">Управление пользователями</a></li>
                                        <li><a class="dropdown-item" href="#/admin/orders">Управление заказами</a></li>
                                    </ul>
                                </li>
                            ` : ''}
                        </ul>
                        <ul class="navbar-nav">
                            ${this.isLoggedIn() ? `
                                <li class="nav-item">
                                    <a class="nav-link" href="#" onclick="this.getRootNode().host.logout()">
                                        <i class="bi bi-box-arrow-right"></i> Выход
                                    </a>
                                </li>
                            ` : `
                                <li class="nav-item">
                                    <a class="nav-link" href="#/login">
                                        <i class="bi bi-box-arrow-in-right"></i> Вход
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="#/register">
                                        <i class="bi bi-person-plus"></i> Регистрация
                                    </a>
                                </li>
                            `}
                        </ul>
                    </div>
                </div>
            </nav>
        `;
    }
}

customElements.define('app-navigation', Navigation); 