import { MyAccountDetails } from "@components/AccountScreen"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as SecureStore from "expo-secure-store"
import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app"
import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
  initializeAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth"
import { getReactNativePersistence } from "firebase/auth/react-native"
import { useEffect, useReducer, useRef } from "react"
import { isWeb } from "src/utils"
import { useQuery } from "urql"

export const registrationDetails = {
  email: "",
  password: "",
}

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

let triggerAuthStateChanged: (() => Promise<void> | void) | undefined =
  undefined

export const onAuthStateChange = (fn: () => Promise<void> | void) => {
  triggerAuthStateChanged = fn
  return onAuthStateChanged(auth, async () => {
    await fn()
  })
}

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
  if (isWeb) return
  await SecureStore.setItemAsync("email", email)
  await SecureStore.setItemAsync("password", password)
}

export const getEmailPassword = async () => ({
  email: isWeb ? undefined : await SecureStore.getItemAsync("email"),
  password: isWeb ? undefined : await SecureStore.getItemAsync("password"),
})

export const clearEmailPassword = async () => {
  if (isWeb) return
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
  photoURL: string,
) => {
  if (!displayName) throw new Error("Name is required")
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(credential.user, {
    displayName,
    photoURL,
  })
  await saveEmailPassword(email, password)
  await triggerAuthStateChanged?.()
}

export const signOut = async () => {
  await firebaseSignOut(auth)
  await clearEmailPassword()
}

export const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email)
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

export const useUserDetails = () => {
  const user = useCurrentUser()
  const [{ data }] = useQuery({
    query: MyAccountDetails,
    requestPolicy: "cache-and-network",
    pause: !user,
  })
  return data?.me?.user
}
