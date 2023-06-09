import { Statement } from '../entities/Statement';
import {
  ICreateStatementDTO,
} from '../useCases/createStatement/ICreateStatementDTO';

export class BalanceMap {
  static toDTO({ statement, balance }: { statement: Statement[], balance: number }) {
    const parsedStatement = statement.map(({
      id,
      amount,
      description,
      type,
      created_at,
      updated_at,
      sender_id
    }) => {

      const statement: ICreateStatementDTO = {
        id,
        amount: Number(amount),
        description,
        type,
        created_at,
        updated_at
      }

      if (type === 'transfer') {
        statement.sender_id = sender_id
      }
      return statement
    });

    return {
      statement: parsedStatement,
      balance: Number(balance)
    }
  }
}
