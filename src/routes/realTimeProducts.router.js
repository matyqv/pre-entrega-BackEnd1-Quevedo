import express from "express";

const realTimeProductsRouter = express.Router();

realTimeProductsRouter.get("/", (req, res)=>{
  res.render("realTimeProducts");
});

export default realTimeProductsRouter;