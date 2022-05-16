import * as AWS from "aws-sdk"
import { Request, Response } from "express"
import { fromBuffer as fileTypeFromBuffer } from "file-type"
import { v4 as uuid } from "uuid"

const url = "https://s3.fr-par.scw.cloud"

const s3 = new AWS.S3({
  endpoint: new AWS.Endpoint(url),
})

const userProfilePhotosBucketName = "rentingapp.user-profile-photos"
const listingImagesBucketName = "rentingapp.listing-images"

type AppStorageBucketName =
  | typeof userProfilePhotosBucketName
  | typeof listingImagesBucketName

export const uploadImage = async (
  bucketName: AppStorageBucketName,
  data: Buffer,
) => {
  const filename = `${uuid()}.jpg`
  try {
    await s3
      .putObject({
        Bucket: bucketName,
        Key: filename,
        Body: data,
        ContentType: "image/jpeg",
        ACL: "public-read",
      })
      .promise()
    return `${url}/${bucketName}/${filename}`
  } catch (e) {
    console.log(`error uploading to ${bucketName}:`, e)
    return undefined
  }
}

export const fileUploadHandler =
  ({
    bucketName,
    sizeLimitMegabytes,
  }: {
    bucketName: AppStorageBucketName
    sizeLimitMegabytes: number
  }) =>
  async (req: Request, res: Response) => {
    const file = req.files?.file
    if (!file || (file && "length" in file)) {
      res.status(400).json({ error: "Number of files should be 1" })
      return
    }

    const fileMegabytes = Buffer.byteLength(file.data) / 1024 / 1024
    if (fileMegabytes > sizeLimitMegabytes) {
      res
        .status(400)
        .json({ error: `File should be smaller than ${sizeLimitMegabytes}MB` })
      return
    }

    const filetype = await fileTypeFromBuffer(file.data)
    if (!filetype || !["image/jpeg", "image/png"].includes(filetype.mime)) {
      res.status(400).json({ error: "Invalid file type" })
      return
    }

    const url = await uploadImage(bucketName, file.data)
    if (!url) {
      res.status(500).json({ error: "Failed to upload" })
      return
    }

    res.status(200).json({ url })
  }
