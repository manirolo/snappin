export interface Author {
    name: string;
    handle: string;
    image: string;
    role: string;
    twitter: string
}

export const AUTHORS: Record<string, Author> = {
    "Manikandan P": {
        name: "Manikandan P",
        handle: "maniikandan_p",
        image: "/static/images/blog/author/manikandan-p.jpg",
        role: "Founder",
        twitter: "https://www.x.com/maniikandan_p"
    },
};

export function getAuthor(name: string): Author | undefined {
    return AUTHORS[name];
}

export function parseAuthors(authorString: string): Author[] {
    return authorString
        .split(",")
        .map((name) => name.trim())
        .map((name) => getAuthor(name))
        .filter((author): author is Author => author !== undefined);
}