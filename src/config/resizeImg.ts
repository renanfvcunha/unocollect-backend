import sharp from 'sharp'
import fs from 'fs'

export default async (
  file: Express.Multer.File,
  size: number
): Promise<void> => {
  await sharp(file.path)
    .metadata()
    .then(async info => {
      if (info.width > info.height && info.width > size) {
        if (info.orientation === 1) {
          return sharp(file.path)
            .resize(size, null)
            .toBuffer()
            .then(data => {
              fs.writeFile(file.path, data, err => {
                if (err) {
                  throw err
                }
              })
            })
        } else {
          return sharp(file.path)
            .rotate()
            .resize(null, size)
            .toBuffer()
            .then(data => {
              fs.writeFile(file.path, data, err => {
                if (err) {
                  throw err
                }
              })
            })
        }
      } else if (info.width < info.height && info.height > size) {
        return sharp(file.path)
          .resize(null, size)
          .toBuffer()
          .then(data => {
            fs.writeFile(file.path, data, err => {
              if (err) {
                throw err
              }
            })
          })
      }
    })
    .catch(err => console.log(err))
}
