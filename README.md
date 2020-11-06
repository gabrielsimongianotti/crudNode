# crudSOLID

##Comandos para rodar a aplicação

cria container da aplicação
```bash
  docker run --name contratado -e POSTGRES_PASSWORD=docker -e POSTGRES_USER=postgres -e POSTGRES_DB=desafio -p 5432:5432 -d postgres
```


roda os migrations da aplicação

```bash
  yarn typeorm migration:run
```

#Rotas

##customers
http://localhost:3333/customers
post
```json
{
  "name": "Rocgketsea1",
  "email": "oi@rockeseag1t.com.br"
}
```

http://localhost:3333/customers
put
```json
{
  "name": "Rocketsea1",
  "email": "oi@rockesea1t.com.br",
  "id": "b623b7f7-4ed9-48b9-89d9-d2d9b4e56ed4"
}
```

http://localhost:3333/customers
delete
```json
{
  "name": "Rocketsea1",
  "email": "oi@rockesea1t.com.br",
  "id": "b623b7f7-4ed9-48b9-89d9-d2d9b4e56ed4"
}
```

http://localhost:3333/customers
get
```json
{
  "id": "b623b7f7-4ed9-48b9-89d9-d2d9b4e56ed4"
}
```

##products
http://localhost:3333/products
get
```json
{
  "id": "ad615c84-014d-4461-b548-71dac18295e0"
}
```

http://localhost:3333/products
post
```json
{
  "name": "dugdo",
	"price": 500,
	"quantity": 50
}
```


http://localhost:3333/products
put
```json
{
  "name": "dugo",
  "price": 500,
  "quantity": 50,
  "id": "ad615c84-014d-4461-b548-71dac18295e0"
}
```

http://localhost:3333/products
delete
```json
{
  "id": "03fb9a64-2cf5-45a8-a7fe-f8acf5904809"
}
```

##orders
http://localhost:3333/orders/b53a520a-0986-4665-b955-8c834e6ebe3e
get

http://localhost:3333/orders
post
```json
{
	"customer_id": "e303a318-aa4d-4daf-bb95-b61d6c5a74ff",
	"products":[{
		"id":"ea33d1e8-02fd-41a6-81a7-9df8d09d461e",
    "quantity": 5
	}]
}
```


http://localhost:3333/orders
put
```json
{
	"customer_id": "ee95e4be-91d1-424a-88f9-9e18ad3f58d0",
	"products":[{
		"id":"ea33d1e8-02fd-41a6-81a7-9df8d09d461e",
    "quantity": 5
	}]
}
```

http://localhost:3333/orders/b9aeac3e-3c0a-4d6a-a68c-b32b703273ac
delete

