class ProductManager {
    #products;//Arreglo de productos
    static id = 0; //Declaracion de una variable statica y privada
    constructor() {
        this.#products = [];
    } 
    //Getter del array de productos
    getProducts() 
    {
        return this.#products;
    } 
    //Method para revisar si alguno de los productos existe en el array return true si existe
    productExist(code) {
        let exist = false; //se inicia como que no existe y si existe se vuelve true
        this.#products.forEach((product) => {
            if (product.code === code) exist = true;
        });
        return exist;
    } 
    //Añade un producto al array
    addProduct = (product) => {
        let valid = true;//Variable flag para validar si los campos se llenaron, si se llenaron es true si falta alguno o es undefined  es false
        /* Validador de campos */
        Object.values(product).forEach((field) => {
            if (field === "" || field === undefined) {
                valid = false;
                console.log("ERROR:Rellene todos los campos")
            }});
        /*Push de objetos en caso de que sean validos  */
        if (!this.productExist(product?.code) &&valid) {
            this.#products.push({
                id: ++ProductManager.id,
                ...product});
        } 
        else {
            console.log("ERROR:Asegurese que el codigo no se repita");
        }
    }
    /* Obtener producto por ID */
    getProductById = (id) => {
        let productById = this.#products.find((product) => product.id === id);
        if (productById === undefined) {
            console.log("ERROR:Not Found");
        } else {
            return productById;
        }
    }
}


//Creamos la instancia
let productos = new ProductManager();
//Producto prueba
let productoPrueba = {
    title: "producto prueba",
    description: "Este producto es una prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25,
};

/* =======================================================TESTING=============================================== */
console.log("El arreglo vacio:", productos.getProducts());
productos.addProduct(productoPrueba);
console.log("Despues de agregar un producto",productos.getProducts());
console.log("si se agrega el producto otra vez");
productos.addProduct(productoPrueba);
console.log(`Buscando un producto con ID: 1`);
console.log(productos.getProductById(1));
console.log("Buscando un Id que no existe");
console.log(productos.getProductById(111));