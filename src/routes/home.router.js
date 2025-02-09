import express from "express";
import productsManager from "../../public/js/products.js";

const HomeRouter = express.Router();
const pm=productsManager;
pm.initialize();

HomeRouter.get("/", (req, res)=>{
  const products=pm.products;
  res.render("home",{products});
});

export default HomeRouter;