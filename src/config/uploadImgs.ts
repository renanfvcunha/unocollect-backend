import multer from 'multer'
import path from 'path'

function pStart (num: number): string {
  return num.toString().padStart(2, '0')
}

const uploadImgs = multer({
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', 'uploads', 'formImages'),
    filename (req, file, cb) {
      const ext = file.originalname.split('.').pop()

      const date = new Date()

      const fileName = `IMG_${date.getFullYear().toString()}${pStart(
        date.getMonth() + 1
      )}${pStart(date.getDate())}_${pStart(date.getHours())}${pStart(
        date.getMinutes()
      )}${pStart(date.getSeconds())}${date.getMilliseconds().toString()}.${ext}`

      cb(null, fileName)
    }
  }),
  fileFilter: (req, file, cb) => {
    const isAccepted = ['image/png', 'image/jpg', 'image/jpeg'].find(
      acceptedFormat => acceptedFormat === file.mimetype
    )

    if (!isAccepted) {
      return cb(null, false)
    }

    return cb(null, true)
  }
})

export default uploadImgs
