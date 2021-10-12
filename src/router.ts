import { Router } from "express";
import multer from 'multer'
import { getCustomRepository } from "typeorm";
import multerConfig from "./config/multer";
import { UploadingRepository } from "./repository/UploadingRepository";
const router = Router()

router.post('/post', multer(multerConfig).single('file') , async (req, res) => {
    const uploadingRespository = getCustomRepository(UploadingRepository)

    const { originalname: name, filename: key, size, path} = req.file

    if(path !== undefined) {

        const postsUploading = uploadingRespository.create({
            name,
            key,
            size,
            url: 'path'
        })
    
        await uploadingRespository.save(postsUploading)
        return res.json(postsUploading)
    }

    return res.json({ message: 'error' })

})

export { router }