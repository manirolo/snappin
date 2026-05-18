"use client";

import posthog from "posthog-js";
import { IS_PRODUCTION } from "@snappin/env";
import { useEffect } from "react";

const RECORDING_DISABLED_PATHS = ["/tools", "/privacy", "/terms"];

export function isRecordingDisabled(pathname: string) {
    return RECORDING_DISABLED_PATHS.some(
        (p) => pathname === p || pathname.startsWith(p + "/")
    );
}

function afterIdle(cb: () => void, timeout = 4000) {
    if ("requestIdleCallback" in window) {
        window.requestIdleCallback(cb, { timeout });
    } else {
        setTimeout(cb, timeout);
    }
}

export function PostHogInit() {
    useEffect(() => {
        const init = () => {
            posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
                api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
                capture_pageview: false,
                capture_pageleave: true,
                disable_surveys: true,
                disable_session_recording: true,
                loaded: (ph) => {
                    if (!IS_PRODUCTION) return;
                    afterIdle(() => {
                        if (!isRecordingDisabled(window.location.pathname)) {
                            ph.startSessionRecording();
                        }
                    }, 5000);
                },
            });
        };

        if (document.readyState === "complete") {
            afterIdle(init);
        } else {
            window.addEventListener("load", () => afterIdle(init), { once: true });
        }
    }, []);

    return null;
}