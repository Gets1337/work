const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class UserRepository {
    async findAll() {
        return prisma.user.findMany({
            include: {
                customer: true
            }
        });
    }

    async findById(id) {
        return prisma.user.findUnique({
            where: { id: parseInt(id) },
            include: {
                customer: true
            }
        });
    }

    async update(id, data) {
        const { customer, ...userData } = data;
        return prisma.user.update({
            where: { id: parseInt(id) },
            data: {
                ...userData,
                customer: customer ? {
                    update: customer
                } : undefined
            },
            include: {
                customer: true
            }
        });
    }

    async delete(id) {
        return prisma.user.delete({
            where: { id: parseInt(id) }
        });
    }

    async updateRole(id, role) {
        return prisma.user.update({
            where: { id: parseInt(id) },
            data: { role }
        });
    }
}

module.exports = new UserRepository(); 