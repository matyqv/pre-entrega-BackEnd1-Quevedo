import express from "express";
import productsManager from "../../public/js/products.js";
const productsRouter=express.Router();


const PM= productsManager;
///         Endpoints

productsRouter.get("/",(req,res)=>{
    res.status(200).send(PM.products);
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
            id: PM.GenerarIDUnica(),
            title: title,
            description: description,
            code: code,
            price: price,
            Status: Status,
            stock: stock,
            category: category,
            trumbnails: tumbnails        
        }
PM.addObject(prod);
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
            const ProdPID=BuscarProdPID(pid);
            ProdPID.title=title;
            ProdPID.description=description;
            ProdPID.code=code;
            ProdPID.price=price;
            ProdPID.Status=Status;
            ProdPID.stock=stock;
            ProdPID.category=category;
    PM.saveProducts();
            return res.status(200).send({ message: "Objeto Modificado Correctamente" });
        }
    }
    else{
        res.status(400).send("El producto no existe");
        return;}
   

});

productsRouter.delete("/:pid",(req,res)=>{    
    const {pid} =req.params;
    const index=PM.products.findIndex(x=>x.id===pid);
    if(BuscarProdPID(pid)) {
 PM.products.splice(index,1);
 PM.saveProducts();
        res.status(200).send("producto eliminado correctamente");
    }
    else{res.status(400).send("El producto no existe");}
})

    //      funciones auxiliares        //          //
    const BuscarProdPID=(pid)=>{
    const product=PM.products
    const indexBuscado= product.findIndex(prod=> prod.id===pid)
    const productoBuscado=product[indexBuscado];
    return productoBuscado;
    }


PM.initialize();

export { PM,BuscarProdPID };
export default productsRouter;