//Testing para el product manager
import ProductManager from "./Managers/ProductManager.js";

//Creamos la instancia
let productos = new ProductManager("./Files/products.json");
//Obtenemos de forma asyncronica todos los metodos del Product Manager
const test = async () => {
    try {
        /* =======================================================TESTING=============================================== */
        //Producto prueba
        let productoPrueba = {
            title: "producto prueba",
            description: "Este producto es una prueba",
            price: 200,
            thumbnail: "Sin imagen",
            code: "abc123",
            stock: 25,
        };
        //Obtener productos
        console.log("Obteniendo productos", await productos.getProducts());
        //Agregar un producto
        await productos.addProduct(productoPrueba);
        //Buscar por ID
        console.log("El producto con ID:1 ", await productos.getProductById(1));
        //Agregar el mismo producto
        await productos.addProduct(productoPrueba);
        console.log("Obteniendo productos", await productos.getProducts());
        //Buscar por ID que no existe
        console.log("El producto con ID:2 (que no existe) ", await productos.getProductById(2));
        //Agregando un segundo producto
        await productos.addProduct({
            title: "producto2",
            description: "Este producto es una prueba",
            price: 200,
            thumbnail: "Sin imagen",
            code: "abc124",
            stock: 25,
        });
        console.log("Despues de agregar un producto", await productos.getProducts());
        //Actualizando un producto que existe
        await productos.updateProduct(1, {
            title: "producto1 Actualizdo",
            description: "Este producto es una prueba",
            price: 200,
            thumbnail: "Sin imagen",
            code: "abc123",
            stock: 25,
        });
        console.log("Despues de actualizar el producto ID: 1", await productos.getProducts());
        //Eliminando un producto
        console.log("Despues de agregar un producto ID:1", await productos.deleteProduct(1));
        productos.deleteProduct(2);
    } catch (error) {
        console.log("ERROR:", error);
    }
};

function main() {
    test();
}
main();