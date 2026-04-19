import Image from "next/image";
import Link from "next/link";
import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import React, { type ReactNode } from "react";

interface TableData {
  headers: string[];
  rows: string[][];
}

function Table({ data }: { data: TableData }) {
  const headers = data.headers.map((header, index) => (
    <th key={index}>{header}</th>
  ));
  const rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ));

  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

interface CustomLinkProps {
  href: string;
  children: React.ReactNode;
  [key: string]: unknown;
}

function CustomLink({ href, ...rest }: CustomLinkProps) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} className="text-link" {...rest}>
        {rest.children as ReactNode}
      </Link>
    );
  }

  if (href.startsWith("#")) {
    return <Link href={href} className="text-link" {...rest} />;
  }

  return <Link className="text-link" target="_blank" href={href} rel="noopener noreferrer" {...rest} />;
}

interface RoundedImageProps {
  src: string;
  alt: string;
  [key: string]: string;
}

function RoundedImage(props: RoundedImageProps) {
  return <Image src={props.src} alt={props.alt} className="rounded-lg" />;
}

interface CalloutProps {
  emoji: string;
  children: ReactNode;
}

function Callout(props: CalloutProps) {
  return (
    <div className="px-4 py-3 border border-neutral-200 bg-neutral-50 rounded p-1 text-sm flex items-center text-neutral-900 mb-8">
      <div className="flex items-center w-4 mr-4">{props.emoji}</div>
      <div className="w-full callout">{props.children}</div>
    </div>
  );
}

interface WarningProps {
  title?: string;
  children: ReactNode;
}

function Warning(props: WarningProps) {
  return (
    <div className="not-prose px-4 py-3 border-2 border-red-300 bg-red-50 rounded-lg text-sm mb-8 dark:bg-red-950 dark:border-red-800">
      <div className="flex items-center gap-2 font-semibold text-red-700 dark:text-red-400 mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
        {props.title || "Warning"}
      </div>
      <div className="text-red-700 dark:text-red-300 [&_p]:m-0 [&_ul]:m-0 [&_ul]:mt-2 [&_strong]:font-semibold [&_code]:bg-red-100 [&_code]:dark:bg-red-900 [&_code]:px-1 [&_code]:rounded [&_a]:underline">
        {props.children}
      </div>
    </div>
  );
}

interface CapEmbedProps {
  src: string;
}

function CapEmbed({ src }: CapEmbedProps) {
  return (
    <iframe
      src={src}
      frameBorder="0"
      allowFullScreen
      style={{
        width: "100%",
        aspectRatio: "16 / 9",
        borderRadius: "15px",
        display: "block",
      }}
    />
  );
}

function slugify(str: string) {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

function createHeading(level: number) {
  const HeadingComponent = ({ children }: { children: string }) => {
    const slug = slugify(children);
    return React.createElement(
      `h${level}`,
      { id: slug, className: "mt-8 mb-5 text-lg font-medium" },
      [
        React.createElement("a", {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: "anchor",
        }),
      ],
      children,
    );
  };

  HeadingComponent.displayName = `Heading${level}`;
  return HeadingComponent;
}

interface ParagraphProps {
  children: ReactNode;
}

function Paragraph({ children }: ParagraphProps) {
  return (
    <p className="mb-4 font-normal text-fg-3 leading-relaxed">{children}</p>
  );
}

function OrderedList({ children }: { children: ReactNode }) {
  return (
    <ol className="list-decimal list-inside text-fg-3 font-normal mb-4 space-y-1">
      {children}
    </ol>
  );
}
OrderedList.displayName = "OrderedList";

function ListItem({ children }: { children: ReactNode }) {
  return (
    <li className="leading-relaxed text-fg-3 font-normal dark:text-neutral-200">
      {children}
    </li>
  );
}
ListItem.displayName = "ListItem";

const components: MDXRemoteProps["components"] = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: RoundedImage,
  a: CustomLink,
  p: Paragraph,
  Callout,
  Warning,
  CapEmbed,
  Table,
  ol: OrderedList,
  li: ListItem,
};

export function DocsMDX(props: MDXRemoteProps) {
  return (
    <MDXRemote
      {...props}
      components={{ ...components, ...(props.components ?? {}) }}
    />
  );
}