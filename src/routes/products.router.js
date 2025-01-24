import express from "express";
import fs from "fs";
import { title } from "process";

const productsRouter=express.Router();
class productsManager{
    static products=[];
    static pathFile = "src/data/products.data.json";


    static initialize = async () => {
        try {
          const fileData = await fs.promises.readFile(this.pathFile, "utf-8");
          this.products = JSON.parse(fileData);
          console.log("Datos cargados correctamente!");
       //   console.log(this.products)
        } catch (error) {
          console.error(error);
        }
    } 

    static saveProducts = async () => {
        try {
          await fs.promises.writeFile(this.pathFile, JSON.stringify(this.products, null, 2), "utf-8");
        } catch (error) {
          console.error("Error al guardar usuario en json");
        }
      }

    static addObject=(x)=>{
        this.products.push(x);
        console.log(this.products); 
        this.saveProducts();
    }
}


///         Endpoints

productsRouter.get("/",(req,res)=>{
    res.status(200).send(productsManager.products);
});

productsRouter.get("/:pid",(req,res)=>{    
    const {pid} =req.params;
    if(BuscarProdPID(pid)) {res.status(200).send(BuscarProdPID(pid));}
    else{res.status(400).send("El producto no existe");}
});

productsRouter.post("/",(req,res)=>{
    const { title, description,code,price,Status,stock,category,tumbnails } = req.body;

    if(!title || !description || !code || !price || !Status || !stock || !category ) return res.status(400).send({ message: "Error agregar el producto" });
    else {
            const prod={            
            id: GenerarIDUnica(),
            title: title,
            description: description,
            code: code,
            price: price,
            Status: Status,
            stock: stock,
            category: category,
            trumbnails: tumbnails        
        }
        productsManager.addObject(prod);
        return res.status(200).send({ message: "Objeto agregado Correctamente" });
    }
});

productsRouter.put("/:pid",(req,res)=>{
    const {pid} =req.params;    
    const { title, description,code,price,Status,stock,category,tumbnails } = req.body;

    if(BuscarProdPID(pid)) {
        if(!title || !description || !code || !price || !Status || !stock || !category ) 
            {
                return res.status(400).send({ message: "Error agregar el producto" })
            }
        else {
            BuscarProdPID(pid).title=title;
            BuscarProdPID(pid).description=description;
            BuscarProdPID(pid).code=code;
            BuscarProdPID(pid).price=price;
            BuscarProdPID(pid).Status=Status;
            BuscarProdPID(pid).stock=stock;
            BuscarProdPID(pid).category=category;
            productsManager.saveProducts();
            return res.status(200).send({ message: "Objeto Modificado Correctamente" });
        }
    }
    else{
        res.status(400).send("El producto no existe");
        return;}
   

});

productsRouter.delete("/:pid",(req,res)=>{    
    const {pid} =req.params;
    const index=productsManager.products.findIndex(x=>x.id===pid);
    if(BuscarProdPID(pid)) {
         productsManager.products.splice(index,1);
         productsManager.saveProducts();
        res.status(200).send("producto eliminado correctamente");
    }
    else{res.status(400).send("El producto no existe");}
})

    //      funciones auxiliares        //          //
    const BuscarProdPID=(pid)=>{
    const product=productsManager.products
    const indexBuscado= product.findIndex(prod=> prod.id===pid)
    const productoBuscado=product[indexBuscado];
    return productoBuscado;
    }

    const SegundosAbsolutosDeFecha=()=> {
        const now = new Date(); // Fecha actual
        const seconds = Math.floor(now.getTime() / 100); // Convertir a milisegundos y luego a segundos
        return seconds;
    }
    
    const GenerarIDUnica=()=>{
        const seconds = SegundosAbsolutosDeFecha(); // Obtener los segundos actuales
        const alphanumericId = seconds.toString(36); // Convertir los segundos a base 36
        return alphanumericId;
    }
productsManager.initialize();

export { productsManager,BuscarProdPID };
export default productsRouter;