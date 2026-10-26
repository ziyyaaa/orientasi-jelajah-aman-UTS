// src/services/cacheRepository.web.ts
// Versi web: di browser cache disimpan di AsyncStorage (localStorage).
// Nama fungsi sama dengan versi HP (cacheRepository.ts).
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DataCuacaLengkap, DataKualitasUdara } from "../../types/weather";
import {
  DataTersimpan,
  KotaUntukCache,
  RingkasanKotaTersimpan,
} from "../../types/cache";

const KUNCI_CACHE = "@jelajah_aman:cache_cuaca";

interface BarisCache {
  kunci: string;
  kota_id: number;
  nama_kota: string;
  latitude: number;
  longitude: number;
  cuaca: DataCuacaLengkap;
  kualitasUdara: DataKualitasUdara;
  disimpanPada: number;
}

export function buatKunci(latitude: number, longitude: number): string {
  return `${latitude.toFixed(2)},${longitude.toFixed(2)}`;
}

async function bacaSemua(): Promise<BarisCache[]> {
  try {
    const json = await AsyncStorage.getItem(KUNCI_CACHE);
    return json ? (JSON.parse(json) as BarisCache[]) : [];
  } catch {
    return [];
  }
}

async function tulisSemua(daftar: BarisCache[]): Promise<void> {
  await AsyncStorage.setItem(KUNCI_CACHE, JSON.stringify(daftar));
}

export async function simpanCache(
  kota: KotaUntukCache,
  cuaca: DataCuacaLengkap,
  kualitasUdara: DataKualitasUdara
): Promise<void> {
  const kunci = buatKunci(kota.latitude, kota.longitude);
  const daftar = (await bacaSemua()).filter((b) => b.kunci !== kunci);

  daftar.push({
    kunci,
    kota_id: kota.id,
    nama_kota: kota.nama,
    latitude: kota.latitude,
    longitude: kota.longitude,
    cuaca,
    kualitasUdara,
    disimpanPada: Date.now(),
  });

  await tulisSemua(daftar);
}

export async function ambilCache(
  latitude: number,
  longitude: number
): Promise<DataTersimpan | null> {
  const kunci = buatKunci(latitude, longitude);
  const baris = (await bacaSemua()).find((b) => b.kunci === kunci);

  if (!baris) return null;

  return {
    cuaca: baris.cuaca,
    kualitasUdara: baris.kualitasUdara,
    disimpanPada: baris.disimpanPada,
  };
}

export async function daftarKotaTersimpan(): Promise<RingkasanKotaTersimpan[]> {
  const semua = await bacaSemua();

  return semua
    .sort((a, b) => b.disimpanPada - a.disimpanPada)
    .slice(0, 5)
    .map((b) => ({
      kunci: b.kunci,
      id: b.kota_id,
      nama: b.nama_kota,
      latitude: b.latitude,
      longitude: b.longitude,
      disimpanPada: b.disimpanPada,
    }));
}

export async function bersihkanCacheLama(batasUmurMs: number): Promise<void> {
  const batas = Date.now() - batasUmurMs;
  const daftar = (await bacaSemua()).filter((b) => b.disimpanPada >= batas);

  await tulisSemua(daftar);
}

export async function hapusSemuaCache(): Promise<void> {
  await AsyncStorage.removeItem(KUNCI_CACHE);
}

export async function hapusCacheKota(kunci: string): Promise<void> {
  const daftar = (await bacaSemua()).filter((b) => b.kunci !== kunci);

  await tulisSemua(daftar);
}