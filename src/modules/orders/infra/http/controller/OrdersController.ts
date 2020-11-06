import { Request, Response } from 'express';

import { container } from 'tsyringe';

import CreateOrderService from '@modules/orders/services/CreateOrderService';
import FindOrderService from '@modules/orders/services/FindOrderService';
import DeleteOrderService from '@modules/orders/services/DeleteOrderService';
import EditOrderService from '@modules/orders/services/EditOrderService';

export default class OrdersController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const findOrder = await container.resolve(FindOrderService);
    const order = await findOrder.execute({
      id,
    });

    return response.json(order);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { customer_id, products } = request.body;

    const createOrder = await container.resolve(CreateOrderService);

    const custome = await createOrder.execute({
      customer_id,
      products,
    });

    return response.json(custome);
  }

  public async remove(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const deleteOrder = await container.resolve(DeleteOrderService);

    await deleteOrder.execute({ id });

    return response.status(201).json({});
  }

  public async edit(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { customer_id, products } = request.body;

    const findOrder = await container.resolve(FindOrderService);

    const oldOrder = await findOrder.execute({
      id,
    });
    const editOrder = await container.resolve(EditOrderService);

    oldOrder.order_products.map(product =>
      product.product_id !== products.id
        ? (product.quantity = products[0].quantity)
        : products,
    );
    oldOrder.customer.id = customer_id;
    const edit = await editOrder.execute(oldOrder);

    return response.json(edit);
  }
}
