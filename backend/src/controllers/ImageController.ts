import * as fs from "fs";
import { ImageModel } from "../models/ImageModel.js";
import sharp from "sharp";

class ImageController {
  public getImage = async (id: string) => {
    const image = await ImageModel.findById(id);
    if (!image) {
      return { ok: false, status: "Image not found" };
    }

    return { ok: true, status: "ok", image };
  };

  public getPreview = async (id: string) => {
    const image = await ImageModel.findById(id);
    if (!image) {
      return { ok: false, status: "Image not found" };
    }

    const previewPath = "." + image.path.split(".")[1] + "_preview.webp";

    if (!fs.existsSync(previewPath)) {
      await new Promise<string>((resolve) => {
        sharp(image.path)
          .resize(300)
          .webp({ quality: 80 })
          .toFile(previewPath, (err) => {
            if (err) {
              console.log(err);
            }
            resolve(previewPath);
          });
      });
    }

    return { ok: true, status: "ok", previewPath };
  };
}

export default new ImageController();
