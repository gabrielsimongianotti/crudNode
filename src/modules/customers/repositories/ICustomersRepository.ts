import Customer from '../infra/typeorm/entities/Customer';

import ICreateCustomerDTO from '../dtos/ICreateCustomerDTO';

export default interface ICustomersRepository {
  create(data: ICreateCustomerDTO): Promise<Customer>;
  findByEmail(email: string): Promise<Customer | undefined>;
  update(customer: ICreateCustomerDTO): Promise<Customer>;
  findById(id: string): Promise<Customer | undefined>;
  delete(customer: ICreateCustomerDTO): Promise<void>;
}
