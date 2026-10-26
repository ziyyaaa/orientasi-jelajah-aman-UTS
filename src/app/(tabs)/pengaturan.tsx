import { useState } from "react";
import { Text, Button, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { hapusSemuaCache } from "../../services/cacheRepository";
import { useTema, ModeTema } from "../../context/TemaContext";

const PILIHAN_TEMA: { nilai: ModeTema; label: string }[] = [
  { nilai: "terang", label: "Terang" },
  { nilai: "gelap", label: "Gelap" },
  { nilai: "sistem", label: "Ikuti Sistem" },
];

export default function TabPengaturan() {
  const { warna, mode, ubahMode } = useTema();
  const [pesan, setPesan] = useState<string | null>(null);

  async function hapusDataTersimpan() {
    await hapusSemuaCache();
    setPesan("Data cuaca tersimpan sudah dihapus.");
  }

  return (
    <SafeAreaView
      style={{ flex: 1, padding: 16, gap: 12, backgroundColor: warna.latar }}
    >
      <Text style={{ fontSize: 18, fontWeight: "bold", color: warna.teks }}>
        Jelajah Aman
      </Text>

      <Text style={{ color: warna.teksSekunder }}>Versi 1.0.0</Text>

      <Text style={{ fontWeight: "bold", color: warna.teks, marginTop: 8 }}>
        Tampilan
      </Text>

      <View style={{ flexDirection: "row", gap: 8 }}>
        {PILIHAN_TEMA.map((pilihan) => {
          const dipilih = mode === pilihan.nilai;
          return (
            <TouchableOpacity
              key={pilihan.nilai}
              onPress={() => ubahMode(pilihan.nilai)}
              accessibilityRole="radio"
              accessibilityState={{ selected: dipilih }}
              accessibilityLabel={"Mode tampilan " + pilihan.label}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 8,
                borderWidth: 1,
                alignItems: "center",
                borderColor: dipilih ? warna.aksen : warna.garis,
                backgroundColor: dipilih ? warna.aksen : warna.kartu,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: dipilih ? "bold" : "normal",
                  color: dipilih ? "#FFFFFF" : warna.teks,
                }}
              >
                {pilihan.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Button
        title="Hapus Data Cuaca Tersimpan"
        onPress={hapusDataTersimpan}
      />

      {pesan && (
        <Text accessibilityLabel={pesan} style={{ color: warna.teks }}>
          {pesan}
        </Text>
      )}
    </SafeAreaView>
  );
}