import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints"
import filesRouter from "./services/files/index.js";
import productRouter from "./services/products/index.js";
import {publicFolderPath} from './services/files/index.js'



const server = express();
const PORT = 3001;


//******************** GLOBAL MIDDLEWARE ******************/
server.use(express.static(publicFolderPath))
server.use(cors());
server.use(express.json());

//******************** ENDPOINTS **************************/
server.use("/files", filesRouter);
server.use("/products", productRouter);

server.listen(PORT, () => console.log("Server is running on port : ", PORT));


console.table(listEndpoints(server))

server.on("error", (error) =>
  console.log(` Server stopped : ${error}`)
);