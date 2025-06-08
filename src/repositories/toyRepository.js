const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ToyRepository {
    async findAll() {
        return prisma.toy.findMany();
    }

    async findById(id) {
        return prisma.toy.findUnique({
            where: { id: parseInt(id) }
        });
    }

    async create(data) {
        return prisma.toy.create({
            data
        });
    }

    async update(id, data) {
        return prisma.toy.update({
            where: { id: parseInt(id) },
            data
        });
    }

    async delete(id) {
        return prisma.toy.delete({
            where: { id: parseInt(id) }
        });
    }
}

module.exports = new ToyRepository(); 