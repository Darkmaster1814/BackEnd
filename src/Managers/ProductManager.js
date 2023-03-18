/* ===================PRODUCT MANAGER==================================================== */
//Importamos el manejador de archivos locales
import fs from 'fs'; 

export default class ProductManager {
    #path;
    constructor(path) {
        this.#path = path;
    }
        //Getter del array de productos por numero de productos
        getProducts = async () => {
            //Corroborar si existe el archivo de lo contrario regresa arreglo vacio y corroborar si el number of products
            if (fs.existsSync(this.#path)) {
                //Leemos documento desde el archivo json luego lo pasamos a string para guardaro en el arreglo products
                const data = await fs.promises.readFile(this.#path, 'utf-8'); //leemos
                const products = JSON.parse(data); //Convertimos de JSON a String y guardamos
                return products;
            } else { //Si el path no existe(no hay archivo) regresa error
                console.log("ERROR:Not file found");
                return [];
            }
        }
    //Method para revisar si alguno de los productos existe en el array return true si existe
    productExist = (products, code) => {
        let exist = products.some((product) => {
            return (product.code === code)
        });
        exist && console.log("ERROR: Codigo duplicado");
        return exist;
    }
    //Method para validar los campos ingresados
    isValid(product) {
        let valid = true; //Variable flag para validar si los campos se llenaron, si se llenaron es true si falta alguno o es undefined  es false
        /* Validador de campos */
        Object.values(product).forEach((field) => {
            if (field === "" || field === undefined) {
                valid = false;
                console.log("ERROR:Rellene todos los campos");
            }
        });
        return valid;
    }
    /* Obtener producto por ID */
    getProductById = async (id) => {
        const products = await this.getProducts();
        let productById = products.find((product) => product.id === id);
        if (productById === undefined) {
            console.log("ERROR:Not Found");
            return undefined;
        } else {
            return productById;
        }
    }
    //Añade un producto al array
    addProduct = async (product) => {
        const products = await this.getProducts(); //Obtener el arreglo de productos
        //Valida que el price y quantity sean numeros y no letras    
        if(isNaN(parseInt(product.price))||isNaN(parseInt(product.stock)))return true;
        /*Push de objetos en caso de que sean validos  */
        if (!this.productExist(products, product?.code) && this.isValid(product)) {
            if (products.length === 0) {
                product.id = 1;
            } else {
                product.id = products[products.length - 1].id + 1;
            }
            //Escribimos el objecto en el array de productos
            products.push({
                id: product.id,
                price:parseFloat(product.price),
                stock:parseInt(product.stock),
                ...product
            });
            //Escribimos en documento el array de objetos acutalizado
            const productsJSON = JSON.stringify(products, null, '\t'); //Convertimos a json para guardar
            await fs.promises.writeFile(this.#path, productsJSON, 'utf-8');
            console.log("se ha agregado producto correctamente");
            return false;//Pequeña validacion para saber si se agrego correctamente no solo muestra un mensaje de error sino tambien emite un mensaje false si no hay error
        }
        return true;
    }
    updateProduct = async (id, productToModify) => {
        const products = await this.getProducts();
        //Primero verifica que el id del producto actualizar exista & sea valido luego ejecuta el update mediante el objecto recibido
        let indexToUpdate = products.findIndex((product) => product.id=== id);
        //Valida que el price y quantity sean numeros y no letras    
        if(isNaN(parseInt(productToModify.price)||isNaN(parseInt(productToModify.stock))))return true;
        if(indexToUpdate===-1)return true;
            //Verifica que el producto a modificar sea valido y que el codigo sea diferente a los que existen o igual al ingreado
            if (this.isValid(productToModify) && (productToModify.code === products[indexToUpdate].code)) {
                await products.splice(indexToUpdate, 1, {
                    "id": id,
                    price:parseFloat(productToModify.price),
                    stock:parseInt(productToModify.stock),
                    ...productToModify
                });
        //Escribimos en documento el array de objetos acutalizado
        const productsJSON = JSON.stringify(products, null, '\t'); //Convertimos a json para guardar
        await fs.promises.writeFile(this.#path, productsJSON, 'utf-8');
        console.log("se ha agregado producto correctamente");
        return false; //Pequeña validación para saber si hubo un error durante alguna validación, si lo hubo es true
        }
        return true;
    }
    deleteProductById = async (id) => {
        const products = await this.getProducts();
        const product = await this.getProductById(id);
        //Primero encuentra el indice a eliminar y luego lo remueve del array
        if (product) {          ///////////////////////
            let indexToRemove = products.findIndex((product) => product.id === id);
            let productRemoved = products[indexToRemove].title;
            products.splice(indexToRemove, 1);
            //Escribimos en documento el array de objetos acutalizado
            const productsJSON = JSON.stringify(products, null, '\t'); //Convertimos a json para guardar
            await fs.promises.writeFile(this.#path, productsJSON, 'utf-8');
            console.log(`El producto "${productRemoved}", ha sido removido con exito`);
            return false //Si el ID no existe regresa true, es decir hubo un error de validación 
        }
        return true
    }
}