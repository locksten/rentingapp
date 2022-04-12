import AsyncStorage from "@react-native-async-storage/async-storage"
import * as SecureStore from "expo-secure-store"
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
import { useEffect, useReducer, useRef } from "react"

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

export const getAuthState = () => auth

export const onAuthStateChange = (fn: () => Promise<void>) =>
  onAuthStateChanged(auth, async () => {
    await fn()
  })

{
  const unsubscribe = onAuthStateChange(async () => {
    unsubscribe()
    try {
      if (!auth.currentUser) {
        const { email, password } = await getEmailPassword()
        if (!(email && password)) return
        await signInWithEmailAndPassword(auth, email, password)
      }
    } catch (e) {}
  })
}

export const saveEmailPassword = async (email: string, password: string) => {
  await SecureStore.setItemAsync("email", email)
  await SecureStore.setItemAsync("password", password)
}

export const getEmailPassword = async () => ({
  email: await SecureStore.getItemAsync("email"),
  password: await SecureStore.getItemAsync("password"),
})

export const clearEmailPassword = async () => {
  await SecureStore.deleteItemAsync("email")
  await SecureStore.deleteItemAsync("password")
}

export const emailSignIn = async (email: string, password: string) => {
  await signInWithEmailAndPassword(auth, email, password)
  await saveEmailPassword(email, password)
}

export const emailSignUp = async (
  email: string,
  password: string,
  displayName: string,
) => {
  await createUserWithEmailAndPassword(auth, email, password)
  if (!displayName) throw new Error("Name is required")
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(credential.user, {
    displayName,
    photoURL:
      "https://images.unsplash.com/photo-1621983266286-09645be8fd01?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=64&q=80",
  })
  await saveEmailPassword(email, password)
}

export const signOut = async () => {
  await firebaseSignOut(auth)
  await clearEmailPassword()
}

export const useForceUpdate = () => {
  return useReducer(() => ({}), {})[1] as () => void
}

export const useAuthState = () => {
  const update = useForceUpdate()
  const mountedRef = useRef(true)

  useEffect(() => {
    return onAuthStateChange(async () => {
      if (mountedRef.current) update()
    })
  }, [update])

  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  return auth
}

export const useCurrentUser = () => useAuthState().currentUser
