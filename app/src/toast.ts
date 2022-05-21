import Toast from "react-native-root-toast"

export const toastError = (message?: string) =>
  Toast.show(message ?? "Something went wrong", {
    duration: Toast.durations.LONG,
    position: Toast.positions.BOTTOM,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0,
    backgroundColor: "#7f1d1d",
    textColor: "#fee2e2",
    textStyle: { fontWeight: "600" },
  })
