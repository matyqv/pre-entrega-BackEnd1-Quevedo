import express from "express";
import fs from "fs";
import productsRouter from "./products.router.js";
import productsManager from "../../public/js/products.js";

const cartRouter=express.Router();

const PM= productsManager;

const productRouter=productsRouter;
class cartsManager{

    static carts=[];
    static pathFile = "src/data/carts.data.json";


    static initialize = async () => {
        try {
          const fileData = await fs.promises.readFile(this.pathFile, "utf-8");
          this.carts = JSON.parse(fileData);
        } catch (error) {
          console.error(error);
        }
    } 

   static saveCarts = async () => {
          try {
            await fs.promises.writeFile(this.pathFile, JSON.stringify(this.carts, null, 2), "utf-8");
          } catch (error) {
            console.error("Error al guardar usuario en json");
          }
        }

    static addCart=()=>{
        const newCart = {id:GenerarIDUnica(),products:[]};
        this.carts.push(newCart);
        console.log(this.carts); 
        this.saveCarts();
    }
};
///         Endpoints
cartRouter.get("/",(req,res)=>{
    res.status(200).send(cartsManager.carts);
});

cartRouter.get("/:cid",(req,res)=>{
    const {cid} =req.params;
    if(BuscarCartCID(cid)) {res.status(200).send(BuscarCartCID(cid));}
    else{res.status(400).send("El carrito no existe");}
});

cartRouter.post("/",(req,res)=>{
    cartsManager.addCart();
    res.status(200).send("Carrito creado correctamente");
});

cartRouter.post("/:cid/products/:pid", (req, res) => {
    const { cid, pid } = req.params;
    const product = PM.BuscarProdPID(pid);

    if(!BuscarCartCID(cid)) {res.status(404).send("El carrito no existe");}

    if (!product) {return res.status(404).send("Producto no encontrado");}


    const indexProductCart=BuscarCartCID(cid).products.findIndex(x=>x.id===pid);
    const ProdProductCart=BuscarCartCID(cid).products[indexProductCart];

    if(ProdProductCart){        ProdProductCart.quantity+=1;    }
    else
    {    
        const formatoProducto={"id":product.id,"quantity":1};
        BuscarCartCID(cid).products.push(formatoProducto) 
    }  
    
    cartsManager.saveCarts();
    res.status(200).send(BuscarCartCID(cid));
});

//          funciones Auxiliares
const SegundosAbsolutosDeFecha=()=> {
    const now = new Date(); // Fecha actual
    const seconds = Math.floor(now.getTime() / 100); // Convertir a milisegundos y luego a segundos
    return seconds;
}
const GenerarIDUnica=()=>{
    const seconds = SegundosAbsolutosDeFecha(); // Obtener los segundos actuales
    const alphanumericId = seconds.toString(36); // Convertir los segundos a base 36
    return "C"+alphanumericId;
}
const BuscarCartCID=(cid)=>{
    const carts=cartsManager.carts
    const indexBuscado= carts.findIndex(cart=> cart.id===cid)
    const cartBuscado=carts[indexBuscado];
    return cartBuscado;
    }
cartsManager.initialize();

export default cartRouter;
