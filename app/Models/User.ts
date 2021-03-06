import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import Gamble from './Gamble';

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string;

  @column()
  public email: string;

  @column({serializeAs: null})
  public password: string;

  @column({columnName: 'isAdmin'})
  public isAdmin: boolean;

  @column()
  token: string;

  @column()
  token_created_at: Date | null;

  @column()
  last_game_date: Date;

  @hasMany(() => Gamble, {
    foreignKey: 'user_id', // defaults to userId
  })

  public gambles: HasMany<typeof Gamble>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User){
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
