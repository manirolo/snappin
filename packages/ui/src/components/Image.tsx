import React from "react";
import NextImage from "next/image";
import { cn } from "@snappin/ui/lib/utils";

type ImageProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
};

export const Image = ({ src, alt, className, imageClassName }: ImageProps) => {
  return (
    <div className={cn("overflow-hidden", className)}>
      <NextImage
        src={src}
        alt={alt}
        width={1200} 
        height={700}  
        className={cn("w-full h-auto", imageClassName)}
        unoptimized
      />
    </div>
  );
};