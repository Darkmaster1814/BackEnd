/* ==========================CART MANAGER================================================= */
//Import de manejador de archivos
import fs from 'fs'; //Importación del file system para escribir archivos locales

export default class CartManager {
    #path;
    constructor(path) {
        this.#path = path;
    }
        //Getter del array de carritos
        getCarts = async () => {
            const carts = [];
            //Corroborar si existe el archivo de lo contrario regresa arreglo vacio
            if (fs.existsSync(this.#path)) {
                //Leemos documento desde el archivo json luego lo pasamos a string para guardaro en el arreglo products
                const data = await fs.promises.readFile(this.#path, 'utf-8'); //leemos
                const carts = JSON.parse(data); //Convertimos de JSON a String y guardamos
                return carts;
            } else { //Si el path no existe(no hay archivo) regresa error
                console.log("ERROR:Not file found");
                return [];
            }
        }

        //Obtener carrito por ID
        getCartsById= async (cid)=>{
            const carts=await this.getCarts();
            const cartId=carts.find((cart)=>cart.cid===cid);
            if(!cartId){console.log("ERROR:Carrito Not Found")
            return undefined;
            } 
            return cartId;
        }

        //Agregar un producto al carrito con ID
        addProductToCartById=async(cid,pid,quantity)=>{//cid products[pid, quantity]
            const cart=await this.getCartsById(cid);
            const carts=await this.getCarts();
            //Valida que el quantity sea un numero 
            if(isNaN(parseInt(quantity)))return true;
            //Si no hay carrito entonces lo agrega 
            if(!cart) {
                carts.push({"cid":cid,"products":[{"pid":pid,"quantity":parseInt(quantity)}]});
                //Escribimos en documento el array de objetos acutalizado
                const cartsJSON = JSON.stringify(carts, null, '\t'); //Convertimos a json para guardar
                await fs.promises.writeFile(this.#path, cartsJSON, 'utf-8');//Escribimos en el documento
                console.log("se ha agregado productos al carrito correctamente");
                return false;
            }
            //Una vez el carrito existe, busca dentro del arreglo de productos el que tenga el mismo pid
            const IndexToUpdateProduct=cart.products.findIndex((product)=>product.pid===pid);
            const IndexToUpdateCart=carts.findIndex((car)=>car.cid===cid); 
            //Valida si el indice no se encuentra (-1) entonces solo agrega el producto a la cola de los que existen de lo contrario suma su cantidad mas la cantidad dada en quantity
            if(IndexToUpdateProduct===-1){
                cart.products.push({"pid":pid,"quantity":parseInt(quantity)});//Primero se agrega al carrito general el nuevo producto
                carts.splice(IndexToUpdateCart, 1, {"cid":cid,"products":cart.products});//Actualiza el carrito con el indice que encuentra en lugar de hacer push
            }//Si el producto existe agrega la cantidad inicial mas lo que se le pasa por body en el request
            if(IndexToUpdateProduct!==-1){
            cart.products[IndexToUpdateProduct].quantity+=parseInt(quantity);//Se le agrega lo que tenia el producto anterior
            carts.splice(IndexToUpdateCart, 1, {"cid":cid,"products":cart.products});//Actualiza el carrito con el indice que encuentra en lugar de hacer push
        }
             //Escribimos en documento el array de objetos acutalizado
            const cartsJSON = JSON.stringify(carts, null, '\t');
            await fs.promises.writeFile(this.#path, cartsJSON, 'utf-8');
            console.log("se ha agregado productos al carrito correctamente");
            return false;
        }

        //Eliminar un producto del carrito con CID
        deleteProductToCartById=async(cid,pid)=>{
            const carts=await this.getCarts();
            const cart=await this.getCartsById(cid);
            //Valida que el carrito exista
            if(cart===null)return true;//Error manda true si el carrito no existe
            const indexToRemove=carts.findIndex((car)=>car.cid===cid);//Encotramos el index a borrar en el carrito
            //Validamos que el producto exista en el array del carrito
            const indexToRemoveProduct=cart.products.findIndex((prod)=>prod.pid===pid);
            if(indexToRemoveProduct===-1)return true;//Error encontrado producto y manda true
            const productRemoved=cart.products[indexToRemoveProduct].pid;//Guarda el carrito para luego mostrar el que se borro en consola
            cart.products.splice(indexToRemoveProduct,1);//Removemos el producto del carrito
            carts.splice(indexToRemove,1,cart);
            //Validación si no hay productos en el carrito lo elimina si hay lo actualiza
            if(cart.products.length===0) 
            {
            carts.splice(indexToRemove,1); 
            }
            const cartJSON=JSON.stringify(carts,null,'\t');//Convertimos a JSON para guardar
            await fs.promises.writeFile(this.#path,cartJSON,'utf-8');
            console.log(`El producto PID:${productRemoved} ha sido borrado con éxito del carrito CID:${cid}`);
            return false;//No hubo error por tanto regresa false
        } 
    }

