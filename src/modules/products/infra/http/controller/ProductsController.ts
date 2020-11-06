import { Request, Response } from 'express';

import { container } from 'tsyringe';

import CreateProductService from '@modules/products/services/CreateProductService';
import ShowProductService from '@modules/products/services/ShowProductService';
import DeleteProductService from '@modules/products/services/DeleteProductService';
import EditProductService from '@modules/products/services/EditProductService';

export default class ProductsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, price, quantity } = request.body;

    const createProduct = container.resolve(CreateProductService);

    const product = await createProduct.execute({ name, price, quantity });

    return response.json(product);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.body;
    const showProductService = container.resolve(ShowProductService);

    const product = await showProductService.execute({ id });

    return response.json(product);
  }

  public async remove(request: Request, response: Response): Promise<Response> {
    const { id } = request.body;
    const deleteProductService = container.resolve(DeleteProductService);

    await deleteProductService.execute({ id });

    return response.status(201).json({});
  }

  public async edit(request: Request, response: Response): Promise<Response> {
    const { id, name, price, quantity } = request.body;

    const editProduct = container.resolve(EditProductService);

    const product = await editProduct.execute({ id, name, price, quantity });

    return response.json(product);
  }
}
