const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class OrderRepository {
    async findAll() {
        return prisma.order.findMany({
            include: {
                customer: true,
                items: {
                    include: {
                        toy: true
                    }
                }
            }
        });
    }

    async findById(id) {
        return prisma.order.findUnique({
            where: { id: parseInt(id) },
            include: {
                customer: true,
                items: {
                    include: {
                        toy: true
                    }
                }
            }
        });
    }

    async updateStatus(id, status) {
        return prisma.order.update({
            where: { id: parseInt(id) },
            data: { status },
            include: {
                customer: true,
                items: {
                    include: {
                        toy: true
                    }
                }
            }
        });
    }

    async delete(id) {
        return prisma.order.delete({
            where: { id: parseInt(id) }
        });
    }
}

module.exports = new OrderRepository(); 