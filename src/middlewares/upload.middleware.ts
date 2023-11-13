import { Request } from 'express';
import multer from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export class UploadMiddleware {
    upload (file: string) {
        const storageAudio = multer.diskStorage({
            destination: (
                req: Request,
                file: Express.Multer.File,
                callback: (error: Error | null, destination: string) => void
            ) => {
                callback(null, path.join(__dirname, '../../public/audio'))
            },
            filename: (
                req: Request,
                file: Express.Multer.File,
                callback: (error: Error | null, filename: string) => void
            ) => {
                callback(null, `${uuidv4()}-${file.originalname}`)
            }
        })

        const storageImage = multer.diskStorage({
            destination: (
                req: Request,
                file: Express.Multer.File,
                callback: (error: Error | null, destination: string) => void
            ) => {
                callback(null, path.join(__dirname, '../../public/image'))
            },
            filename: (
                req: Request,
                file: Express.Multer.File,
                callback: (error: Error | null, filename: string) => void
            ) => {
                callback(null, `${uuidv4()}-${file.originalname}`)
            }
        })

        const uploadAudio = multer({
            storage: storageAudio,
            fileFilter: (
                req: Request,
                file: Express.Multer.File,
                callback: (error: Error | null, acceptFile: boolean) => void
            ) => {
                if (file.mimetype === 'audio/mpeg') {
                    callback(null, true)
                } else {
                    callback(null, false)
                }
            }
        })

        const uploadImage = multer({
            storage: storageImage,
            fileFilter: (
                req: Request,
                file: Express.Multer.File,
                callback: (error: Error | null, acceptFile: boolean) => void
            ) => {
                if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
                    callback(null, true)
                } else {
                    callback(null, false)
                }
            }
        })

        return (req: Request, res: any, next: any) => {
            if (file === 'audio') {
                uploadAudio.single('audio')(req, res, next)
            } else if (file === 'image') {
                uploadImage.single('image')(req, res, next)
            }
        }
    }
}
