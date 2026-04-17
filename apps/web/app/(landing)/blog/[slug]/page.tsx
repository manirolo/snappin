import { format, parseISO } from "date-fns";
import type { Metadata } from "next";
import { Image } from "@snappin/ui/components/Image";
import { notFound } from "next/navigation";
import { getBlogPosts, PostMetadata } from "../../../../utils/blog";
import { env } from "@snappin/env";
import { Author } from "../../../../modules/blog/components/author";
import { CustomMDX } from "../../../../components/mdx";
import { Cta } from "../../../../modules/home/sections/cta";

interface PostProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata(
  props: PostProps,
): Promise<Metadata | undefined> {
  const params = await props.params;
  const post = getBlogPosts().find((post) => post.slug === params.slug);
  if (!post) {
    return;
  }

  const {
    title,
    publishedAt: publishedTime,
    description,
    image,
  } = post.metadata as {
    title: string;
    publishedAt: string;
    description: string;
    image: string;
  };
  const ogImage = `${env.app.frontend_url}${image}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${env.app.frontend_url}/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function PostPage(props: PostProps) {
  const params = await props.params;
  const post = getBlogPosts().find((post) => post.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <article className="px-5 py-14 max-w-5xl mx-auto prose">
        <div className="text-center">
          <div className="flex items-center gap-2 w-fit mx-auto">
            <time className="text-sm text-fg-3 font-normal">
              {format(
                parseISO(
                  (post.metadata as PostMetadata).publishedAt ||
                    new Date().toISOString(),
                ),
                "MMMM dd, yyyy",
              )}
            </time>
            <span className="text-fg-3">·</span>
          </div>
          <header>
            <h1 className="my-4 tracking-tight leading-normal max-w-lg mx-auto text-4xl">{post.metadata.title}</h1>
            <p className="leading-relaxed max-w-sm mx-auto text-fg-2">
              <span>
                {post.metadata.description}
              </span>
            </p>
          </header>

          <div className="mx-auto w-fit">
            <Author authors={(post.metadata as PostMetadata).author}/>
          </div>
        </div>
        {post.metadata.image && (
          <div className="relative mb-6 w-full rounded-lg overflow-hidden">
            <Image
              className="object-contain m-0 xl:h-[50vh] w-full sm:object-cover"
              src={post.metadata.image}
              alt={post.metadata.title}
            />
          </div>
        )}

        <div className="max-w-xl mt-12 mx-auto">
          <CustomMDX  source={post.content} />
        </div>
      </article>

      <Cta />
    </>
  );
}
