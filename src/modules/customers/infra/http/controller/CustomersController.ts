import { Request, Response } from 'express';

import CreateCustomerService from '@modules/customers/services/CreateCustomerService';
import ShowCustomerService from '@modules/customers/services/ShowCustomerService';
import EditCustomerService from '@modules/customers/services/EditCustomerService';
import deleteCustomerService from '@modules/customers/services/DeleteCustomerService';

import { container } from 'tsyringe';

export default class CustomersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email } = request.body;
    const createCustomer = container.resolve(CreateCustomerService);

    const customer = await createCustomer.execute({
      name,
      email,
    });

    return response.json(customer);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.body;
    const showCustomer = container.resolve(ShowCustomerService);

    const customer = await showCustomer.execute(id);

    return response.json(customer);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id, name, email } = request.body;
    const editCustomer = container.resolve(EditCustomerService);

    const customer = await editCustomer.execute({ id, name, email });

    return response.json(customer);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.body;
    const editCustomer = container.resolve(deleteCustomerService);

    await editCustomer.execute(id);

    return response.status(201).json({});
  }
}
