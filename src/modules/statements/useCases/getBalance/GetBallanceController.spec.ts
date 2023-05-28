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
    email: 'test12345@test.com',
    password: 'Qwe12345'
  })

  const response = await request(app).post('/api/v1/sessions').send({
    email: 'test12345@test.com',
    password: 'Qwe12345'
  })

  token = response.body.token
})

afterAll(async () => {
  await connection.dropDatabase()
  await connection.close()
})

describe('User Balance tests', () => {
  test('Fetch user balance', async () => {
    const response = await request(app).get('/api/v1/statements/balance')
      .set({
        Authorization: `Bearer ${token}`
      })
      .send()

    expect(response.body.statement.length).toEqual(0)
    expect(response.body.balance).toEqual(0)
  })

}) 