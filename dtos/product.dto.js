class ProductDTO {
    constructor(product) {
        this._id = product._id;
        this.name = product.name;
        this.price = product.price;
    }
}

export default ProductDTO;