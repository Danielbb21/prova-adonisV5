import  User  from 'App/Models/User';
import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Game from 'App/Models/Game';

export default class Gamble extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({columnName: 'gameNumbers'})
  public gameNumbers: string;


  @column()
  public price: number;

  @column()
  public game_date: Date;

  @belongsTo(() => Game, {
    localKey: 'game_id'
  })
  public game: BelongsTo<typeof Game>

  @belongsTo(() => User, {
    localKey: 'user_id'
  })
  public user: BelongsTo<typeof User>

  @column()
  public user_id: number

  @column()
  public game_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
