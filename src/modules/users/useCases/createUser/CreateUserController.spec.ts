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
})

afterAll(async () => {
  await connection.dropDatabase()
  await connection.close()
})

describe('Users tests', () => {
  test('Create user and return 201', async () => {
    const response = await request(app).post('/api/v1/users').send({
      name: 'Test',
      email: 'test@test.com',
      password: 'Qwe12345'
    })

    expect(response.statusCode).toBe(201)
  })
})