import { env } from "@snappin/env";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { extractHeadings, getDocBySlug } from "../../../../utils/docs";
import { DocsTableOfContents } from "../../../../components/docs/docsTableOfContent";
import { DocsMDX } from "../../../../components/docs.mdx";
import { SectionLabel } from "../../../../components/layout/sectionLayout";
import Script from "next/script";

interface DocPageProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateMetadata(
  props: DocPageProps,
): Promise<Metadata | undefined> {
  const params = await props.params;
  const slug = params.slug?.join("/") ?? "introduction";
  const doc = getDocBySlug(slug);
  if (!doc) return;

  const { title, summary: description, image } = doc.metadata;
  const ogImage = image ? `${env.app.frontend_url}${image}` : undefined;

  return {
    title: `${title == "Welcome to Snappin" ? "Documentation" : {title}} - Snappin Docs`,
    description: description || title,
    openGraph: {
      title: `${title} - Snappin Docs`,
      description: description || title,
      type: "article",
      url: `${env.app.frontend_url}/docs/${slug}`,
      ...(ogImage && { images: [{ url: ogImage }] }),
    },
  };
}

export default async function DocPage(props: DocPageProps) {
  const params = await props.params;
  const slug = params.slug?.join("/") ?? "introduction";
  const doc = getDocBySlug(slug);

  if (!doc) {
    notFound();
  }

  const headings = extractHeadings(doc.content);

  return (
    <>
      <div className="flex">
        <div className="flex-1 min-w-0 max-w-2xl mx-auto px-6 sm:px-8 py-10">
          <article className="mt-4">
            <SectionLabel className="bg-bg-2 text-fg-2 p-0.75 px-1.5 rounded-md text-sm">
              {doc.metadata.tags}
            </SectionLabel>
            <h1 className="text-3xl font-medium tracking-tight mt-3 text-gray-900 mb-2">
              {doc.metadata.title}
            </h1>
            {doc.metadata.summary && (
              <p className="text-base font-normal text-gray-500 mb-8">
                {doc.metadata.summary}
              </p>
            )}
            <div className="prose prose-gray max-w-none prose-headings:scroll-mt-20 prose-headings:font-semibold prose-a:text-blue-600 prose-code:before:content-none prose-code:after:content-none prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:text-[13px] [&_pre]:leading-relaxed [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit [&_iframe]:max-w-full [&_iframe]:w-full">
              <DocsMDX source={doc.content} />
            </div>
          </article>
        </div>
        <div className="hidden xl:block w-50 shrink-0">
          <DocsTableOfContents headings={headings} />
        </div>
      </div>

      <Script
        id="schema-techarticle"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            headline: doc.metadata.title,
            description: doc.metadata.summary || doc.metadata.title,
            url: `${env.app.frontend_url}/docs/${slug}`,
            publisher: {
              "@type": "Organization",
              name: "Snappin",
              url: "https://www.snappinapp.com",
              logo: {
                "@type": "ImageObject",
                url: "https://www.snappinapp.com/images/snappin_dark_light.png",
              },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${env.app.frontend_url}/docs/${slug}`,
            },
          }),
        }}
      />
      <Script
        id="schema-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://www.snappinapp.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Docs",
                item: "https://www.snappinapp.com/docs",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: doc.metadata.title,                      
                item: `${env.app.frontend_url}/docs/${slug}`,  
              },
            ],
          }),
        }}
      />
    </>
  );
}