import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IRequest {
  id: string;
}

@injectable()
class FindOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute(order: Order): Promise<Order | undefined> {
    const datas = await this.customersRepository.findById(order.customer.id);

    if (!datas) throw new AppError('id invalidy', 401);

    const newOrder = order;

    newOrder.customer.name = datas.name;
    newOrder.customer.email = datas.email;

    const editOrder = await this.ordersRepository.edit(newOrder);

    return editOrder;
  }
}

export default FindOrderService;
