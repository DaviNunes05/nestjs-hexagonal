import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';

@Table({ tableName: 'lists' })
export class ListModel extends Model<ListModel, CreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column
  declare id?: number;

  @Column
  name: string;
}

type CreationAttributes = {
  name: string;
};
