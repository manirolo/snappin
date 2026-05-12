import { Image } from "@imagekit/next";
import { cn } from "../../lib/utils";

const BLUR_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGP49eMrAAXXAuhnXiR5AAAAAElFTkSuQmCC";

type CDNImageProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  fetchPriority?: "high" | "low" | "auto";
  width?: number;
  height?: number;
  sizes?: string;
};

export const CDNImage = ({
  src,
  alt = "Unknown",
  className,
  imageClassName,
  priority = false,
  fetchPriority = "auto",
  width = 1200,
  height = 700,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px",
}: CDNImageProps) => {
  return (
    <div className={cn("overflow-hidden", className)}>
      <Image
        urlEndpoint="https://ik.imagekit.io/kk3yk561o/v1"
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        fetchPriority={fetchPriority}
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        transformation={[
          {
            format: "auto",
            quality: 80,
          },
        ]}
        className={cn("w-full h-auto", imageClassName)}
      />
    </div>
  );
};
