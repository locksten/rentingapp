import AsyncStorage from "@react-native-async-storage/async-storage"
import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app"
import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
  initializeAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth"
import { getReactNativePersistence } from "firebase/auth/react-native"
import { useEffect, useRef } from "react"
import { useForceUpdate } from "src/utils"

const firebaseConfig = {
  apiKey: "AIzaSyBQ51basYw88ojUlEH62Qak0l-e9vOiwXE",
  authDomain: "rentingapp-57f77.firebaseapp.com",
  projectId: "rentingapp-57f77",
  storageBucket: "rentingapp-57f77.appspot.com",
  messagingSenderId: "191163705084",
  appId: "1:191163705084:web:84ed4bec5050e22bbd5979",
}

let firebaseApp: FirebaseApp
let auth: Auth

if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig)
  auth = initializeAuth(firebaseApp, {
    persistence: getReactNativePersistence(AsyncStorage),
  })
} else {
  firebaseApp = getApp()
  auth = getAuth()
}

export const onAuthStateChange = (fn: () => Promise<void>) => {
  return onAuthStateChanged(auth, async () => {
    await fn()
  })
}

export const getAuthState = () => auth

// const userCredentialKey = "UserCredential"

const setUserCredential = (value: any) => {
  // SecureStore.setItemAsync(userCredentialKey, JSON.stringify(value))
}

export const getUserCredential = () => {
  // SecureStore.getItemAsync(JSON.parse(userCredentialKey))
}

export const clearUserCredential = () => {
  // SecureStore.deleteItemAsync(userCredentialKey)
}

export const emailSignIn = async (email: string, password: string) =>
  await setUserCredential(
    await signInWithEmailAndPassword(auth, email, password),
  )

export const emailSignUp = async (
  email: string,
  password: string,
  displayName: string,
) => {
  if (!displayName) throw new Error("Name is required")
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(credential.user, { displayName })
  await setUserCredential(credential)
}

export const signOut = async () => {
  await clearUserCredential()
  await firebaseSignOut(auth)
}

export const useAuthState = () => {
  const update = useForceUpdate()
  const mountedRef = useRef(true)

  useEffect(() => {
    return onAuthStateChange(async () => {
      if (mountedRef.current) update()
    })
  }, [])

  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  return auth
}

export const useCurrentUser = () => useAuthState().currentUser
