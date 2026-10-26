import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { typeScale, spacing } from "../../constants/styles";
import { useTema } from "../../context/TemaContext";

export default function Tentang() {
  const { warna } = useTema();

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: warna.latar }}>
      <Text
        accessibilityLabel="Judul halaman Tentang Weather App"
        style={{
          fontSize: typeScale.judul,
          fontWeight: "bold",
          color: warna.teks,
        }}
      >
        Weather App
      </Text>

      <Text
        style={{
          marginTop: spacing.kecil,
          fontSize: typeScale.subjudul,
          color: warna.teks,
        }}
      >
        Aplikasi untuk membantu pengguna melihat informasi cuaca dan kualitas
        udara.
      </Text>

      <Text
        style={{
          marginTop: spacing.sedang,
          fontSize: typeScale.isi,
          color: warna.teksSekunder,
        }}
      >
        Versi 1.0.0
      </Text>
    </SafeAreaView>
  );
}