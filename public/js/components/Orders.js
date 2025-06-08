export class Orders extends HTMLElement {
    constructor() {
        super();
        this.orders = [];
    }

    connectedCallback() {
        this.loadOrders();
    }

    async loadOrders() {
        try {
            const response = await fetch('/my-orders', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            this.orders = await response.json();
            this.render();
        } catch (error) {
            console.error('Ошибка загрузки заказов:', error);
        }
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleString();
    }

    getStatusBadgeClass(status) {
        const statusClasses = {
            'PENDING': 'bg-warning',
            'PROCESSING': 'bg-info',
            'SHIPPED': 'bg-primary',
            'DELIVERED': 'bg-success',
            'CANCELLED': 'bg-danger'
        };
        return statusClasses[status] || 'bg-secondary';
    }

    render() {
        this.innerHTML = `
            <div class="container mt-4">
                <h2>Мои заказы</h2>
                ${this.orders.length === 0 ? '<p>У вас пока нет заказов</p>' : `
                    <div class="row">
                        ${this.orders.map(order => `
                            <div class="col-12 mb-4">
                                <div class="card">
                                    <div class="card-header d-flex justify-content-between align-items-center">
                                        <span>Заказ #${order.id}</span>
                                        <span class="badge ${this.getStatusBadgeClass(order.status)}">${order.status}</span>
                                    </div>
                                    <div class="card-body">
                                        <div class="table-responsive">
                                            <table class="table table-sm">
                                                <thead>
                                                    <tr>
                                                        <th>Товар</th>
                                                        <th>Количество</th>
                                                        <th>Цена за шт.</th>
                                                        <th>Сумма</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    ${order.items.map(item => `
                                                        <tr>
                                                            <td>${item.toy.name}</td>
                                                            <td>${item.quantity}</td>
                                                            <td>$${item.price}</td>
                                                            <td>$${(item.quantity * item.price).toFixed(2)}</td>
                                                        </tr>
                                                    `).join('')}
                                                </tbody>
                                                <tfoot>
                                                    <tr>
                                                        <td colspan="3" class="text-end"><strong>Итого:</strong></td>
                                                        <td><strong>$${order.totalPrice.toFixed(2)}</strong></td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                        <div class="text-muted mt-2">
                                            <small>Создан: ${this.formatDate(order.createdAt)}</small>
                                            <br>
                                            <small>Обновлен: ${this.formatDate(order.updatedAt)}</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>
        `;
    }
}

customElements.define('app-orders', Orders); 