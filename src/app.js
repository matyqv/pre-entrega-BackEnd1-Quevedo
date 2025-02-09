import express from "express";
import http from "http";
import { engine } from "express-handlebars";
import HomeRouter from "./routes/home.router.js";
import realTimeProductsRouter from "./routes/realTimeProducts.router.js";
import { Server } from "socket.io";
import productsManager from "../public/js/products.js";

const app = express();
const server = http.createServer(app);
const PORT = 8080;
const io = new Server(server);

app.use(express.static("public"));

//handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//endpoints
app.use("/", HomeRouter);
app.use("/realTimeProducts", realTimeProductsRouter);


const PM=productsManager;
//websockets
io.on("connection", (socket)=> {  

  const enviarProductos=()=>{
    const products=PM.products;
     socket.emit("recibir-productos", products);
     console.log("pedir productos")  ;}

  socket.on("pedir productos",()=>
  {enviarProductos();
  });

  socket.on("nuevo-producto",(data)=>
    {
       console.log("nuevo-producto");
       data.id=PM.GenerarIDUnica();
       PM.addObject(data);
       enviarProductos();
    });

    socket.on("eleminar-producto",(idprod)=>{
        PM.deleteProduct(idprod);
        enviarProductos();
    });



});

server.listen(PORT, ()=> {
    console.log("Servidor iniciado correctamente.");
  });
