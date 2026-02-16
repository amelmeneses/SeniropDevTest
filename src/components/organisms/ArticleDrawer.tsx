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

type TouchedFields = Record<'headline' | 'author' | 'body' | 'publicationDate', boolean>;

const INITIAL_TOUCHED: TouchedFields = {
    headline: false,
    author: false,
    body: false,
    publicationDate: false,
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
    const [touched, setTouched] = useState<TouchedFields>(INITIAL_TOUCHED);

    // Sync form data when the drawer opens: populate from article or reset.
    useEffect(() => {
        if (isOpen) {
            setTouched(INITIAL_TOUCHED);
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

    const handleBlur = (field: keyof TouchedFields) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    const getErrors = (): Partial<Record<keyof TouchedFields, string>> => {
        const errors: Partial<Record<keyof TouchedFields, string>> = {};
        if (formData.headline.trim() === '') errors.headline = 'Headline is required';
        if (formData.author.trim() === '') {
            errors.author = 'Author is required';
        } else if (/\d/.test(formData.author)) {
            errors.author = 'Author must not contain numbers';
        }
        if (formData.body.trim() === '') errors.body = 'Body is required';
        if (formData.publicationDate.trim() === '') {
            errors.publicationDate = 'Publication date is required';
        } else if (isNaN(new Date(formData.publicationDate).getTime())) {
            errors.publicationDate = 'Invalid date';
        }
        return errors;
    };

    const errors = getErrors();

    // Dispatch create or update depending on the current mode, then close.
    const handleSubmit = () => {
        if (mode === 'view' && article) {
            onUpdate(article.id, { published: formData.published });
            onClose();
            return;
        }

        setTouched({ headline: true, author: true, body: true, publicationDate: true });

        if (Object.keys(getErrors()).length > 0) return;

        if (mode === 'create') {
            onSave(formData);
        } else if (mode === 'edit' && article) {
            onUpdate(article.id, formData);
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
                    disabled={Object.keys(errors).length > 0}
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
                <FormField label="Headline" htmlFor="article-headline" required error={touched.headline ? errors.headline : undefined}>
                    <Input
                        id="article-headline"
                        name="headline"
                        value={formData.headline}
                        onChange={(e) => handleChange('headline', e.target.value)}
                        onBlur={() => handleBlur('headline')}
                        placeholder="Article headline"
                        error={touched.headline && !!errors.headline}
                    />
                </FormField>

                <FormField label="Author" htmlFor="article-author" required error={touched.author ? errors.author : undefined}>
                    <Input
                        id="article-author"
                        name="author"
                        value={formData.author}
                        onChange={(e) => handleChange('author', e.target.value)}
                        onBlur={() => handleBlur('author')}
                        placeholder="Author name"
                        error={touched.author && !!errors.author}
                    />
                </FormField>

                <FormField label="Body" htmlFor="article-body" required error={touched.body ? errors.body : undefined}>
                    <Textarea
                        id="article-body"
                        name="body"
                        value={formData.body}
                        onChange={(e) => handleChange('body', e.target.value)}
                        onBlur={() => handleBlur('body')}
                        placeholder="Article content..."
                        className="min-h-[200px]"
                        error={touched.body && !!errors.body}
                    />
                </FormField>

                <FormField label="Publish Date" htmlFor="article-date" required error={touched.publicationDate ? errors.publicationDate : undefined}>
                    <Input
                        id="article-date"
                        name="publicationDate"
                        type="date"
                        value={formData.publicationDate}
                        onChange={(e) => handleChange('publicationDate', e.target.value)}
                        onBlur={() => handleBlur('publicationDate')}
                        error={touched.publicationDate && !!errors.publicationDate}
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
