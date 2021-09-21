import express from 'express'
import fs from 'fs-extra'
import multer from 'multer'
import {join} from 'path'
import path from 'path'

const writeFile = fs.writeFile
const filesRouter = express.Router()
export const publicFolderPath = path.join(process.cwd(), "/public")
const saveProductImage = (name, contentAsBuffer) => writeFile (join(publicFolderPath, name),contentAsBuffer)


filesRouter.post("/product/:id/upload",multer().single('productImage'),async (req,res,next) => {
    try {
        console.log(req.file)

     await saveProductImage(req.file.originalname, req.file.buffer)
        res.send("Uploaded!")
    } catch (error) {
        next(error)
    }
})

filesRouter.post("/product/:id/uploadMultiple",multer().array('productImage'),async (req,res,next) => {
    try {
        console.log(req.files)
const arrayOfPromises = req.files.map(file => saveProductImage(file.originalname, file.buffer))
     await Promise.all(arrayOfPromises)
        res.send("Uploaded!")
    } catch (error) {
        next(error)
    }
})


export default filesRouter