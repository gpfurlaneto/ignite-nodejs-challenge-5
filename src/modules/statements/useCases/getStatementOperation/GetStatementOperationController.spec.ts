import request from 'supertest';
import {
  Connection,
  createConnection,
} from 'typeorm';

import { app } from '../../../../app';

let connection: Connection
let token: string

beforeAll(async () => {
  connection = await createConnection()
  await connection.runMigrations()

  await request(app).post('/api/v1/users').send({
    name: 'Test',
    email: 'test12345A@test.com',
    password: 'Qwe12345'
  })

  const response = await request(app).post('/api/v1/sessions').send({
    email: 'test12345A@test.com',
    password: 'Qwe12345'
  })

  token = response.body.token

})

afterAll(async () => {
  await connection.dropDatabase()
  await connection.close()
})

describe('Fetch Statement tests', () => {
  test('Fetch statement by id', async () => {

    const depositResponse = await request(app).post('/api/v1/statements/deposit')
      .set({
        Authorization: `Bearer ${token}`
      })
      .send({
        amount: 2,
        description: 'Desc deposit 1'
      })

    expect(depositResponse.statusCode).toBe(201)

    const withdrawResponse = await request(app).post('/api/v1/statements/withdraw')
      .set({
        Authorization: `Bearer ${token}`
      })
      .send({
        amount: 1,
        description: 'Desc withdraw 1'
      })

    expect(depositResponse.statusCode).toBe(201)

    const responseGetDeposit = await request(app).get(`/api/v1/statements/${depositResponse.body.id}`)
      .set({
        Authorization: `Bearer ${token}`
      })
      .send()

    const responseGetWithdraw = await request(app).get(`/api/v1/statements/${withdrawResponse.body.id}`)
      .set({
        Authorization: `Bearer ${token}`
      })
      .send()

    expect(responseGetDeposit.body.amount).toEqual("2.00")
    expect(responseGetDeposit.body.description).toBe('Desc deposit 1')

    expect(responseGetWithdraw.body.amount).toEqual("1.00")
    expect(responseGetWithdraw.body.description).toBe('Desc withdraw 1')
  })

}) 