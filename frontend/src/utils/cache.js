export const SCAN_CACHE_KEY = "cropdoc_scan_history";

export function getScanHistory() {
  try {
    const data = localStorage.getItem(SCAN_CACHE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to parse scan history:", error);
    return [];
  }
}

export function saveScanResult(scanData) {
  try {
    const history = getScanHistory();
    // Add timestamp and unique ID
    const newScan = {
      ...scanData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    // Prepend to history, keep last 20 scans to avoid blowing up localStorage
    const newHistory = [newScan, ...history].slice(0, 20);
    localStorage.setItem(SCAN_CACHE_KEY, JSON.stringify(newHistory));
    return newScan;
  } catch (error) {
    console.error("Failed to save scan result:", error);
    return null;
  }
}

export function clearScanHistory() {
  localStorage.removeItem(SCAN_CACHE_KEY);
}
