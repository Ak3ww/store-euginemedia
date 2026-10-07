/**
 * RapidAPI Hub - Cek Resi Cek Ongkir Service
 * Host: cek-resi-cek-ongkir.p.rapidapi.com
 */

const RAPIDAPI_KEY =
  process.env.RAPIDAPI_KEY || "41b364c643msh3dca42b0ea9382bp13fd2bjsnf190e99cc7c7";
const RAPIDAPI_HOST = "cek-resi-cek-ongkir.p.rapidapi.com";
const BASE_URL = `https://${RAPIDAPI_HOST}`;

// Standard courier to logisticId mapping based on RapidAPI /general/logistics
export const COURIER_LOGISTIC_IDS: Record<string, number> = {
  jne: 1,
  rpx: 3,
  sicepat: 5,
  jnt: 9,
  "j&t": 9,
  ninja: 15,
  lion: 16,
  indah: 38,
  anteraja: 39,
  shopee: 40,
  spx: 40,
  sentral: 52,
};

export async function fetchLogisticsList() {
  try {
    const res = await fetch(`${BASE_URL}/general/logistics`, {
      headers: {
        "x-rapidapi-host": RAPIDAPI_HOST,
        "x-rapidapi-key": RAPIDAPI_KEY,
      },
      next: { revalidate: 86400 }, // Cache 24 hours
    });
    return await res.json();
  } catch (error) {
    console.error("[RapidAPI Logistics Error]:", error);
    return { success: false, results: [] };
  }
}

export async function searchAreaAutocomplete(query: string) {
  try {
    const res = await fetch(`${BASE_URL}/general/autocomplete?q=${encodeURIComponent(query)}`, {
      headers: {
        "x-rapidapi-host": RAPIDAPI_HOST,
        "x-rapidapi-key": RAPIDAPI_KEY,
      },
    });
    return await res.json();
  } catch (error) {
    console.error("[RapidAPI Autocomplete Error]:", error);
    return { success: false, results: [] };
  }
}

export async function trackOrderResi(courier: string, trackingNumber: string) {
  try {
    const cleaned = courier.toLowerCase().replace(/[^a-z0-9]/g, "");
    let logisticId = COURIER_LOGISTIC_IDS[cleaned] || 1; // Default to JNE (1)

    // Match partial courier name
    for (const [key, id] of Object.entries(COURIER_LOGISTIC_IDS)) {
      if (cleaned.includes(key)) {
        logisticId = id;
        break;
      }
    }

    const res = await fetch(
      `${BASE_URL}/tracking?logisticId=${logisticId}&trackingNumber=${encodeURIComponent(
        trackingNumber.trim()
      )}`,
      {
        headers: {
          "x-rapidapi-host": RAPIDAPI_HOST,
          "x-rapidapi-key": RAPIDAPI_KEY,
        },
        cache: "no-store",
      }
    );

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("[RapidAPI Tracking Error]:", error);
    return {
      success: false,
      message: "Gagal menghubungkan ke server pelacakan kurir",
      results: null,
    };
  }
}
