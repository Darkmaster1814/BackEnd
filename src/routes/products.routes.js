/* ============================ROUTERING DE PRODUCTOS============================== */
//Importamos los manager de productos 
import ProductManager from "../Managers/ProductManager.js";
//Importamos Routering
import { Router, request, response } from 'express';
const productRouter = new Router();//Instanciamos el routering para products

/* API PARA PRODUCT */
/* Instanciando el objecto de products de la clase product manager */
const pathProduct = './Files/products.json';//La ruta es la ruta relativa a el app.js
const products = new ProductManager(pathProduct);

// Iniciando el routing para get 
//GET By ID
productRouter.get('/:pid', async (request, response) => {
    const { pid } = request.params;//Obtenemos del params el valor del product ID y lo cambiamos al tipo de dato del arreglo en ID
    const productID = await products.getProductById(parseInt(pid));//Usamos el metodo get con el parse Int para obtener el producto con ese ID
    /* Validación si el producto tiene algun error */
    if (!productID) return response.status(404).send({ status: "ERROR", payload: "ERROR:PID not found" });
    /* Respuesta */
    response.status(200).send({ status: "success", paiload: productID });
})

//GET con query ? limit
productRouter.get('/', async (request, response) => {
    const productos = await products.getProducts();//Se obtienen todos los productos
    const { limit } = request.query;//Guarda el query products?limit=3 =>3
    //SIN QUERY
    if (limit === undefined) return response.status(200).send({ status: "success", payload: productos });//Si no hay algun query regresa todos los productos
    //CON QUERY 
    //valida que no sea un query decimal /productslimit=1.1 o que sea una letra /products?limit=a
    if (isNaN(parseInt(limit)) || parseFloat(limit) % 1 !== 0) return response.status(404).send({ status: "ERROR", payload: "ERROR: Bad request" });
    /* Respuesta: */
    const productsLimit = (parseInt(limit) <= productos.length) ? productos.filter((product) => product.id <= parseInt(limit)) : productos; //Regresa los productos dependiendo del numberProducts dado, si el numero es mayor al length entonces regresa todos los productos sino regresa el numero de productos solicitados
    return response.status(200).send({ status: "success", payload: productsLimit });
});

//POST for create a new product
productRouter.post('/', async (request, response) => {
    //Creamos el body
    const { title, description, price, thumbnail, code, stock } = request.body;
    const status = (request.body.status === undefined) ? true : request.body.status;//Valor de status por defecto es true
    //Validación de el body
    if (!title || !description || !price | !code || !stock) return response.status(400).send("ERROR: Bad request");
    //Validación de POST
    if (await products.addProduct({ title, description, price, thumbnail, code, stock, status })) return response.status(400).send("ERROR: Bad request");
    return response.status(200).send({ status: "success", payload: await products.getProducts() });
});

//PUT for modify a product by ID
productRouter.put('/:pid', async (request, response) => {
    const { pid } = request.params;//Guardamos el parametro dado en url del product id
    //Creamos el body
    const { title, description, price, thumbnail, code, stock, status } = request.body;//Guardamos ens spread cada valor del objecto body
    //Validación del body
    if (!pid || !title || !description || !price | !code || !stock || !status) return response.status(400).send("ERROR: Bad request");
    //Validación del PUT
    if (await products.updateProduct(parseInt(pid), { title, description, price, thumbnail, code, stock, status })) return response.status(400).send("ERROR: Bad request");
    return response.status(200).send({ status: "success", payload: await products.getProductById(parseInt(pid)) });
});

//DELETE to remove a product by ID
productRouter.delete('/:pid', async (request, response) => {
    const { pid } = request.params;//Guardamos el parametro dado en url del product id
    console.log(pid)
    //Validación del ID
    if (!pid) return response.status(400).send("ERROR:Bat request");
    //Validación de ID existe
    if (await products.deleteProductById(parseInt(pid))) return response.status(404).send("ERROR: PID not found");
    return response.status(200).send({ status: "success", payload: await products.getProducts() });
})

export default productRouter;
