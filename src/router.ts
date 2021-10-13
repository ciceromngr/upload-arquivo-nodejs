import { Router } from "express";
import multer from 'multer'
import ytdl from 'ytdl-core'
import fs from 'fs'
import path from 'path'
import shortid from 'shortid'
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

router.get('/', async (req, res) => {
    const { url } = req.query
    if(!url) return res.json({ message: 'insirir uma url para download' })
    const date = shortid.generate()
    res.header("Content-Disposition", `attachmentt: filename="video-${date}"`)
    ytdl(url.toString()).pipe(fs.createWriteStream(path.resolve(__dirname, '..', 'tmp', 'download', date + '_' + 'video.mp4')))
    return res.send(req.url)
})

export { router }