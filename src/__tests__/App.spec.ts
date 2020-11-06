/* eslint-disable prettier/prettier */
import request from 'supertest';

import { Connection, getConnection, getRepository } from 'typeorm';
import createConnection from '@shared/infra/typeorm/index';

import Product from '@modules/products/infra/typeorm/entities/Product';

import app from '@shared/infra/http/app';

let connection: Connection;

describe('App', () => {
  beforeAll(async () => {
    connection = await createConnection('test-connection');

    await connection.query('DROP TABLE IF EXISTS orders_products');
    await connection.query('DROP TABLE IF EXISTS orders');
    await connection.query('DROP TABLE IF EXISTS products');
    await connection.query('DROP TABLE IF EXISTS customers');
    await connection.query('DROP TABLE IF EXISTS migrations');

    await connection.runMigrations();
  });

  beforeEach(async () => {
    await connection.query('DELETE FROM orders_products');
    await connection.query('DELETE FROM orders');
    await connection.query('DELETE FROM products');
    await connection.query('DELETE FROM customers');
  });

  afterAll(async () => {
    const mainConnection = getConnection();

    await connection.close();
    await mainConnection.close();
  });

  it('should be able to create a new customer', async () => {
    const response = await request(app).post('/customers').send({
      name: 'user',
      email: 'oi@user.com.br',
    });

    expect(response.body).toEqual(
      expect.objectContaining({
        name: 'user',
        email: 'oi@user.com.br',
      }),
    );
  });
  it('should be able to delete a customer', async () => {
    const response = await request(app).post('/customers').send({
      name: 'user',
      email: 'oi@user.com.br',
    });

    const deleteResponse = await request(app).delete('/customers').send({
      id: response.body.id
    });

    expect(deleteResponse.status).toBe(201)
  });

  it('should be able to edit a customer', async () => {
    const customer = await request(app).post('/customers').send({
      name: 'user',
      email: 'oi@user.com.br',
    });

    const response = await request(app).put('/customers').send({
      id: customer.body.id,
      name: 'contratado',
      email: customer.body.email,
    });

    expect(response.body).toEqual(
      expect.objectContaining({
        name: 'contratado',
        email: customer.body.email,
      }),
    );
  });
  it('should not be able to create a customer with one e-mail thats already registered', async () => {
    const customer = await request(app).post('/customers').send({
      name: 'user',
      email: 'oi@user.com.br',
    });

    expect(customer.body).toEqual(
      expect.objectContaining({
        name: 'user',
        email: 'oi@user.com.br',
      }),
    );

    const response = await request(app).post('/customers').send({
      name: 'user',
      email: 'oi@user.com.br',
    });

    expect(response.status).toBe(400);
  });

  it('should be able to create a new product', async () => {
    const response = await request(app).post('/products').send({
      name: 'Produto 01',
      price: 500,
      quantity: 50,
    });

    expect(response.body).toEqual(
      expect.objectContaining({
        name: 'Produto 01',
        price: 500,
        quantity: 50,
      }),
    );
  });

  it('should be able to delete a product', async () => {
    const response = await request(app).post('/products').send({
      name: 'Produto 01',
      price: 500,
      quantity: 50,
    });

    const deleteResponse = await request(app).delete('/products').send({
      id: response.body.id
    });

    expect(deleteResponse.status).toBe(201);
  });

  it('should be able to edit a product', async () => {
    const products = await request(app).post('/products').send({
      name: 'Produto 01',
      price: 500,
      quantity: 50,
    });

    const response = await request(app).put('/products').send({
      id: products.body.id,
      name: "contratado",
      price: 500,
      quantity: 50,
    });

    expect(response.body[0]).toEqual(
      expect.objectContaining({
        name: response.body[0].name,
        price: response.body[0].price,
        quantity: response.body[0].quantity,
      }),
    );
  });

  it('should not be able to create a duplicated product', async () => {
    const product = await request(app).post('/products').send({
      name: 'Produto 01',
      price: 500,
      quantity: 50,
    });

    expect(product.body).toEqual(
      expect.objectContaining({
        name: 'Produto 01',
        price: 500,
        quantity: 50,
      }),
    );

    const response = await request(app).post('/products').send({
      name: 'Produto 01',
      price: 500,
      quantity: 50,
    });

    expect(response.status).toBe(400);
  });

  it('should be able to create a new order', async () => {
    const product = await request(app).post('/products').send({
      name: 'Produto 01',
      price: 500,
      quantity: 50,
    });

    const customer = await request(app).post('/customers').send({
      name: 'user',
      email: 'oi@user.com.br',
    });

    const response = await request(app)
      .post('/orders')
      .send({
        customer_id: customer.body.id,
        products: [
          {
            id: product.body.id,
            quantity: 5,
          },
        ],
      });

    expect(response.body).toEqual(
      expect.objectContaining({
        customer: expect.objectContaining({
          id: customer.body.id,
          name: 'user',
          email: 'oi@user.com.br',
        }),
        order_products: expect.arrayContaining([
          expect.objectContaining({
            product_id: product.body.id,
            price: '500.00',
            quantity: 5,
          }),
        ]),
      }),
    );
  });

  it('should be able to delete a order', async () => {
    const product = await request(app).post('/products').send({
      name: 'Produto 01',
      price: 500,
      quantity: 50,
    });

    const customer = await request(app).post('/customers').send({
      name: 'user',
      email: 'oi@user.com.br',
    });

    const orders = await request(app)
      .post('/orders')
      .send({
        customer_id: customer.body.id,
        products: [
          {
            id: product.body.id,
            quantity: 5,
          },
        ],
      });

    const deleteResponse = await request(app).delete(`/orders/${orders.body.id}`)

    expect(deleteResponse.status).toBe(201)
  });

  it('should be able to edit a order', async () => {
    const product = await request(app).post('/products').send({
      name: 'Produto 01',
      price: 500,
      quantity: 50,
    });

    const customer = await request(app).post('/customers').send({
      name: 'user',
      email: 'oi@user.com.br',
    });

    const customerTwo = await request(app).post('/customers').send({
      name: 'userTwo',
      email: 'oiTwo@user.com.br',
    });

    const orders = await request(app)
      .post('/orders')
      .send({
        customer_id: customer.body.id,
        products: [
          {
            id: product.body.id,
            quantity: 5,
          },
        ],
      });

    const response = await request(app).put(`/orders/${orders.body.id}`).send({

      customer_id: customerTwo.body.id,
      products: [
        {
          id: product.body.id,
          quantity: 10,
        },
      ],
    });

    expect(response.body).toEqual(
      expect.objectContaining({
        customer: expect.objectContaining({
          id: customerTwo.body.id,
          name: customerTwo.body.name,
          email: customerTwo.body.email,
        }),
        order_products: expect.arrayContaining([
          expect.objectContaining({
            product_id: product.body.id,
            price: '500.00',
            quantity: 10,
          }),
        ]),
      }),
    );
  });

  it('should not be able to create an order with a invalid customer', async () => {
    const response = await request(app).post('/orders').send({
      customer_id: '6a1922c8-af6e-470e-9a34-621cb0643911',
    });

    expect(response.status).toEqual(400);
  });

  it('should not be able to create an order with invalid products', async () => {
    const customer = await request(app).post('/customers').send({
      name: 'user',
      email: 'oi@user.com.br',
    });

    const response = await request(app)
      .post('/orders')
      .send({
        customer_id: customer.body.id,
        products: [
          {
            id: '6a1922c8-af6e-470e-9a34-621cb0643911',
          },
        ],
      });

    expect(response.status).toEqual(400);
  });

  it('should not be able to create an order with products with insufficient quantities', async () => {
    const customer = await request(app).post('/customers').send({
      name: 'user',
      email: 'oi@user.com.br',
    });

    const product = await request(app).post('/products').send({
      name: 'Produto 01',
      price: 500,
      quantity: 50,
    });

    const response = await request(app)
      .post('/orders')
      .send({
        customer_id: customer.body.id,
        products: [
          {
            id: product.body.id,
            quantity: 500,
          },
        ],
      });

    expect(response.status).toEqual(400);
  });

  it('should be able to subtract an product total quantity when it is ordered', async () => {
    const productsRepository = getRepository(Product);

    const customer = await request(app).post('/customers').send({
      name: 'user',
      email: 'oi@user.com.br',
    });

    const product = await request(app).post('/products').send({
      name: 'Produto 01',
      price: 500,
      quantity: 50,
    });

    await request(app)
      .post('/orders')
      .send({
        customer_id: customer.body.id,
        products: [
          {
            id: product.body.id,
            quantity: 5,
          },
        ],
      });

    let foundProduct = await productsRepository.findOne(product.body.id);

    expect(foundProduct).toEqual(
      expect.objectContaining({
        quantity: 45,
      }),
    );

    await request(app)
      .post('/orders')
      .send({
        customer_id: customer.body.id,
        products: [
          {
            id: product.body.id,
            quantity: 5,
          },
        ],
      });

    foundProduct = await productsRepository.findOne(product.body.id);

    expect(foundProduct).toEqual(
      expect.objectContaining({
        quantity: 40,
      }),
    );
  });

  it('should be able to list one specific order', async () => {
    const customer = await request(app).post('/customers').send({
      name: 'user',
      email: 'oi@user.com.br',
    });

    const product = await request(app).post('/products').send({
      name: 'Produto 01',
      price: 500,
      quantity: 50,
    });

    const order = await request(app)
      .post('/orders')
      .send({
        customer_id: customer.body.id,
        products: [
          {
            id: product.body.id,
            quantity: 5,
          },
        ],
      });

    const response = await request(app).get(`/orders/${order.body.id}`);

    expect(response.body).toEqual(
      expect.objectContaining({
        customer: expect.objectContaining({
          id: customer.body.id,
          name: 'user',
          email: 'oi@user.com.br',
        }),
        order_products: expect.arrayContaining([
          expect.objectContaining({
            product_id: product.body.id,
            price: '500.00',
            quantity: 5,
          }),
        ]),
      }),
    );
  });

  it('should be able to deleta a order', async () => {
    const customer = await request(app).post('/customers').send({
      name: 'user',
      email: 'oi@user.com.br',
    });

    const product = await request(app).post('/products').send({
      name: 'Produto 01',
      price: 500,
      quantity: 50,
    });

    const order = await request(app)
      .post('/orders')
      .send({
        customer_id: customer.body.id,
        products: [
          {
            id: product.body.id,
            quantity: 5,
          },
        ],
      });

    const response = await request(app).delete(`/orders/${order.body.id}`);

    expect(response.status).toBe(201)
  });
});
