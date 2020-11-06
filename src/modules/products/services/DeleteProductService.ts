import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '../repositories/IProductsRepository';

interface IRequest {
  id: string;
}

@injectable()
class DeleteProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({ id }: IRequest): Promise<void> {
    const product = await this.productsRepository.findAllById(id);

    if (!product.length)
      throw new AppError('There is already one product with this id');

    await this.productsRepository.delete(product);
  }
}

export default DeleteProductService;
