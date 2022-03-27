import request from 'supertest'
import app from '../config/app'

describe('Content-Type Middleware', () => {
  test('Should default Content-Type to JSON', async () => {
    app.get('/test_cors_default', (req, res) => {
      res.send('')
    })

    await request(app)
      .get('/test_cors_default')
      .expect('content-type', /json/)
  })

  test('Should accept Content-Type override', async () => {
    app.get('/test_cors_override', (req, res) => {
      res.type('xml')
      res.send('')
    })

    await request(app)
      .get('/test_cors_override')
      .expect('content-type', /xml/)
  })
})