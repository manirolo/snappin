"use client";

import { useState, useEffect } from "react";
import { DotPattern } from "@snappin/ui/components/magicui/dot-pattern";

export function DotPatternWrapper(props: React.ComponentProps<typeof DotPattern>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <DotPattern {...props} />;
}