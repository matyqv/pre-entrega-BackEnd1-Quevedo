import express from "express";
import productsRouter from "./routes/products.router.js"
import cartRouter from "./routes/carts.router.js"

const app=express();
app.use(express.json());
app.use(express.urlencoded());

app.get('/', (req, res) => {    res.send('Hola Mundo!');  });
  
app.use("/api/products",productsRouter);
app.use("/api/carts",cartRouter);

app.use("/", (req,res)=>{    res.status(200).send("Holis");})

app.listen(8080,()=>{console.log("Servidor iniciado en: http://localhost:8080")});
