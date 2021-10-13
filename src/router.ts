import { Router } from "express";
import multer from 'multer'
import { getCustomRepository } from "typeorm";
import multerConfig from "./config/multer";
import { UploadingRepository } from "./repository/UploadingRepository";
const router = Router()

router.post('/post', multer(multerConfig).single('file') , async (req, res) => {
    const uploadingRespository = getCustomRepository(UploadingRepository)
    if(req.file.location !== undefined) {
        const { originalname: name, filename: key, size, location: url} = req.file
        const postsUploading = uploadingRespository.create({
            name,
            key,
            size,
            url
        })
        
        await uploadingRespository.save(postsUploading)
        return res.json(postsUploading)
    }
    return res.json({ message: 'error' })

})

export { router }