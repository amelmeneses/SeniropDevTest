import React from 'react';
import type { Article } from '../../types/article';
import { Switch } from '../atoms/Switch';
import { TableRowActionMenu } from '../molecules/TableRowActionMenu';

interface ArticleTableProps {
    articles: Article[];
    onTogglePublish: (id: string, currentStatus: boolean) => void;
    onView: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onGoToLiveSite: (id: string) => void;
}

// Renders the articles list as a styled HTML table.
// Each row includes a publish toggle (Switch) and an action menu.
// Clicking a row opens the article in view mode; switch and menu
// clicks use stopPropagation to avoid triggering the row click.
export const ArticleTable: React.FC<ArticleTableProps> = ({
    articles,
    onTogglePublish,
    onView,
    onEdit,
    onDelete,
    onGoToLiveSite
}) => {
    return (
        <div className="w-full overflow-visible rounded-lg bg-white p-4">
            <table className="w-full min-w-[640px] text-left text-sm text-gray-500">
                <thead className="bg-[#f4f4f4] text-xs font-bold text-gray-700">
                    <tr>
                        <th scope="col" className="px-6 py-4 rounded-l-md">Article Headline</th>
                        <th scope="col" className="px-6 py-4">Author</th>
                        <th scope="col" className="px-6 py-4">Publish Date</th>
                        <th scope="col" className="px-6 py-4">Published</th>
                        <th scope="col" className="px-6 py-4 rounded-r-md"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {articles.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                No articles found.
                            </td>
                        </tr>
                    ) : (
                        articles.map((article) => (
                            <tr
                                key={article.id}
                                className="group hover:bg-gray-50 transition-colors cursor-pointer"
                                onClick={() => onView(article.id)}
                            >
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    {article.headline}
                                </td>
                                <td className="px-6 py-4">
                                    {article.author}
                                </td>
                                <td className="px-6 py-4">
                                    {new Date(article.publicationDate).toLocaleDateString('en-GB')}
                                </td>
                                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                    <Switch
                                        checked={article.published}
                                        onCheckedChange={() => onTogglePublish(article.id, article.published)}
                                    />
                                </td>
                                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                    <TableRowActionMenu
                                        onView={() => onView(article.id)}
                                        onEdit={() => onEdit(article.id)}
                                        onDelete={() => onDelete(article.id)}
                                        onGoToLiveSite={() => onGoToLiveSite(article.id)}
                                    />
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};
