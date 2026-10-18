import { API_URL } from "@/utils/constants";
/** Successful response for the lifetime of the SPA tab — avoids repeat GETs on remount / navigation. */
let platformStatsResolved = null;
/** Single in-flight promise — avoids duplicate GETs (e.g. React Strict Mode double mount). */
let platformStatsInflight = null;
export function fetchPlatformStatsOnce() {
    if (platformStatsResolved) {
        return Promise.resolve(platformStatsResolved);
    }
    if (!platformStatsInflight) {
        platformStatsInflight = (async () => {
            const response = await fetch(`${API_URL}/platform-stats`, {
                cache: "no-store",
            });
            const result = (await response.json());
            if (!response.ok || !result.success || !result.data || typeof result.data !== "object") {
                throw new Error("platform-stats invalid response");
            }
            platformStatsResolved = result.data;
            return platformStatsResolved;
        })().catch((err) => {
            platformStatsInflight = null;
            throw err;
        });
    }
    return platformStatsInflight;
}
