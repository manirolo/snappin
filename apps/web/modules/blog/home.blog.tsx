import React from "react";
import { BlogPost, getBlogPosts, PostMetadata } from "../../utils/blog";
import {
  Section,
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from "../../components/layout/sectionLayout";
import Link from "next/link";
import { CDNImage } from "@snappin/ui/components/imagekit/image";
import { Small } from "@snappin/ui/components/typography";
import { getAuthor } from "../../utils/author";
import { formatDate } from "@snappin/lib/date/formateDate";

export const HomeBlog = () => {
  const allUpdates = getBlogPosts() as BlogPost[];
  return (
    <Section>
      <SectionHeader>
        <SectionTitle>Blog</SectionTitle>
        <SectionDescription className="font-normal text-[13px]">
          Latest news and updates from Snappin
        </SectionDescription>
      </SectionHeader>
      <SectionContent>
        <div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {allUpdates.map((post) => (
              <article key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Small>News</Small>
                    <div className="flex items-center gap-2">
                      <CDNImage
                        src={
                          getAuthor((post.metadata as PostMetadata).author)
                            ?.image ?? ""
                        }
                        alt={
                          getAuthor((post.metadata as PostMetadata).author)
                            ?.name ?? ""
                        }
                        className="size-5"
                        imageClassName="rounded-full"
                      />
                      <Small className="font-normal text-[13px]">{formatDate("MMM_DD_YYYY", (post.metadata as PostMetadata).publishedAt)}</Small>
                    </div>
                  </div>
                  <CDNImage
                    src={post.metadata.image ?? ""}
                    alt={post.metadata.title}
                    className="w-full"
                    imageClassName="rounded-md border border-bg-3"
                  />
                  <div className="space-y-2">
                    <h3>{post.metadata.title}</h3>
                    <p className="text-fg-2 leading-relaxed text-sm font-normal">
                      {post.metadata.description}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </SectionContent>
    </Section>
  );
};
