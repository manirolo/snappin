import NextImage from "next/image";
import { cn } from "../lib/utils";

const BLUR_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGP49eMrAAXXAuhnXiR5AAAAAElFTkSuQmCC";

type ImageProps = React.HTMLAttributes<HTMLDivElement> & {
  src: string;
  alt: string;
  imageClassName?: string;
  priority?: boolean;
  fetchPriority?: "high" | "low" | "auto";
  width?: number;
  height?: number;
  sizes?: string;
};

export const Image = ({
  src,
  alt = "Unknown",
  className,
  imageClassName,
  priority = false,
  fetchPriority = "auto",
  width = 1200,
  height = 700,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px",
  ...props
}: ImageProps) => {
  return (
    <div className={cn("overflow-hidden", className)} {...props}>
      <NextImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        fetchPriority={fetchPriority}
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        className={cn("w-full h-auto", imageClassName)}
      />
    </div>
  );
};