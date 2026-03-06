import React, { useState } from "react";
import NextImage from "next/image";
import { cn } from "@snappin/ui/lib/utils";

type ImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export const Image = ({ src, alt, className }: ImageProps) => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  return (
    <NextImage
      src={src}
      alt={alt}
      width={size.width || 800}
      height={size.height || 600}
      onLoad={(e) => {
        const img = e.currentTarget;
        setSize({ width: img.naturalWidth, height: img.naturalHeight });
      }}
      className={cn("w-full h-auto", className)}
      unoptimized
    />
  );
};