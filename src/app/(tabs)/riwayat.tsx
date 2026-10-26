// src/app/(tabs)/riwayat.tsx
import { useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, Button } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { ambilSemuaFavorit, hapusFavorit } from "../../services/favoritStorage";
import { ambilRiwayatPencarian } from "../../services/riwayatPencarian";
import { konfirmasi } from "../../utils/konfirmasi";
import { useTema } from "../../context/TemaContext";
import { KotaFavorit } from "../../../types/favorit";
import { RiwayatPencarian } from "../../../types/riwayat";

export default function TabRiwayat() {
  const { warna } = useTema();
  const [riwayat, setRiwayat] = useState<RiwayatPencarian[]>([]);
  const [daftarFavorit, setDaftarFavorit] = useState<KotaFavorit[]>([]);

  useFocusEffect(
    useCallback(() => {
      ambilRiwayatPencarian().then(setRiwayat);
      ambilSemuaFavorit().then(setDaftarFavorit);
    }, [])
  );

  // Buka Beranda: kotak cari terisi dan cuaca kota itu langsung dimuat
  function cariUlang(item: RiwayatPencarian) {
    router.navigate({
      pathname: "/",
      params: {
        cari: item.nama,
        id: String(item.id),
        lat: String(item.latitude),
        lon: String(item.longitude),
        t: String(Date.now()), // penanda agar kota yang sama tetap memicu pencarian
      },
    });
  }

  function hapusFavoritItem(kota: KotaFavorit) {
    konfirmasi(
      "Konfirmasi Hapus",
      "Yakin hapus " + kota.nama + " dari favorit?",
      "Hapus",
      async () => {
        await hapusFavorit(kota.id);
        setDaftarFavorit(await ambilSemuaFavorit());
      }
    );
  }

  const judulSection = {
    fontSize: 16,
    fontWeight: "bold" as const,
    color: warna.teks,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: warna.latar }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 24 }}>
        {/* Riwayat pencarian */}
        <View style={{ gap: 4 }}>
          <Text style={judulSection}>
            Riwayat Pencarian ({riwayat.length}/10)
          </Text>

          {riwayat.length === 0 && (
            <Text style={{ color: warna.teksSekunder }}>
              Belum ada riwayat pencarian
            </Text>
          )}

          {riwayat.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => cariUlang(item)}
              accessibilityLabel={"Cari ulang " + item.nama}
              style={{ paddingVertical: 6 }}
            >
              <Text style={{ color: warna.teks }}>
                {item.nama}
                {item.admin1 ? ", " + item.admin1 : ""}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Kota favorit */}
        <View style={{ gap: 4 }}>
          <Text style={judulSection}>Kota Favorit</Text>
          <Text style={{ color: warna.teksSekunder }}>
            Tersimpan {daftarFavorit.length} kota
          </Text>

          {daftarFavorit.length === 0 && (
            <Text style={{ color: warna.teksSekunder }}>
              Belum ada kota favorit
            </Text>
          )}

          {daftarFavorit.map((kota) => (
            <View
              key={kota.id}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ color: warna.teks }}>{kota.nama}</Text>
              <Button
                title="Hapus"
                color={warna.bahaya}
                onPress={() => hapusFavoritItem(kota)}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}