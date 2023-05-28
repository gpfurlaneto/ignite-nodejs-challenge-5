import request from 'supertest';
import {
  Connection,
  createConnection,
} from 'typeorm';

import { app } from '../../../../app';

let connection: Connection

beforeAll(async () => {
  connection = await createConnection()
  await connection.runMigrations()

  await request(app).post('/api/v1/users').send({
    name: 'Test',
    email: 'test123@test.com',
    password: 'Qwe12345'
  })
})

afterAll(async () => {
  await connection.dropDatabase()
  await connection.close()
})

describe('Session tests', () => {
  test('Authenticate user', async () => {
    const response = await request(app).post('/api/v1/sessions').send({
      email: 'test123@test.com',
      password: 'Qwe12345'
    })

    expect(response.body).toBeDefined()
    expect(response.body.user.email).toBe('test123@test.com')
    expect(response.body.token).toBeDefined()
  })

}) 