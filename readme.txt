REGISTER
POST http://localhost:3000/register
RAW JSON:
{
    "name": "Rel",
    "email": "rel@gmail.com",
    "password": "123456",
    "confPassword": "123456"
}


LOGIN
POST http://localhost:3000/login
RAW JSON:
{
    "email": "rel@gmail.com",
    "password": "123456"
}


USERS (AUTH)
GET http://localhost:3000/users
HEADER:
Authorization: Bearer <TOKEN_DARI_LOGIN>


PRODUK (GET)
GET http://localhost:3000/produk


PRODUK (POST)
POST http://localhost:3000/produk
RAW JSON:
{
    "name": "Indomie Goreng",
    "price": 3500,
    "stock": 100
}


TRANSAKSI (GET)
GET http://localhost:3000/transaksi


TRANSAKSI (POST)
POST http://localhost:3000/transaksi
RAW JSON:
{
    "product_id": 1,
    "qty": 3
}


http://localhost:3000/users
metode Delete 
Body
{
id:1 atau ada berapa id yang terdaftar
}

Telah support pengurangan stock jika terjadi transaksi
Mengakses Users hanya bisa jika memiliki TOKEN_DARI_LOGIN
Tertera jam transaksi detail
