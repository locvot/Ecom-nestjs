import { Injectable } from '@nestjs/common'
import { S3Service } from 'src/shared/services/s3.service'
import { unlink } from 'fs/promises'

@Injectable()
export class MediaService {
  constructor(private readonly s3Service: S3Service) {}

  async uploadFile(files: Array<Express.Multer.File>) {
    const result = await Promise.all(
      files.map((file) => {
        return this.s3Service
          .uploadedFile({
            filename: 'images/' + file.filename,
            filepath: file.path,
            contentType: file.mimetype,
          })
          .then((res) => {
            return { url: res.Location }
          })
      }),
    ).catch(async (error) => {
      await Promise.all(files.map((file) => unlink(file.path)))
      throw error
    })

    await Promise.all(
      files.map((file) => {
        return unlink(file.path)
      }),
    )
    return result
  }
}
