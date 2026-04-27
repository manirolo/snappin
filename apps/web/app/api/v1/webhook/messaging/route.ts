import { NextRequest, NextResponse } from "next/server";
import { env } from "@snappin/env";
import { createHmac, timingSafeEqual } from "crypto";

function verifySignature(body: string, signature: string | null): boolean {
    if (!signature || !env.whatsapp.appSecret) return false;

    const expected =
        "sha256=" +
        createHmac("sha256", env.whatsapp.appSecret)
            .update(body)
            .digest("hex");

    const sigBuf = Buffer.from(signature);
    const expectedBuf = Buffer.from(expected);

    if (sigBuf.length !== expectedBuf.length) return false;

    return timingSafeEqual(sigBuf, expectedBuf);
}

export async function GET(request: NextRequest) {
    const mode = request.nextUrl.searchParams.get("hub.mode");
    const token = request.nextUrl.searchParams.get("hub.verify_token");
    const challenge = request.nextUrl.searchParams.get("hub.challenge");

    if (mode === "subscribe" && token === env.whatsapp.verifyToken) {
        return new NextResponse(challenge ?? "", {
            status: 200,
            headers: {
                "Content-Type": "text/plain",
            },
        });
    }

    return new NextResponse("Forbidden", { status: 403 });
}

export async function POST(request: NextRequest) {
    try {
        const rawBody = await request.text();
        console.time("[webhook] total")

        const signature = request.headers.get("x-hub-signature-256");
        const isValid = verifySignature(rawBody, signature);

        if (!isValid) {
            return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }
        const payload = JSON.parse(rawBody);
        const value = payload?.entry?.[0]?.changes?.[0]?.value;
        if (!value?.messages?.length) {
            return NextResponse.json({ ok: true }); // nothing to process
        }
        
        const [
            { whatsappClient },
            { messageReceived },
        ] = await Promise.all([
            import("@snappin/apps/whatsapp/whatsapp.client"),
            import("@snappin/features/mobileScanners/trigger/message.received.task"),
        ])

        console.time("[webhook] normalizeNotification")
        const events = await whatsappClient.normalizeNotification(payload);
        console.timeEnd("[webhook] normalizeNotification") // ← check this

        console.time("[webhook] trigger")
        events.map((event) => messageReceived.trigger(event));
        console.timeEnd("[webhook] trigger") // ← check this

        console.timeEnd("[webhook] total")
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("[POST /webhook/messaging] webhook error:", err);
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}