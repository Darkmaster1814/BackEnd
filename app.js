/* Servidor Con Express  */
//Testing para el product manager
import ProductManager from "./Managers/ProductManager.js";
//Importando las dependencias de express
import express, { request, response } from 'express';
const app=express();//Instanciando a express
const PORT=8080;//Iniciando el puerto de comunicacion
app.use(express.json());//Para que express interprete archivos JSON
app.use(express.urlencoded({extended: true}));//Para expecificar que el body contrendra valores ademas de string

// Iniciando el routing para get 
//GET By ID
app.get('/products/:pid',async (request,response)=>{
    /* Instanciando el objecto de products de la clase product manager */
    const products=new ProductManager("./Files/products.json");
    const {pid}=request.params;//Obtenemos del params el valor del product ID y lo cambiamos al tipo de dato del arreglo en ID
    const productID=await products.getProductById(parseInt(pid));//Usamos el metodo get con el parse Int para obtener el producto con ese ID
    /* Validación si el producto tiene algun error */
    if(productID===null)return response.status(404).send({status:"ERROR",payload:"ERROR:No se encontro el articulo con el ID solicitado"});
    /* Respuesta */
    response.status(200).send({status:"success",paiload:productID});
})

//GET con query ? limit
app.get('/products',async (request,response)=>{
    /* Instanciando el objecto de products de la clase product manager */
    const products=new ProductManager("./Files/products.json");
    const productos=await products.getProducts();//Se obtienen todos los productos
    const {limit}=request.query;//Guarda el query products?limit=3 =>3
    //SIN QUERY
    if(limit===undefined)return response.status(200).send({status:"success",payload:productos});//Si no hay algun query regresa todos los productos
    //CON QUERY 
    //valida que no sea un query decimal /productslimit=1.1 o que sea una letra /products?limit=a
    if(isNaN(parseInt(limit))||parseFloat(limit)%1!==0) return response.status(404).send({status:"ERROR",payload:"ERROR: No se ingreso el request correctamente"});
    /* Respuesta: */    
    const productsLimit=(parseInt(limit)<=productos.length)?productos.filter((product)=>product.id<=parseInt(limit)):productos; //Regresa los productos dependiendo del numberProducts dado, si el numero es mayor al length entonces regresa todos los productos sino regresa el numero de productos solicitados
    return response.status(200).send({status:"success",payload:productsLimit});
});
//Starting the server listening
app.listen(PORT,(err)=>{
    if(err) return console.log("ERROR: El servidor no na iniciado correctamente");
    console.log(`Servidor iniciado en el puerto ${PORT}`);
})



