import { Router } from 'express';

import OrdersController from '../controller/OrdersController';

const ordersRouter = Router();
const ordersController = new OrdersController();

ordersRouter.post('/', ordersController.create);
ordersRouter.get('/:id', ordersController.show);
ordersRouter.delete('/:id', ordersController.remove);
ordersRouter.put('/:id', ordersController.edit);

export default ordersRouter;
