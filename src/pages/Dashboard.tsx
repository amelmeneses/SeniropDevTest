import React, { useState, useMemo } from 'react';
import { useArticles } from '../context/ArticleContext';
import type { Article } from '../types/article';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { ArticleTable } from '../components/organisms/ArticleTable';
import { ArticleDrawer } from '../components/organisms/ArticleDrawer';
import { Button } from '../components/atoms/Button';
import { FilterDropdown } from '../components/molecules/FilterDropdown';
import { Pagination } from '../components/molecules/Pagination';
import { Plus } from 'lucide-react';

// Main page that orchestrates the entire dashboard view.
// Owns all local UI state (search, filter, pagination, drawer)
// and connects to ArticleContext for data operations.
export const Dashboard: React.FC = () => {
    const { articles, addArticle, updateArticle, deleteArticle, gotoArticle, togglePublish } = useArticles();

    // UI state: search query, publish-status filter, and pagination.
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'unpublished'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    

    // Drawer state: controls visibility, mode (create/view/edit), and selected article.
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [drawerMode, setDrawerMode] = useState<'create' | 'view' | 'edit'>('create');
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

    // Memoized filtered list: applies search and publish-status filter.
    const filteredArticles = useMemo(() => {
        return articles.filter((article) => {
            const matchesSearch = article.headline.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter =
                filterStatus === 'all'
                    ? true
                    : filterStatus === 'published'
                        ? article.published
                        : !article.published;

            return matchesSearch && matchesFilter;
        });
    }, [articles, searchQuery, filterStatus]);

    const totalPages = Math.ceil(filteredArticles.length / rowsPerPage);

    // Slice the filtered list to the current page window.
    const paginatedArticles = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;
        return filteredArticles.slice(start, start + rowsPerPage);
    }, [filteredArticles, currentPage, rowsPerPage]);

    // Drawer handlers: open in create, view, or edit mode.
    const handleCreateClick = () => {
        setDrawerMode('create');
        setSelectedArticle(null);
        setIsDrawerOpen(true);
    };

    const handleViewClick = (id: string) => {
        const article = articles.find(a => a.id === id);
        if (article) {
            setDrawerMode('view');
            setSelectedArticle(article);
            setIsDrawerOpen(true);
        }
    };

    const handleEditClick = (id: string) => {
        const article = articles.find(a => a.id === id);
        if (article) {
            setDrawerMode('edit');
            setSelectedArticle(article);
            setIsDrawerOpen(true);
        }
    };

    // Transition from View -> Edit inside Drawer
    const handleSwitchToEdit = (article: Article) => {
        setDrawerMode('edit');
        setSelectedArticle(article);
    }

    // Navigation handler (mock implementation).
    const handleGotoArticle = (id: string) => {
        gotoArticle(id);
    };      

    // Confirm before deleting; also closes the drawer if the deleted article is open.
    const handleDeleteClick = (id: string) => {
        if (window.confirm('Are you sure you want to delete this article?')) {
            deleteArticle(id);
            if (isDrawerOpen && selectedArticle?.id === id) {
                setIsDrawerOpen(false);
            }
        }
    };

    return (
        <DashboardLayout searchQuery={searchQuery} onSearchChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}>
            <div className="space-y-6">
                {/* Header Section */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Articles</h1>
                </div>

                {/* Actions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <FilterDropdown
                        value={filterStatus}
                        onChange={(e) => { setFilterStatus(e.target.value as any); setCurrentPage(1); }}
                        options={[
                            { label: 'All', value: 'all' },
                            { label: 'Published', value: 'published' },
                            { label: 'Unpublished', value: 'unpublished' },
                        ]}
                    />

                    <Button onClick={handleCreateClick} className="bg-[#98B6FA] hover:bg-[#7a9ef8] text-white text-sm h-[36px] rounded-[4px]">
                        <Plus className="mr-2 h-4 w-4" />
                        ADD ARTICLE
                    </Button>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-visible relative">
                    {/* Passing filtered articles to table */}
                    <ArticleTable
                        articles={paginatedArticles}
                        onTogglePublish={(id) => togglePublish(id)}
                        onView={handleViewClick}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                        onGoToLiveSite={handleGotoArticle}
                    />

                    {/* Pagination */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={(rows) => { setRowsPerPage(rows); setCurrentPage(1); }}
                        totalItems={filteredArticles.length}
                    />
                </div>

                {/* Drawer */}
                <ArticleDrawer
                    isOpen={isDrawerOpen}
                    mode={drawerMode}
                    article={selectedArticle}
                    onClose={() => setIsDrawerOpen(false)}
                    onSave={addArticle}
                    onUpdate={updateArticle}
                    onEditClick={handleSwitchToEdit}
                />
            </div>
        </DashboardLayout>
    );

    //
};
