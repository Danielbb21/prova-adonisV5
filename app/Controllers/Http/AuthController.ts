import User from 'App/Models/User';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import LoginValidator from 'App/Validators/LoginValidator';

export default class AuthController {

  public async create({ auth, request, response }: HttpContextContract) {
    const email = request.input('email')
    await request.validate(LoginValidator);
    const password = request.input('password')
    try {
      const user = await User.findBy('email', email);
      const token = await auth.use('api').attempt(email, password, { name: user?.serialize().email, expiresIn: '1day' })
      return { user, token }
    } catch {
      return response.badRequest('Invalid credentials')
    }
  }
}
