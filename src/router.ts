import { Router } from "express";
import multer from 'multer'
import ytdl from 'ytdl-core'
import fs from 'fs'
import path from 'path'
import request from 'request'
import shortid from 'shortid'
import { getCustomRepository } from "typeorm";
import multerConfig from "./config/multer";
import { UploadingRepository } from "./repository/UploadingRepository";

const router = Router()

router.get('/post', async (req, res) => {
    const uploadingRespository = getCustomRepository(UploadingRepository)
    const date = await uploadingRespository.find()
    return res.json(date)

})

router.post('/post', multer(multerConfig).single('file'), async (req, res) => {

    const uploadingRespository = getCustomRepository(UploadingRepository)

    if (req.file.location !== undefined) {
        const { originalname: name, filename: key, size, location: url } = req.file
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

router.post('/download/videos/', async (req, res) => {
    const { url } = req.query

    // se a pessoa quiser definir uma extencion para o video ela poderar mandar pelo request extension
    const extension: string = req.body.extension

    if (!url) return res.json({ message: 'insirir uma url para download' })

    const date = shortid.generate()

    res.header("Content-Disposition", `attachmentt: filename="video-${date}"`)

    const allowedMimes = ["x-ms-wmv", "x-msvideo", "quicktime", "3gpp", "MP2T", "mp4", "x-flv"]

    
    for (var video in allowedMimes) {

        const mime = allowedMimes.find(t => t.indexOf(extension) !== -1)
        
        if (mime || extension === undefined) {

            ytdl(url.toString())
                .pipe(fs.createWriteStream(
                    path.resolve(__dirname, '..', 'tmp', 'download', 'videos',
                        `${date}_video.${extension ? mime : 'mp4'}`)))

            return res.json({ message: 'Download video sucess' })

        } else {

            return res.json({ error: 'Extencion filed!' })
        }
    }
})


const download = (url: string, path: string, callback: any) => {
    request.head(url, (err, res, body) => {
        request(url)
            .pipe(fs.createWriteStream(path))
            .on('close', callback)
    })
}

router.get('/downlaod/images/', async (req, res) => {
    const { url } = req.query
    const date = shortid.generate()

    const allowedMimes = [".jpeg", ".jpg", ".pjpeg", ".png", ".gif"]

    for (var img in allowedMimes) {
        if (url.toString().includes(allowedMimes[img])) {
            download(
                url.toString(),
                path.resolve(__dirname, '..', 'tmp', 'download', 'images', `${date}_image${allowedMimes[img]}`),
                () => {
                    return res.json({ message: 'Download image sucess' })
                })
        }
    }
})

export { router }