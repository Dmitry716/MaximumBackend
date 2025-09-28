import { diskStorage } from "multer"
import * as path from "path"
import * as dotenv from "dotenv"

dotenv.config()

export const multerOptions = {
  storage: diskStorage({
    destination: path.resolve(process.env.USE_RELATIVE_PATH === "true" ? process.env.UPLOAD_DIRECTORY : "uploads"),
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname}`
      cb(null, uniqueName)
    },
  }),
}
