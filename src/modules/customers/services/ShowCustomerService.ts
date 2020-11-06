import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Customer from '../infra/typeorm/entities/Customer';
import ICustomersRepository from '../repositories/ICustomersRepository';

interface IRequest {
  name: string;
  email: string;
}

@injectable()
class ShowCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute(id: string): Promise<Customer | undefined> {
    try {
      const custmers = await this.customersRepository.findById(id);

      return custmers;
    } catch {
      throw new AppError('There is already one product with this id');
    }
  }
}

export default ShowCustomerService;
