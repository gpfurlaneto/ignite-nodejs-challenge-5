import {
  Request,
  Response,
} from 'express';
import { container } from 'tsyringe';

import {
  CreateStatementUseCase,
} from '../createStatement/CreateStatementUseCase';
import { ICreateStatementDTO } from '../createStatement/ICreateStatementDTO';

export default class CreateTransferController {
  async execute(request: Request, response: Response) {
    const { id: user_id } = request.user;
    const { user_id: to_id } = request.params;
    const { amount, description } = request.body;

    const createStatement = container.resolve(CreateStatementUseCase);
    //create withdraw
    await createStatement.execute({
      user_id,
      type: 'withdraw',
      amount,
      description
    } as ICreateStatementDTO);

    //create transfer
    const transfer = await createStatement.execute({
      user_id: to_id,
      sender_id: user_id,
      type: 'transfer',
      amount,
      description
    } as ICreateStatementDTO);

    return response.status(201).json(transfer);
  }
}