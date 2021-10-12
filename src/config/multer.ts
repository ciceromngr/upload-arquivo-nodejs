import multer, { FileFilterCallback } from "multer"
import path from "path"
import crypto from 'crypto'
import { Request } from "express"
import multerS3 from 'multer-s3'
import aws from 'aws-sdk'

const storageType = {
    local: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'upload'))
        },
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb(err, '')

                const fileName = `${hash.toString('hex')}-${file.originalname}`
                cb(null, fileName)
            })
        }
    }),

    s3: multerS3({
        s3: new aws.S3(),
        bucket: process.env.BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: "public-read",
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            cb(null, Date.now().toString() + '-' + file.originalname)
        }
    })
}

export default {
    dest: path.resolve(__dirname, '..', '..', 'tmp', 'upload'),
    storage: storageType['s3'],
    limits: {

    },
    fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        const allowedMimes = [
            "image/jpeg",
            "image/pjpeg",
            "image/png",
            "image/gif",
            "video/x-ms-wmv",
            "video/x-msvideo",
            "video/quicktime",
            "video/3gpp",
            "video/MP2T",
            "video/mp4",
            "video/x-flv"
        ]

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error('Invalid file type.'))
        }
    }
}