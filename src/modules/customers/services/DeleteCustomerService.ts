import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICustomersRepository from '../repositories/ICustomersRepository';

interface IRequest {
  name: string;
  email: string;
}

@injectable()
class DeleteCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    try {
      const custmers = await this.customersRepository.findById(id);

      if (custmers === undefined)
        throw new AppError('There is already one custumer with this id');

      await this.customersRepository.delete(custmers);
    } catch {
      throw new AppError('There is already one product with this id');
    }
  }
}

export default DeleteCustomerService;
