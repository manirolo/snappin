import { format, parseISO } from "date-fns";
import type { Metadata } from "next";
import { CDNImage } from "@snappin/ui/components/imagekit/image";
import { notFound } from "next/navigation";
import { getBlogPosts, PostMetadata } from "../../../../utils/blog";
import { env } from "@snappin/env";
import { Author } from "../../../../modules/blog/components/author";
import { CustomMDX } from "../../../../components/mdx";
import { Cta } from "../../../../modules/home/sections/cta";
import { parseAuthors } from "../../../../utils/author";
import Script from "next/script";

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
  const ogImage = `https://ik.imagekit.io/kk3yk561o/v1${image}`;

  return {
    title: `${title} - Snappin Blog`,
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

  const authorList = parseAuthors((post.metadata as PostMetadata).author);

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
            <h1 className="my-4 tracking-tight font-semibold max-w-lg mx-auto text-4xl/12">
              {post.metadata.title}
            </h1>
            <p className="leading-relaxed max-w-sm mx-auto text-fg-2">
              <span>{post.metadata.description}</span>
            </p>
          </header>

          <div className="mx-auto w-fit">
            <Author authors={(post.metadata as PostMetadata).author} />
          </div>
        </div>
        {post.metadata.image && (
          <div className="relative mb-6 w-fit mx-auto rounded-lg overflow-hidden">
            <CDNImage
              className="object-contain m-0 w-full mx-auto sm:object-cover"
              imageClassName="xl:h-[40vh] w-full max-w-3xl"
              src={post.metadata.image}
              alt={post.metadata.title}
            />
          </div>
        )}

        <div className="max-w-xl mt-12 mx-auto">
          <CustomMDX source={post.content} />
        </div>
      </article>
      <Cta />

      <Script
        id="schema-article"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.metadata.title,
            description: post.metadata.description,
            image: `https://ik.imagekit.io/kk3yk561o/v1${post.metadata.image}`,
            datePublished: new Date(
              (post.metadata as PostMetadata).publishedAt,
            ).toISOString(),
            dateModified: new Date(
              (post.metadata as PostMetadata).publishedAt,
            ).toISOString(),
            url: `${env.app.frontend_url}/blog/${post.slug}`,
            author: authorList.map((a) => ({
              "@type": "Person",
              name: a.name ?? "Mani",
              image: a.image
                ? `https://ik.imagekit.io/kk3yk561o/v1${a.image}`
                : undefined,
              url: a.twitter,
            })),
            publisher: {
              "@type": "Organization",
              name: "Snappin",
              logo: {
                "@type": "ImageObject",
                url: "https://www.snappinapp.com/images/snappin_dark_light.png",
              },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${env.app.frontend_url}/blog/${post.slug}`,
            },
          }),
        }}
      />
    </>
  );
}
