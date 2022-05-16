import { manipulateAsync, SaveFormat } from "expo-image-manipulator"
import * as ImagePicker from "expo-image-picker"
import { useState } from "react"
import { Platform } from "react-native"
import { isWeb, serverUrl } from "src/utils"

export const imageUploadStateMessage: {
  [key in ImageUploadState["status"]]: string
} = {
  error: "Something went wrong",
  uploaded: "Uploaded",
  uploading: "Uploading",
  waiting: "Select Image",
}

type ImageUploadState =
  | { status: "waiting" }
  | { status: "error" }
  | { status: "uploading" }
  | {
      status: "uploaded"
      uri: string
    }

type ImageUploadType = "listing" | "user"

export const useUploadImage = (type: ImageUploadType) => {
  const [imageUpload, setImageUploadState] = useState<ImageUploadState>({
    status: "waiting",
  })

  return {
    imageUpload,
    pickImage: () => uploadNative(type, setImageUploadState),
  }
}

const uploadNative = async (
  type: ImageUploadType,
  setState: (state: ImageUploadState) => void,
) => {
  const selected = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
  })
  if (selected.cancelled) {
    setState({ status: "waiting" })
    return
  }

  setState({ status: "uploading" })
  const image =
    selected.width > 1920 || selected.height > 1080
      ? await manipulateAsync(
          selected.uri,
          [
            {
              resize: {
                width: type === "listing" ? 1920 : 256,
              },
            },
          ],
          { compress: 0.7, format: SaveFormat.JPEG },
        )
      : selected

  const formData = new FormData()
  if (isWeb) {
    formData.append("file", await (await fetch(image.uri)).blob())
  } else {
    let filename = image.uri.split("/").pop()
    let match = filename ? /\.(\w+)$/.exec(filename) : undefined
    let type = match ? `image/${match[1]}` : `image`
    formData.append("file", {
      // @ts-ignore
      uri: Platform.OS === "ios" ? image.uri.replace("file://", "") : image.uri,
      name: filename,
      type,
    })
  }

  const endpoint = `${serverUrl}/${type}/image`
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: isWeb
        ? undefined
        : {
            "content-type": "multipart/form-data",
          },
      body: formData,
    })
    setState({ status: "uploaded", uri: (await response.json()).url })
  } catch (e) {
    setState({ status: "error" })
  }
}
