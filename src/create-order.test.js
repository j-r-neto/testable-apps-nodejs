import { test, mock } from 'node:test'
import assert from 'node:assert'

import { createOrder } from './create-order.js'
import { transport } from './mail/transport.js'
import { InMemoryOrdersRepository } from './test/in-memory-orders-repository.js'

mock.method(transport, 'sendMail', () => {
  console.log('Enviou e-mail')
})

test('create new order', async () => {
  const ordersRepository = new InMemoryOrdersRepository()

  const order = await createOrder({
    customerId: 'customer-fake-id',
    amount: 1000,
  }, ordersRepository)

  assert.ok(order.id)
  assert.equal(ordersRepository.items[0].amount, 1000)
})

test('orders with amount higher than 3000 should me marked as priority', async () => {
  const ordersRepository = new InMemoryOrdersRepository()

  const order = await createOrder({
    customerId: 'fake-customer-id',
    amount: 5000,
  }, ordersRepository)

  assert.equal(order.priority, true)
})

test('an email should be sent after the order is created', async (t) => {
  const ordersRepository = new InMemoryOrdersRepository()

  t.mock.method(transport, 'sendMail')

  await createOrder({
    customerId: 'fake-customer-id',
    amount: 3000,
  }, ordersRepository)

  assert.equal(transport.sendMail.mock.calls.length, 1);
})