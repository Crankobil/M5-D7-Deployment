import express from "express";
import fs from "fs";
import uniqid from "uniqid";
import path, { dirname } from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const comFilePath = path.join(__dirname, "reviews.json");
const reviewsRouter = express.Router();


// get all comments
reviewsRouter.get("/", async (req, res, next) => {
  try {
    const fileAsBuffer = fs.readFileSync(comFilePath);
    const fileAsString = fileAsBuffer.toString();
    const fileAsJSON = JSON.parse(fileAsString);
    res.send(fileAsJSON);
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});


// create  a comment
reviewsRouter.post("/", async (req, res, next) => {
  try {
    const { comment, rate, productId } = req.body;
    const reviews = {
      id: uniqid(),
      comment,
      rate,
      productId ,
      createdAt: new Date(),      
    };

    const fileAsBuffer = fs.readFileSync(comFilePath);
    const fileAsString = fileAsBuffer.toString();
    const fileAsJSONArray = JSON.parse(fileAsString);
    fileAsJSONArray.push(reviews);
    fs.writeFileSync(comFilePath, JSON.stringify(fileAsJSONArray));
    res.send(reviews);
    
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});



// get single comment
reviewsRouter.get("/:id", async (req, res, next) => {
  try {
    const fileAsBuffer = fs.readFileSync(comFilePath);
    const fileAsString = fileAsBuffer.toString();
    const fileAsJSONArray = JSON.parse(fileAsString);
    const comment = fileAsJSONArray.find(
      (comment) => comment.id === req.params.id
    );
    if (!comment) {
      res
        .status(404)
        .send({ message: `Comment with ${req.params.id} is not found!` });
    }
    res.send(comment);
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});



// delete  comment
reviewsRouter.delete("/:id", async (req, res, next) => {
  try {
    const fileAsBuffer = fs.readFileSync(comFilePath);
    const fileAsString = fileAsBuffer.toString();
    let fileAsJSONArray = JSON.parse(fileAsString);
    const comment = fileAsJSONArray.find(
      (comment) => comment.id === req.params.id
    );
    if (!comment) {
      res
        .status(404)
        .send({ message: `Comment with ${req.params.id} is not found!` });
    }
    fileAsJSONArray = fileAsJSONArray.filter(
      (comment) => comment.id !== req.params.id
    );
    fs.writeFileSync(comFilePath, JSON.stringify(fileAsJSONArray));
    res.status(204).send();
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});



//  update comment
reviewsRouter.put("/:id", async (req, res, next) => {
  try {
    const fileAsBuffer = fs.readFileSync(comFilePath);
    const fileAsString = fileAsBuffer.toString();
    let fileAsJSONArray = JSON.parse(fileAsString);
    const commentIndex = fileAsJSONArray.findIndex(
      (comment) => comment.id === req.params.id
    );
    if (!commentIndex == -1) {
      res
        .status(404)
        .send({ message: `Comment with ${req.params.id} is not found!` });
    }
    const previousAuthorData = fileAsJSONArray[authorIndex];
    const changedAuthor = {
      ...previousAuthorData,
      ...req.body,
      updatedAt: new Date(),
      id: req.params.id,
    };
    fileAsJSONArray[authorIndex] = changedAuthor;

    fs.writeFileSync(comFilePath, JSON.stringify(fileAsJSONArray));
    res.send(changedAuthor);
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

export default reviewsRouter;