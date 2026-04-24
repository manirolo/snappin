"use client";

import { Spinner } from "@snappin/ui/assets/svg/spinner";
import { motion, AnimatePresence } from "motion/react";
import { useFullScreenLoading } from "@snappin/ui/hooks/useGlobalLoader";
import { CDNImage } from "./imagekit/image";

export function FullScreenLoader() {
    const { loading, data } = useFullScreenLoading();
    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-9999 flex flex-col items-center justify-center gap-3 backdrop-blur-xs bg-white/40"
                >
                    {data?.logo &&
                        <div className="rounded-md border bg-white border-gray-4 size-12 p-2 flex items-center justify-center">
                            <CDNImage src={data.logo} alt="Organization" className="rounded-md" />
                        </div>
                    }
                    {data?.title && (
                        <p className="text-sm font-medium text-gray-12">{data.title}</p>
                    )}
                    {data?.description && (
                        <p className="text-xs text-gray-9">{data.description}</p>
                    )}
                    <Spinner className="text-primary mt-10" />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
