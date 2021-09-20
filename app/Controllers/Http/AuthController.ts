import User from 'App/Models/User';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {

  public async create({ auth, request, response }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')
    try {
      const user = await User.findBy('email', email);
      const token = await auth.use('api').attempt(email, password, { name: user?.serialize().email,expiresIn: '1day' })
      return { user, token }
    } catch {
      return response.badRequest('Invalid credentials')
    }
  }
}
