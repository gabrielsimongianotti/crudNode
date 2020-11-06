import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Product from '../infra/typeorm/entities/Product';
import IProductsRepository from '../repositories/IProductsRepository';

interface IRequest {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

@injectable()
class EditProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({
    id,
    name,
    price,
    quantity,
  }: IRequest): Promise<Product[]> {
    const productsExists = await this.productsRepository.findAllById(id);

    if (quantity <= 0 && price < 1)
      throw new AppError('There is already one quantity is invality');
    const nameExists = await this.productsRepository.findByName(name);

    if (nameExists && nameExists.id !== id)
      throw new AppError('There is already one product with this name');

    productsExists[0].price = price;
    productsExists[0].name = name;
    productsExists[0].quantity = quantity;

    const product = await this.productsRepository.updateQuantity(
      productsExists,
    );

    return product;
  }
}

export default EditProductService;
