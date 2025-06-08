export class Toys extends HTMLElement {
    constructor() {
        super();
        this.toys = [];
    }

    connectedCallback() {
        this.loadToys();
    }

    async loadToys() {
        try {
            const response = await fetch('/toys');
            this.toys = await response.json();
            this.render();
        } catch (error) {
            console.error('Ошибка загрузки товаров:', error);
        }
    }

    async addToCart(toyId) {
        if (!localStorage.getItem('token')) {
            window.location.hash = '#/login';
            return;
        }

        try {
            const response = await fetch('/cart/items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    toyId,
                    quantity: 1
                })
            });

            if (response.ok) {
                alert('Товар добавлен в корзину!');
            } else {
                const error = await response.json();
                alert(error.error || 'Ошибка добавления товара в корзину');
            }
        } catch (error) {
            console.error('Ошибка добавления в корзину:', error);
            alert('Ошибка добавления товара в корзину');
        }
    }

    render() {
        this.innerHTML = `
            <div class="container mt-4">
                <h2>Каталог игрушек</h2>
                <div class="row">
                    ${this.toys.map(toy => `
                        <div class="col-md-4 mb-4">
                            <div class="card h-100">
                                ${toy.image ? `
                                    <img src="${toy.image}" class="card-img-top" alt="${toy.name}">
                                ` : `
                                    <div class="card-img-top bg-light text-center py-4">
                                        <i class="bi bi-image" style="font-size: 4rem;"></i>
                                    </div>
                                `}
                                <div class="card-body">
                                    <h5 class="card-title">${toy.name}</h5>
                                    <p class="card-text">${toy.description || 'Описание отсутствует'}</p>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <span class="h5 mb-0">$${toy.price}</span>
                                        <div>
                                            <span class="badge bg-${toy.stock > 0 ? 'success' : 'danger'} me-2">
                                                ${toy.stock > 0 ? 'В наличии' : 'Нет в наличии'}
                                            </span>
                                            <button class="btn btn-primary btn-sm" 
                                                onclick="this.getRootNode().host.addToCart(${toy.id})"
                                                ${toy.stock === 0 ? 'disabled' : ''}>
                                                В корзину
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
}

customElements.define('app-toys', Toys); 