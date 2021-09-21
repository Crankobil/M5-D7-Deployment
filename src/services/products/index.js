import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
import uniqid from "uniqid";

const productRouter = express.Router();

const path = join(dirname(fileURLToPath(import.meta.url)), "products.json");
console.log(path);
const readProducts = () => JSON.parse(fs.readFileSync(path));
const writeProduct = (data) => fs.writeFileSync(path, JSON.stringify(data));

//POST
productRouter.post("/", (request, response, next) => {
  try {
    const newProduct = { ...request.body, id: uniqid(), createdAt: new Date() };
    const products = readProducts();
    console.log("allProducts------->", products);
    products.push(newProduct);
    writeProduct(products);
    response.status(201).send(newProduct.id);
  } catch (error) {
    console.log(error);
  }
});
//GET
productRouter.get("/", (request, response, next) => {
  try {
    const getProducts = readProducts();
    if (getProducts) response.status(200).send(getProducts);
    else response.status(404).send("products not found");
  } catch (error) {
    console.log(error);
  }
});
//GET
productRouter.get("/:productId", (request, response, next) => {
  try {
    const getProducts = readProducts();
    const singleProduct = getProducts.find(
      (p) => p.id === request.params.productId
    );
    if (singleProduct) {
      response.status(200).send(singleProduct);
    } else {
      response.status(404).send("Product Not Found");
    }
  } catch (error) {
    console.log(error);
  }
});
//PUT
productRouter.put("/:productId", (request, response, next) => {
  try {
    const products = readProducts();
    const singleProduct = products.filter(
      (product) => product.id === request.params.productId
    );
    const updatePost = {
      ...request.body,
      id: request.params.productId,
      updatedAt: new Date(),
    };
    singleProduct.push(products);
    writeProduct(updatePost);
    response.status(201).send(updatePost);
  } catch (error) {}
});
//DELETE
productRouter.delete("/:productId", (request, response, next) => {
  try {
    const products = readProducts();
    const delProduct = products.find(
      (product) => product.id !== request.params.productId
    );
    writeProduct(delProduct);
    response.status(204).send("Product Deleted Successfully");
  } catch (error) {
    console.log(error);
  }
});
export default productRouter;