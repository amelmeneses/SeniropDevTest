// Core data model representing a CMS article.
export interface Article {
    id: string;
    headline: string;
    author: string;
    body: string;
    publicationDate: string; // YYYY-MM-DD
    published: boolean;
}
