import { useState } from "react";
import { View, TextInput } from "react-native";
import { useTema } from "../context/TemaContext";

interface SearchBoxProps {
  onCari: (teks: string) => void;
  nilai?: string; // opsional: jika diisi, kotak cari mengikuti nilai dari luar
}

export default function SearchBox({ onCari, nilai }: SearchBoxProps) {
  const { warna } = useTema();
  const [teks, setTeks] = useState("");
  const teksTampil = nilai !== undefined ? nilai : teks;

  function handleChange(nilaiBaru: string) {
    setTeks(nilaiBaru);
    onCari(nilaiBaru);
  }

  return (
    <View>
      <TextInput
        placeholder="Cari nama kota..."
        placeholderTextColor={warna.teksSekunder}
        value={teksTampil}
        onChangeText={handleChange}
        accessibilityLabel="Cari cuaca untuk kota yang dimasukkan"
        style={{
          borderWidth: 1,
          padding: 8,
          borderRadius: 8,
          borderColor: warna.garis,
          color: warna.teks,
          backgroundColor: warna.kartu,
        }}
      />
    </View>
  );
}