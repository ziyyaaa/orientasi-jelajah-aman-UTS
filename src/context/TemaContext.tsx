import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { warnaTerang, warnaGelap, PaletWarna } from "../constants/warna";

export type ModeTema = "terang" | "gelap" | "sistem";

const KUNCI_MODE = "@jelajah_aman:mode_tema";

interface NilaiTema {
  mode: ModeTema; // pilihan pengguna
  skema: "terang" | "gelap"; // tema yang benar-benar dipakai
  warna: PaletWarna;
  ubahMode: (modeBaru: ModeTema) => void;
}

const TemaContext = createContext<NilaiTema | null>(null);

export function TemaProvider({ children }: { children: ReactNode }) {
  const skemaSistem = useColorScheme();
  const [mode, setMode] = useState<ModeTema>("sistem");

  // Baca pilihan tersimpan saat aplikasi dibuka
  useEffect(() => {
    AsyncStorage.getItem(KUNCI_MODE)
      .then((nilai) => {
        if (nilai === "terang" || nilai === "gelap" || nilai === "sistem") {
          setMode(nilai);
        }
      })
      .catch(() => {});
  }, []);

  function ubahMode(modeBaru: ModeTema) {
    setMode(modeBaru);
    AsyncStorage.setItem(KUNCI_MODE, modeBaru).catch(() => {});
  }

  const skema: "terang" | "gelap" =
    mode === "sistem" ? (skemaSistem === "dark" ? "gelap" : "terang") : mode;

  const warna = skema === "gelap" ? warnaGelap : warnaTerang;

  return (
    <TemaContext.Provider value={{ mode, skema, warna, ubahMode }}>
      {children}
    </TemaContext.Provider>
  );
}

export function useTema(): NilaiTema {
  const nilai = useContext(TemaContext);
  if (!nilai) {
    throw new Error("useTema harus dipakai di dalam TemaProvider");
  }
  return nilai;
}