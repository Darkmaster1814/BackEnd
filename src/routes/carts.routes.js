/* ====================ROUTER DEL CARRITO DE COMPRAS==================== */
//Importamos las clases manager que vamos a utilizar 
import CartManager from "../Managers/CartManager.js";
import ProductManager from "../Managers/ProductManager.js";
//Importamos Routering de express
import { Router, request, response } from 'express';
const cartRouter = new Router();//Instanciamos el routering para products

/* API CART */
/* Instanciando el objecto de cart de cart manager y product de product manager*/
const pathCart = './Files/carts.json';
const carts = new CartManager(pathCart);
const pathProduct = './Files/products.json';
const products = new ProductManager(pathProduct);

//GET all carts
cartRouter.get('/', async (request, response) => {
    response.status(200).send({ status: 'success', payload: await cart.getCarts() })
})

//GET cart By ID
cartRouter.get('/:cid', async (request, response) => {
    const { cid } = request.params;//Guardamos el cart id del params
    const cartID = await carts.getCartsById(parseInt(cid));//Obtenemos el carrito por ID
    //Validacion de CID
    if (!cartID) return response.status(404).send('ERROR: CID not found');
    return response.status(200).send({ status: 'success', payload: cartID });
});

//POST cart by Pid and cid
cartRouter.post('/:cid/product/:pid', async (request, response) => {
    //Guardando los params
    const { pid, cid } = request.params;
    //Del body guardamos el quantity
    const { quantity } = request.body;
    //Validamos que exista el producto y que exista el carrito
    if (!await carts.getCartsById(parseInt(cid))) return response.status(404).send('ERROR:CID not found');//Valida cid
    if (await products.getProductById(parseInt(pid)) === null) return response.status(404).send('ERROR:PID not found');//Valida pid
    if (await carts.addProductToCartById(parseInt(cid), parseInt(pid), parseInt(quantity))) return response.status(400).send('ERROR:Bad request');
    return response.status(200).send({ status: 'success', payload: await carts.getCartsById(parseInt(cid)) });//Si no hay error regresa el carrito modificado
});

//DELETE cart by Pid and Cid
cartRouter.delete('/:cid/product/:pid', async (request, response) => {
    //Guardamos params
    const { pid, cid } = request.params;
    //Validamos que exista el carrito y el producto la validacion es interna en el manager
    if (await carts.deleteProductToCartById(parseInt(cid), parseInt(pid))) return response.status(400).send('ERROR:Bad request');
    response.status(200).send({ status: 'success', payload: await carts.getCarts() })
});

export default cartRouter;