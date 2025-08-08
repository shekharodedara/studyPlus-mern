import { useEffect, useState } from "react";

function useVersionPolling(pollInterval = 60 * 1000) {
  const [currentVersion, setCurrentVersion] = useState(null);
  const [newVersionAvailable, setNewVersionAvailable] = useState(false);
  const isProd = import.meta.env.VITE_APP_IS_PRODUCTION === "true";
  useEffect(() => {
    if (!isProd) return;
    let intervalId;
    async function checkVersion() {
      try {
        const res = await fetch("/version.txt", { cache: "no-store" });
        if (res.ok) {
          const text = await res.text();
          const trimmed = text.trim();
          if (currentVersion && trimmed !== currentVersion) {
            setNewVersionAvailable(true);
          }
          if (!currentVersion) {
            setCurrentVersion(trimmed);
          }
        }
      } catch (err) {
        console.error("Error fetching version.txt", err);
      }
    }
    checkVersion();
    intervalId = setInterval(checkVersion, pollInterval);
    return () => clearInterval(intervalId);
  }, [currentVersion, pollInterval, isProd]);
  return { newVersionAvailable };
}

export default useVersionPolling;
