import request from 'supertest';
import {
  Connection,
  createConnection,
} from 'typeorm';

import { app } from '../../../../app';

let connection: Connection
let tokenA: string
let tokenB: string
let tokenC: string

beforeAll(async () => {
  connection = await createConnection()
  await connection.runMigrations()

  await request(app).post('/api/v1/users').send({
    name: 'Test',
    email: 'test12345A@test.com',
    password: 'Qwe12345'
  })

  const responseA = await request(app).post('/api/v1/sessions').send({
    email: 'test12345A@test.com',
    password: 'Qwe12345'
  })

  tokenA = responseA.body.token

  await request(app).post('/api/v1/users').send({
    name: 'Test',
    email: 'test12345B@test.com',
    password: 'Qwe12345'
  })

  const responseB = await request(app).post('/api/v1/sessions').send({
    email: 'test12345B@test.com',
    password: 'Qwe12345'
  })

  tokenB = responseB.body.token

  await request(app).post('/api/v1/users').send({
    name: 'Test',
    email: 'test12345C@test.com',
    password: 'Qwe12345'
  })

  const responseC = await request(app).post('/api/v1/sessions').send({
    email: 'test12345C@test.com',
    password: 'Qwe12345'
  })

  tokenC = responseC.body.token
})

afterAll(async () => {
  await connection.dropDatabase()
  await connection.close()
})

describe('Statement tests', () => {
  test('Create deposit', async () => {

    const depositResponse = await request(app).post('/api/v1/statements/deposit')
      .set({
        Authorization: `Bearer ${tokenA}`
      })
      .send({
        amount: 1,
        description: 'Desc deposit 1'
      })

    expect(depositResponse.statusCode).toBe(201)

    const response = await request(app).get('/api/v1/statements/balance')
      .set({
        Authorization: `Bearer ${tokenA}`
      })
      .send()

    expect(response.body.statement.length).toEqual(1)
    expect(response.body.statement[0].amount).toBe(1)
    expect(response.body.statement[0].description).toBe('Desc deposit 1')
  })

  test('Create deposit and withdraw', async () => {

    const depositResponse = await request(app).post('/api/v1/statements/deposit')
      .set({
        Authorization: `Bearer ${tokenB}`
      })
      .send({
        amount: 1,
        description: 'Desc deposit 1'
      })

    expect(depositResponse.statusCode).toBe(201)

    const responseBalance1 = await request(app).get('/api/v1/statements/balance')
      .set({
        Authorization: `Bearer ${tokenB}`
      })
      .send()

    expect(responseBalance1.body.statement.length).toEqual(1)
    expect(responseBalance1.body.statement[0].amount).toBe(1)
    expect(responseBalance1.body.statement[0].description).toBe('Desc deposit 1')

    const withdrawtResponse = await request(app).post('/api/v1/statements/withdraw')
      .set({
        Authorization: `Bearer ${tokenB}`
      })
      .send({
        amount: 1,
        description: 'Desc withdraw 1'
      })

    expect(withdrawtResponse.statusCode).toBe(201)

    const responseBalance2 = await request(app).get('/api/v1/statements/balance')
      .set({
        Authorization: `Bearer ${tokenB}`
      })
      .send()

    expect(responseBalance2.body.statement.length).toEqual(2)
    expect(responseBalance2.body.statement[1].amount).toBe(1)
    expect(responseBalance2.body.statement[1].description).toBe('Desc withdraw 1')
  })

  test('Throws error on withdraw when balance is invalid', async () => {

    const withdrawtResponse = await request(app).post('/api/v1/statements/withdraw')
      .set({
        Authorization: `Bearer ${tokenC}`
      })
      .send({
        amount: 1,
        description: 'Desc withdraw 1'
      })

    expect(withdrawtResponse.statusCode).toBe(400)
    expect(withdrawtResponse.body.message).toBe('Insufficient funds')

  })

}) 