import supertest from "supertest";
import { expect } from "chai";

const requester = supertest("http://127.0.0.1:3000");

describe("API de Productos", () => {

    describe('GET /store/products', () => {
        it('debería obtener todos los productos', async () => {
            const res = await requester.get('/store/products');
            expect(res.status).to.equal(200);
        });
    });

    describe('GET /store/products/:pid', () => {
        it('debería obtener un producto por ID', async () => {
          const productId = '65d659434cdffa261170f0ad'; // Reemplaza esto con un ID válido en tu base de datos
          const res = await requester.get(`/store/products/${productId}`);
          expect(res.status).to.equal(200);
        });
    
        it('debería devolver 404 si el producto no existe', async () => {
          const nonExistentId = '65d659434cdffa261110f0ad'; // Asegúrate de que este ID no exista en tu base de datos
          const res = await requester.get(`/store/products/${nonExistentId}`);
          console.log(res);
          expect(res.status).to.equal(404);
          expect(res.body).to.have.property('message', 'PRODUCT_NOT_FOUND');
        });
      });
});