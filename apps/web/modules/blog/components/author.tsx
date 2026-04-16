import { Image } from "@snappin/ui/components/Image";
import React from "react";
import { parseAuthors } from "../../../utils/author";

interface AuthorBylineProps {
  authors: string;
}

export const Author = ({ authors }: AuthorBylineProps) => {
  const authorList = parseAuthors(authors);

  if (authorList.length === 0) {
    return null;
  }

  return (
    <div className="py-8">
      <div className="flex flex-wrap gap-1 sm:gap-6">
        {authorList.map((author) => (
          <div key={author.name} className="flex flex-col items-center gap-3">
            <Image
              src={author.image}
              alt={author.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <div className="font-normal text-fg-4">{author.name}</div>
              <span className="text-fg-3 font-normal text-sm">{author.role}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
