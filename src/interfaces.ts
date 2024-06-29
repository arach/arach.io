export interface BookData {
    title: string;
    author: string;
    description: string;
    pubDatetime: Date;
    modDatetime?: Date | null;
    addedDatetime?: Date;
    tags: string[];
    isbn: string;
    thumbnail?: {
        url: string;
        alt: string;
    };
    ogImage?: string;
    canonicalURL?: string;
    readingTime?: number;
    rating?: number;
    featured?: boolean;
    draft?: boolean;
}