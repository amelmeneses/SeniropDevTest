// Represents an uploaded image file with its metadata.
export interface ImageFile {
    name: string;
    size: number;       // bytes
    dataUrl: string;    // base64 data URL
}

// Core data model representing a CMS article.
export interface Article {
    id: string;
    headline: string;
    author: string;
    body: string;
    publicationDate: string; // YYYY-MM-DD
    published: boolean;
    image: ImageFile[];
}
