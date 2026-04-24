import { Image } from "@imagekit/next";
import { cn } from "../../lib/utils";

type CDNImageProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
};

export const CDNImage = ({
  src,
  alt = "Unknown",
  className,
  imageClassName,
}: CDNImageProps) => {
  return (
    <div className={cn("overflow-hidden", className)}>
      <Image
        urlEndpoint={"https://ik.imagekit.io/kk3yk561o/v1"}
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
