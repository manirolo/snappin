import { Image } from "@imagekit/next"
import { cn } from "../../lib/utils"

type CDNImageProps = {
  src: string
  alt?: string
  className?: string // controls SIZE
  loading?: "lazy"
}

export const CDNImage = ({
  src,
  alt = "Unknown",
  className,
  loading
}: CDNImageProps) => {
  return (
    <div className={cn("relative inline-block", className)}>
      <Image
        urlEndpoint="https://ik.imagekit.io/kk3yk561o"
        src={src}
        fill
        loading={loading}
        className="object-fill"
        alt={alt}
      />
    </div>
  )
}
