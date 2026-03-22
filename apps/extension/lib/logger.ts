export function log(area: string, msg: string, data?: unknown) {
  const entry = `[${new Date().toISOString()}] [${area}] ${msg} ${data ? JSON.stringify(data) : ""}`;
  console.log(entry);

  chrome.storage.local.get("snappin_logs").then((result) => {
    const logs = (result.snappin_logs as string[] | undefined) ?? [];  // ← cast
    logs.push(entry);
    if (logs.length > 200) logs.splice(0, logs.length - 200);
    chrome.storage.local.set({ snappin_logs: logs });
  });
}

export async function getLogs(): Promise<string[]> {
  const result = await chrome.storage.local.get("snappin_logs");
  return (result.snappin_logs as string[] | undefined) ?? [];  // ← cast
}

export async function clearLogs() {
  await chrome.storage.local.remove("snappin_logs");
}