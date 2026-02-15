import { Image } from "@imagekit/next"
import { cn } from "../../lib/utils"

type CDNImageProps = {
  src: string
  alt?: string
  className?: string // controls SIZE
}

export const CDNImage = ({
  src,
  alt = "Unknown",
  className,
}: CDNImageProps) => {
  return (
    <div className={cn("relative inline-block", className)}>
      <Image
        urlEndpoint="https://ik.imagekit.io/kk3yk561o"
        src={src}
        fill
        className="object-fill"
        alt={alt}
      />
    </div>
  )
}
