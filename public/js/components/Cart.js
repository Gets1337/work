export class Cart extends HTMLElement {
    constructor() {
        super();
        this.items = [];
    }

    connectedCallback() {
        this.loadCart();
    }

    async loadCart() {
        try {
            const response = await fetch('/cart', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const cart = await response.json();
            this.items = cart.items;
            this.render();
        } catch (error) {
            console.error('Ошибка загрузки корзины:', error);
        }
    }

    async updateQuantity(itemId, quantity) {
        try {
            await fetch(`/cart/items/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ quantity })
            });
            await this.loadCart();
        } catch (error) {
            console.error('Ошибка обновления количества:', error);
        }
    }

    async removeItem(itemId) {
        try {
            await fetch(`/cart/items/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            await this.loadCart();
        } catch (error) {
            console.error('Ошибка удаления товара:', error);
        }
    }

    async checkout() {
        try {
            const response = await fetch('/cart/checkout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (response.ok) {
                alert('Заказ успешно оформлен!');
                await this.loadCart();
                window.location.hash = '#/orders';
            } else {
                const error = await response.json();
                alert(error.error || 'Ошибка оформления заказа');
            }
        } catch (error) {
            console.error('Ошибка оформления заказа:', error);
            alert('Ошибка оформления заказа');
        }
    }

    render() {
        const totalPrice = this.items.reduce((sum, item) => sum + (item.quantity * item.toy.price), 0);

        this.innerHTML = `
            <div class="container mt-4">
                <h2>Корзина</h2>
                ${this.items.length === 0 ? '<p>Корзина пуста</p>' : `
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Товар</th>
                                    <th>Цена</th>
                                    <th>Количество</th>
                                    <th>Сумма</th>
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.items.map(item => `
                                    <tr>
                                        <td>${item.toy.name}</td>
                                        <td>$${item.toy.price}</td>
                                        <td>
                                            <input type="number" 
                                                min="1" 
                                                value="${item.quantity}"
                                                onchange="this.getRootNode().host.updateQuantity(${item.id}, this.value)"
                                                class="form-control" 
                                                style="width: 80px">
                                        </td>
                                        <td>$${(item.quantity * item.toy.price).toFixed(2)}</td>
                                        <td>
                                            <button class="btn btn-danger btn-sm" 
                                                onclick="this.getRootNode().host.removeItem(${item.id})">
                                                Удалить
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="3" class="text-end"><strong>Итого:</strong></td>
                                    <td colspan="2"><strong>$${totalPrice.toFixed(2)}</strong></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <div class="text-end mt-3">
                        <button class="btn btn-primary" onclick="this.getRootNode().host.checkout()">
                            Оформить заказ
                        </button>
                    </div>
                `}
            </div>
        `;
    }
}

customElements.define('app-cart', Cart); 