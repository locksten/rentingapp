import { cert, initializeApp } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { IncomingHttpHeaders } from "http"

initializeApp({
  credential: cert(require("../../firebaseAdminKey.json")),
})

export const decodeFirebaseToken = async (token?: string) => {
  if (!token) return undefined
  try {
    return await getAuth().verifyIdToken(token)
  } catch (e) {
    return undefined
  }
}

export const getToken = ({ authorization }: IncomingHttpHeaders) =>
  authorization?.startsWith("Bearer ") ? authorization.slice(7) : undefined

export const decodedFirebaseTokenFromHeader = (headers: IncomingHttpHeaders) =>
  decodeFirebaseToken(getToken(headers))

export const getFirebaseUserById = (id?: string) =>
  id ? getAuth().getUser(id) : undefined

export const disableFirebaseAccount = (id: string) =>
  getAuth().updateUser(id, { disabled: true })
