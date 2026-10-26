import { Alert, Platform } from "react-native";

export function konfirmasi(
  judul: string,
  pesan: string,
  teksOk: string,
  onOk: () => void
): void {
  if (Platform.OS === "web") {
    if (window.confirm(judul + "\n" + pesan)) {
      onOk();
    }
    return;
  }

  Alert.alert(judul, pesan, [
    { text: "Batal", style: "cancel" },
    { text: teksOk, style: "destructive", onPress: onOk },
  ]);
}