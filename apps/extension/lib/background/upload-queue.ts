import type { InvoiceMetadata } from "./message-bus";
import { sendMessage } from "./message-bus";

type QueueItem = {
  id: string;
  blob: Blob;
  metadata: InvoiceMetadata;
  token: string;              // ← add token
  attempts: number;
  lastAttempt?: number;
};

const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 3000;

const queue: QueueItem[] = [];
let isProcessing = false;

export function enqueue(blob: Blob, metadata: InvoiceMetadata, token: string) {
   queue.push({
    id: crypto.randomUUID(),
    blob,
    metadata,
    token,                    // ← store it
    attempts: 0,
  });

  if (!isProcessing) processQueue();
}

async function processQueue() {
  if (queue.length === 0) {
    isProcessing = false;
    return;
  }

  isProcessing = true;
  const item = queue[0];

  try {
    await uploadItem(item);
    queue.shift(); // success — remove from front
  } catch (err) {
    item.attempts++;
    item.lastAttempt = Date.now();

    if (item.attempts >= MAX_ATTEMPTS) {
      console.error(`[upload-queue] Giving up on ${item.id} after ${MAX_ATTEMPTS} attempts`);
      queue.shift(); // drop it after max retries
      sendMessage({
        type: "EXTRACTION_ERROR",
        vendorId: item.metadata.vendorId,
        error: `Upload failed after ${MAX_ATTEMPTS} attempts`,
      });
    } else {
      console.warn(`[upload-queue] Retry ${item.attempts}/${MAX_ATTEMPTS} for ${item.id}`);
      await delay(RETRY_DELAY_MS * item.attempts); // back-off: 3s, 6s
    }
  }

  processQueue(); // process next item
}

async function uploadItem(item: QueueItem) {
  const form = new FormData();
  form.append("file", item.blob, item.metadata.filename ?? "invoice.pdf");
  form.append("metadata", JSON.stringify(item.metadata));

  const res = await fetch(`${getApiUrl()}/invoices/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${item.token}` },  // ← use item token
    body: form,
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  }

  sendMessage({
    type: "EXTRACTION_DONE",
    vendorId: item.metadata.vendorId,
    fileCount: 1,
  });
}


async function getAuthToken(): Promise<string> {
  const result = await chrome.storage.local.get("clerk_session_token");
  const token = result.clerk_session_token as string | undefined;
  if (!token) throw new Error("No auth token found");
  return token;
}

function getApiUrl(): string {
  // Pull from your extensionEnv — adjust import path as needed
  return (globalThis as unknown as { __SNAPPIN_API_URL__: string }).__SNAPPIN_API_URL__
    ?? "https://api.snappin.app";
}

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}