import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { ArticleProvider, useArticles } from '../ArticleContext';

function wrapper({ children }: { children: ReactNode }) {
  return <ArticleProvider>{children}</ArticleProvider>;
}

describe('ArticleContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('useArticles() throws outside provider', () => {
    expect(() => {
      renderHook(() => useArticles());
    }).toThrow('useArticles must be used within an ArticleProvider');
  });

  it('addArticle() adds article to state', () => {
    const { result } = renderHook(() => useArticles(), { wrapper });

    const initialLength = result.current.articles.length;

    act(() => {
      result.current.addArticle({
        headline: 'Test',
        author: 'Author',
        body: 'Body text',
        publicationDate: '2025-01-01',
        published: false,
      });
    });

    expect(result.current.articles.length).toBe(initialLength + 1);
    expect(result.current.articles[0].headline).toBe('Test');
    expect(result.current.articles[0].id).toBeDefined();
  });

  it('updateArticle() merges partial updates', () => {
    const { result } = renderHook(() => useArticles(), { wrapper });

    const id = result.current.articles[0].id;
    const originalAuthor = result.current.articles[0].author;

    act(() => {
      result.current.updateArticle(id, { headline: 'Updated Headline' });
    });

    const updated = result.current.articles.find((a) => a.id === id)!;
    expect(updated.headline).toBe('Updated Headline');
    expect(updated.author).toBe(originalAuthor);
  });

  it('deleteArticle() removes article by ID', () => {
    const { result } = renderHook(() => useArticles(), { wrapper });

    const initialLength = result.current.articles.length;
    const id = result.current.articles[0].id;

    act(() => {
      result.current.deleteArticle(id);
    });

    expect(result.current.articles.length).toBe(initialLength - 1);
    expect(result.current.articles.find((a) => a.id === id)).toBeUndefined();
  });

  it('togglePublish() flips published boolean', () => {
    const { result } = renderHook(() => useArticles(), { wrapper });

    const id = result.current.articles[0].id;
    const wasPub = result.current.articles[0].published;

    act(() => {
      result.current.togglePublish(id);
    });

    expect(result.current.articles.find((a) => a.id === id)!.published).toBe(!wasPub);
  });
});
