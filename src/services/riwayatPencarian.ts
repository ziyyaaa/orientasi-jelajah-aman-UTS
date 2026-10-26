import AsyncStorage from "@react-native-async-storage/async-storage";
import { RiwayatPencarian } from "../../types/riwayat";

const KUNCI_RIWAYAT = "@jelajah_aman:riwayat_pencarian";
export const MAKS_RIWAYAT = 10;

export async function ambilRiwayatPencarian(): Promise<RiwayatPencarian[]> {
  try {
    const json = await AsyncStorage.getItem(KUNCI_RIWAYAT);
    return json ? (JSON.parse(json) as RiwayatPencarian[]) : [];
  } catch {
    return [];
  }
}

// Kota terbaru di paling atas; kota yang sama tidak muncul dua kali; maksimal 10
export async function tambahRiwayatPencarian(
  item: RiwayatPencarian
): Promise<void> {
  const daftar = await ambilRiwayatPencarian();
  const tanpaDuplikat = daftar.filter((r) => r.id !== item.id);
  const daftarBaru = [item, ...tanpaDuplikat].slice(0, MAKS_RIWAYAT);
  await AsyncStorage.setItem(KUNCI_RIWAYAT, JSON.stringify(daftarBaru));
}

export async function hapusSemuaRiwayatPencarian(): Promise<void> {
  await AsyncStorage.removeItem(KUNCI_RIWAYAT);
}