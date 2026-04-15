// app/error.tsx  (or app/(your-layout)/error.tsx if inside a route group)
"use client";

import { Button } from "@snappin/ui/components/button";
import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="text-sm text-muted-foreground mb-4">{error.message}</p>
      <Button variant="outline" asChild>
        <Link href="/dashboard">Go Home</Link>
      </Button>
    </div>
  );
}
