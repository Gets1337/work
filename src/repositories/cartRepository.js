const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class CartRepository {
    async getOrCreateCart(userId) {
        let cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        toy: true
                    }
                }
            }
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: {
                    userId
                },
                include: {
                    items: {
                        include: {
                            toy: true
                        }
                    }
                }
            });
        }

        return cart;
    }

    async addItem(userId, toyId, quantity) {
        const cart = await this.getOrCreateCart(userId);
        const existingItem = await prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                toyId
            }
        });

        if (existingItem) {
            return prisma.cartItem.update({
                where: { id: existingItem.id },
                data: {
                    quantity: existingItem.quantity + quantity
                },
                include: {
                    toy: true
                }
            });
        }

        return prisma.cartItem.create({
            data: {
                cartId: cart.id,
                toyId,
                quantity
            },
            include: {
                toy: true
            }
        });
    }

    async updateItemQuantity(cartItemId, quantity) {
        return prisma.cartItem.update({
            where: { id: parseInt(cartItemId) },
            data: { quantity },
            include: {
                toy: true
            }
        });
    }

    async removeItem(cartItemId) {
        return prisma.cartItem.delete({
            where: { id: parseInt(cartItemId) }
        });
    }

    async clearCart(userId) {
        const cart = await this.getOrCreateCart(userId);
        return prisma.cartItem.deleteMany({
            where: { cartId: cart.id }
        });
    }
}

module.exports = new CartRepository(); 