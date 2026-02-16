import React, { useState, useEffect } from 'react';
import type { Article } from '../../types/article';
import { Drawer } from './Drawer';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Textarea } from '../atoms/Textarea';
import { Switch } from '../atoms/Switch';
import { FormField } from '../molecules/FormField';

// Props control the drawer's visibility and behavior.
// mode determines whether the form is for creating, viewing, or editing an article.
interface ArticleDrawerProps {
    isOpen: boolean;
    mode: 'create' | 'view' | 'edit';
    article?: Article | null;
    onClose: () => void;
    onSave: (article: Omit<Article, 'id'>) => void;
    onUpdate: (id: string, article: Partial<Article>) => void;
    onEditClick: (article: Article) => void;
}

// Initial state for form
const INITIAL_FORM_STATE = {
    headline: '',
    author: '',
    body: '',
    publicationDate: '',
    published: false,
};

export const ArticleDrawer: React.FC<ArticleDrawerProps> = ({
    isOpen,
    mode,
    article,
    onClose,
    onSave,
    onUpdate,
}) => {
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);

    // Sync form data when the drawer opens: populate from article or reset.
    useEffect(() => {
        if (isOpen) {
            if (article) {
                setFormData({
                    headline: article.headline,
                    author: article.author,
                    body: article.body,
                    publicationDate: article.publicationDate,
                    published: article.published,
                });
            } else {
                setFormData(INITIAL_FORM_STATE);
            }
        }
    }, [isOpen, article, mode]);

    const handleChange = (field: keyof typeof formData, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // All required fields must be non-empty to enable the save button.
    const isFormValid = () => {
        return (
            formData.headline.trim() !== '' &&
            formData.author.trim() !== '' &&
            formData.body.trim() !== '' &&
            formData.publicationDate.trim() !== ''
        );
    };

    // Dispatch create or update depending on the current mode, then close.
    const handleSubmit = () => {
        if (mode === 'create') {
            onSave(formData);
        } else if (mode === 'edit' && article) {
            onUpdate(article.id, formData);
        } else if (mode === 'view' && article) {
            // UPDATE button in view mode toggles publish status
            onUpdate(article.id, { published: formData.published });
        }
        onClose();
    };

    // Format date as DD/MM/YYYY for display in view mode.
    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB');
    };

    const Footer = () => {
        if (mode === 'view') {
            return (
                <div className="flex justify-end w-full">
                    <Button onClick={handleSubmit} className="bg-accent hover:bg-accent/80 text-white px-8">
                        UPDATE
                    </Button>
                </div>
            );
        }

        return (
            <div className="flex justify-end w-full">
                <Button
                    onClick={handleSubmit}
                    disabled={!isFormValid()}
                    className={mode === 'create' ? 'bg-gray-300 enabled:bg-accent text-white px-8' : 'bg-accent hover:bg-accent/80 text-white px-8'}
                >
                    {mode === 'create' ? 'SAVE' : 'UPDATE'}
                </Button>
            </div>
        );
    };

    // View mode: plain text display matching Figma "Read article" mockup.
    if (mode === 'view') {
        return (
            <Drawer isOpen={isOpen} onClose={onClose} title="" footer={<Footer />}>
                <div className="space-y-8">
                    {/* Headline as bold heading */}
                    <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-4">
                        {formData.headline}
                    </h2>

                    {/* Author */}
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-gray-900">Author</p>
                        <p className="text-sm text-gray-700">{formData.author}</p>
                    </div>

                    {/* Body */}
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-gray-900">Body</p>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{formData.body}</p>
                    </div>

                    {/* Publish Date */}
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-gray-900">Publish Date</p>
                        <p className="text-sm text-gray-700">{formatDate(formData.publicationDate)}</p>
                    </div>

                    {/* Separator + Publish toggle */}
                    <div className="border-t border-gray-200 pt-6">
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-700 font-medium">Publish</span>
                            <Switch
                                checked={formData.published}
                                onCheckedChange={(checked) => handleChange('published', checked)}
                            />
                        </div>
                    </div>
                </div>
            </Drawer>
        );
    }

    // Create / Edit mode: form with inputs.
    const title = mode === 'create' ? 'New article' : 'Edit article';

    return (
        <Drawer isOpen={isOpen} onClose={onClose} title={title} footer={<Footer />}>
            {/* Drawer title inside the body to match Figma layout */}
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{title}</h2>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <FormField label="Headline" required>
                    <Input
                        value={formData.headline}
                        onChange={(e) => handleChange('headline', e.target.value)}
                        placeholder="Article headline"
                    />
                </FormField>

                <FormField label="Author" required>
                    <Input
                        value={formData.author}
                        onChange={(e) => handleChange('author', e.target.value)}
                        placeholder="Author name"
                    />
                </FormField>

                <FormField label="Body" required>
                    <Textarea
                        value={formData.body}
                        onChange={(e) => handleChange('body', e.target.value)}
                        placeholder="Article content..."
                        className="min-h-[200px]"
                    />
                </FormField>

                <FormField label="Publish Date" required>
                    <Input
                        type="date"
                        value={formData.publicationDate}
                        onChange={(e) => handleChange('publicationDate', e.target.value)}
                    />
                </FormField>

                <div className="flex items-center gap-4 pt-2">
                    <span className="text-sm text-gray-700 font-medium">Publish</span>
                    <Switch
                        checked={formData.published}
                        onCheckedChange={(checked) => handleChange('published', checked)}
                    />
                </div>
            </form>
        </Drawer>
    );
};
