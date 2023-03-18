/* ========API SERVER CON EXPRESS=========================================== */
//Importando las dependencias de express
import express from 'express';
//Importamos las rutas 
import cartRouter from './routes/carts.routes.js';
import productRouter from "./routes/products.routes.js";
const app = express();//Instanciando a express
const PORT = 8080;//Iniciando el puerto de comunicacion
app.use(express.json());//Para que express interprete archivos JSON
app.use(express.urlencoded({ extended: true }));//Para expecificar que el body contrendra valores ademas de string


//Starting the server listening
app.listen(PORT, (err) => {
    if (err) return console.log("ERROR: El servidor no na iniciado correctamente");
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});

/* Routering de products */
app.use('/api/products', productRouter);//TODO el CROD esta aqui adentro
/* Routering de cart */
app.use('/api/carts', cartRouter);
