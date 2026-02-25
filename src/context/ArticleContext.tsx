import React, { createContext, useContext, type ReactNode } from 'react';
import type { Article } from '../types/article';
import { useLocalStorage } from '../hooks/useLocalStorage';



// Shape of the context value exposed to consumers.
interface ArticleContextType {
    articles: Article[];
    addArticle: (article: Omit<Article, 'id'>) => void;
    updateArticle: (id: string, updatedArticle: Partial<Article>) => void;
    deleteArticle: (id: string) => void;
    gotoArticle: (id: string) => void; // For navigation to article detail view
    togglePublish: (id: string) => void;
}

const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

// Custom hook for consuming the ArticleContext.
// Throws if used outside of an ArticleProvider to catch misuse early.
export const useArticles = () => {
    const context = useContext(ArticleContext);
    if (!context) {
        throw new Error('useArticles must be used within an ArticleProvider');
    }
    return context;
};

// Mock data to initialize if empty
const INITIAL_DATA: Article[] = [
    {
        id: '1',
        headline: 'City Council Approves New Public Park Initiative',
        author: 'Joe Doe',
        body: 'The City Council has officially approved a new initiative to develop a public park in the downtown area. The project, aimed at increasing green space and promoting outdoor activities, was passed unanimously during Tuesday night’s meeting. According to officials, the park will feature walking trails, a playground, picnic areas, and community gardens. Construction is expected to begin later this year, with a planned opening in late 2026. Residents expressed strong support for the project, calling it a much-needed addition to the neighborhood.',
        publicationDate: '2025-05-16',
        published: true,
        image: [],
    },
    {
        id: '2',
        headline: 'Local Farmers Market Expands to Saturday Evenings',
        author: 'Ana Rodríguez',
        body: 'Great news for fresh food lovers: the Local FarmersMarket is expanding its hours!',
        publicationDate: '2025-05-15',
        published: false,
        image: [],
    },

    {
        id: '3',
        headline: 'High School Robotics Team Wins State Championship',
        author: 'Carlos Mendoza',
        body: 'The local high school robotics team has brought home the state championship trophy.',
        publicationDate: '2025-05-14',
        published: true,
        image: [],
    },
];

// Provider component that holds article state in localStorage and
// exposes CRUD operations to the entire component tree.
export const ArticleProvider: React.FC<{ children: ReactNode; onGotoArticle?: (id: string) => void }> = ({ children, onGotoArticle }) => {
    // Articles are persisted under the "cms_articles" localStorage key.
    const [articles, setArticles] = useLocalStorage<Article[]>('cms_articles', INITIAL_DATA);

    // Create a new article with a unique UUID and prepend it to the list.
    const addArticle = (articleData: Omit<Article, 'id'>) => {
        const newArticle: Article = {
            ...articleData,
            id: crypto.randomUUID(),
        };
        setArticles((prev) => [newArticle, ...prev]);
    };

    // Partially update an existing article by merging new data.
    const updateArticle = (id: string, updatedData: Partial<Article>) => {
        setArticles((prev) =>
            prev.map((article) => (article.id === id ? { ...article, ...updatedData } : article))
        );
    };

    // Remove an article from the list by its id.
    const deleteArticle = (id: string) => {
        setArticles((prev) => prev.filter((article) => article.id !== id));
    };


    // Navigate to the live site view for a specific article.
    const gotoArticle = (id: string) => {
        onGotoArticle?.(id);
    };

    // Toggle the published/draft status of an article.
    const togglePublish = (id: string) => {
        setArticles((prev) =>
            prev.map((article) =>
                article.id === id ? { ...article, published: !article.published } : article
            )
        );
    };

    return (
        <ArticleContext.Provider value={{ articles, addArticle, updateArticle, deleteArticle,gotoArticle,togglePublish }}>
            {children}
        </ArticleContext.Provider>
    );
};
