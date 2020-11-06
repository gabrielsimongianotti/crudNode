import { Router } from 'express';

import ProductsController from '../controller/ProductsController';

const productsRouter = Router();
const productsController = new ProductsController();

productsRouter.post('/', productsController.create);
productsRouter.get('/', productsController.show);
productsRouter.delete('/', productsController.remove);
productsRouter.put('/', productsController.edit);

export default productsRouter;
