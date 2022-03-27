import request from 'supertest'
import app from '../config/app'

describe('Signup Routes', () => {
  test('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Valid Name',
        email: 'valid.email@email.com',
        password: 'valid_password',
        passwordConfirm: 'valid_password'
      })
      .expect(200)
  })
})