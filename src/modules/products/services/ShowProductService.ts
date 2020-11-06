import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Product from '../infra/typeorm/entities/Product';
import IProductsRepository from '../repositories/IProductsRepository';

interface IRequest {
  id: string;
}

@injectable()
class ShowProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({ id }: IRequest): Promise<Product[]> {
    try {
      const productsExists = await this.productsRepository.findAllById(id);

      return productsExists;
    } catch {
      throw new AppError('There is already one product with this id');
    }
  }
}

export default ShowProductService;
