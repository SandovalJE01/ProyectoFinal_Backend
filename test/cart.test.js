import supertest from "supertest";
import { expect } from "chai";

const requester = supertest("http://127.0.0.1:3000");


describe("API de Carrito", () => {
    describe('POST /store/cart/add', () => {
        it('debería agregar un producto al carrito', async () => {
          const productId = '65d659434cdffa261170f0ad'; 
          const res = await requester.post('/store/cart/add').send({ productId });
          expect(res.status).to.equal(200);
        });
    
        it('debería devolver un mensaje de error si el producto no existe', async () => {
          const nonExistentProductId = '65d659434cdffa261110f0ad';
          const res = await requester.post('/store/cart/add').send({ productId: nonExistentProductId });
          expect(res.status).to.equal(404);
          expect(res.body).to.have.property('message', 'PRODUCT_NOT_FOUND');
        });
    });

    describe('GET /store/cart', () => {
        it('debería obtener el carrito del usuario', async () => {
          const res = await requester.get('/store/cart');
          expect(res.status).to.equal(200);
        });
    
        it('debería devolver un mensaje de error si el usuario no tiene un carrito asociado', async () => {
          const res = await requester.get('/store/cart');
          expect(res.status).to.equal(404);
          expect(res.body).to.have.property('message', 'CART_NOT_FOUND');
        });
    });

});