import multer from 'multer'
import path from 'path'

function pStart (num: number): string {
  return num.toString().padStart(2, '0')
}

export default {
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', 'uploads', 'formImages'),
    filename (request, file, callback) {
      const ext = file.mimetype.split('/')[1]

      const date = new Date()

      const fileName = `IMG_${date.getFullYear().toString()}${pStart(
        date.getMonth() + 1
      )}${pStart(date.getDate())}_${pStart(date.getHours())}${pStart(
        date.getMinutes()
      )}${pStart(date.getSeconds())}${date.getMilliseconds().toString()}.${ext}`

      callback(null, fileName)
    }
  })
}
