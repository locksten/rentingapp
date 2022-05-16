import { manipulateAsync, SaveFormat } from "expo-image-manipulator"
import * as ImagePicker from "expo-image-picker"
import { useState } from "react"
import { Platform } from "react-native"
import { isWeb, serverUrl } from "src/utils"

export const useUploadNative = () => {
  const [uploadedImageUri, setUploadedImageUri] = useState<string>()
  const [isImageSelected, setIsImageSelected] = useState(false)

  return {
    isImageSelected,
    uploadedImageUri,
    pickImage: () =>
      uploadNative(() => setIsImageSelected(true), setUploadedImageUri),
  }
}

const uploadNative = async (
  onSelect?: () => void,
  onUpload?: (uri: string) => void,
) => {
  console.log("uploadNative")
  const selected = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
  })
  if (selected.cancelled) return
  onSelect?.()

  if (!selected || selected.cancelled) return
  const image =
    selected.width > 1920 || selected.height > 1080
      ? await manipulateAsync(
          selected.uri,
          [
            {
              resize: {
                width: 1920,
                height: selected.height / (selected.width / 1920),
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

  const endpoint = `${serverUrl}/graphql/listing/image`
  const response = await fetch(endpoint, {
    method: "POST",
    headers: isWeb
      ? undefined
      : {
          "content-type": "multipart/form-data",
        },
    body: formData,
  })
  const uri = (await response.json()).url
  onUpload?.(uri)
}
