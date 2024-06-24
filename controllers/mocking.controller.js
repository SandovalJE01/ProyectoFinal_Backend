import { v4 as uuidv4 } from 'uuid'; 

const Product = {
    id: "", 
    name: "",
    price: 0,
    category: "",
    description: ""
};

const GetMockedProducts = async (req, res) => {
    try {
        const mockedProducts = [];
        for (let i = 1; i <= 100; i++) {
            const product = { ...Product };
            product.id = uuidv4(); 
            product.name = `Product ${i}`;
            product.price = Math.floor(Math.random() * 100) + 1; 
            product.category = `Category ${Math.ceil(Math.random() * 10)}`;
            product.description = `Description for Product ${i}`;
            mockedProducts.push(product);
        }
        res.status(200).json(mockedProducts);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error obteniendo productos");
    }
}

export default {
    GetMockedProducts
}