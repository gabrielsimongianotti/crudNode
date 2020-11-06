import { Router } from 'express';

import CustomersController from '../controller/CustomersController';

const customersRouter = Router();
const customersController = new CustomersController();

customersRouter.post('/', customersController.create);
customersRouter.get('/', customersController.show);
customersRouter.put('/', customersController.update);
customersRouter.delete('/', customersController.delete);
export default customersRouter;
