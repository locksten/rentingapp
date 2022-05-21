import React from "react"
import { AppRoot } from "./src/components/AppRoot"
import { RootSiblingParent } from "react-native-root-siblings"

export default function App() {
  return (
    <RootSiblingParent>
      <AppRoot />
    </RootSiblingParent>
  )
}
