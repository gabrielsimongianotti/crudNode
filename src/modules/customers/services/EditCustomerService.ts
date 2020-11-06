import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Customer from '../infra/typeorm/entities/Customer';
import ICustomersRepository from '../repositories/ICustomersRepository';

interface IRequest {
  id: string;
  name: string;
  email: string;
}

@injectable()
class EditCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({
    id,
    name,
    email,
  }: IRequest): Promise<Customer | undefined> {
    try {
      const custmers = await this.customersRepository.findById(id);

      if (custmers === undefined)
        throw new AppError('There is already one custumer with this id');

      const emailExist = await this.customersRepository.findByEmail(email);

      if (emailExist && emailExist?.id !== custmers.id)
        throw new AppError('this e-mail is already assfned to a customer');

      custmers.email = email;
      custmers.name = name;

      await this.customersRepository.update(custmers);

      return custmers;
    } catch {
      throw new AppError('There is already one custumer with this id');
    }
  }
}

export default EditCustomerService;
