import  User  from 'App/Models/User';
import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'

export default class Gamble extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public gameNumbers: string;


  @column()
  public price: number;

  @column()
  public game_date: Date;

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
