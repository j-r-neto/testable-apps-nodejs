import { randomUUID } from 'node:crypto'

export class InMemoryOrdersRepository {

    items = []

    async create(data){
        const { customerId, isPriority, amount } = data

        const order = {
            id: randomUUID(),
            customerId,
            priority: isPriority,
            amount,
        }

        this.items.push(order)

        return order
    }
}