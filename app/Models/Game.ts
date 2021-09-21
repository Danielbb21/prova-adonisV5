import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Gamble from './Gamble';

export default class Game extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public type: string;

  @column()
  public description: string;

  @column()
  public range: number;

  @column()
  public price: number;

  @column({ columnName: 'max-number'})
  public maxNumber: number;

  @column()
  public color: string;

  @column({columnName: 'min-cart-value'})
  public minCartValue: number;

  @hasMany(() => Gamble, {
    foreignKey: 'user_id', // defaults to userId
  })

  public gambles: HasMany<typeof Gamble>


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
