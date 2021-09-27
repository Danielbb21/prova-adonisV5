import test from 'japa'
// import { JSDOM } from 'jsdom'
import supertest from 'supertest'
import User from 'App/Models/User'
import Database from '@ioc:Adonis/Lucid/Database'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Create User',  (group) => {

  group.beforeEach(async () => {

    await Database.beginGlobalTransaction()
  })

  group.afterEach(async () => {

    await Database.rollbackGlobalTransaction()

  })

  test('Should create a user', async (assert) => {
    const data = await supertest(BASE_URL).post('/users').send({
      name: 'Daniel',
      email: 'daniel@teste.com',
      password: '123456',
      password_confirmation: '123456',
      isAdmin: true
    });
    assert.equal(data.status, 201);

  })
  test('Should encrypt user password when create', async (assert) => {
    const user = new User()
    user.email = 'teste@teste.com'
    user.password = '123456'
    await user.save()

    assert.notEqual(user.password, '123456')
  })
  test('Should not return password in the route return', async (assert) => {
    const data = await supertest(BASE_URL).post('/users').send({
      name: 'Daniel',
      email: 'daniel1@teste.com',
      password: '123456',
      password_confirmation: '123456',
      isAdmin: true
    });
    const { body } = data;

    assert.notProperty(body, 'password');
  })

  test('Should not allow more than one user to have the same email address', async (assert) => {
    const data = await supertest(BASE_URL).post('/users').send({
      name: 'Daniel',
      email: 'daniel@teste.com',
      password: '123456',
      password_confirmation: '123456',
      isAdmin: true
    });

    assert.notEqual(data.status, 201);
  })

  test('Should not permite create user using a non valid Email', async (assert) => {
    const data = await supertest(BASE_URL).post('/users').send({
      name: 'Daniel',
      email: 'daniel',
      password: '123456',
      password_confirmation: '123456',
      isAdmin: true
    });

    assert.notEqual(data.status, 201);
  })
})
