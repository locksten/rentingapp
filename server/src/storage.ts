import * as AWS from "aws-sdk"
import { v4 as uuid } from "uuid"

const url = "https://s3.fr-par.scw.cloud"

const s3 = new AWS.S3({
  endpoint: new AWS.Endpoint(url),
})

const listingImagesBucketName = "rentingapp.listing-images"

export const uploadListingImage = async (data: Buffer) => {
  const filename = `${uuid()}.jpg`
  try {
    await s3
      .putObject({
        Bucket: listingImagesBucketName,
        Key: filename,
        Body: data,
        ContentType: "image/jpeg",
        ACL: "public-read",
      })
      .promise()
    return `${url}/${listingImagesBucketName}/${filename}`
  } catch (e) {
    console.log("error uploading listing image:", e)
    return undefined
  }
}
