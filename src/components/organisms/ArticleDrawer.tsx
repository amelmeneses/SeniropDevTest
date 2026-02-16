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
    onEditClick: (article: Article) => void; // Keeping prop in interface but unused in component body for now to avoid breaking parent
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
    // onEditClick, // Removed unused destructuring
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
                // Default today's date if creating new? Or empty. Mock shows "00/00/0000" placeholder so empty is fine.
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
        }
        onClose(); // Close after save/update
    };

    const title = mode === 'create' ? 'New article' : mode === 'edit' ? 'Edit article' : (article?.headline || 'Read article');

    const Footer = () => {
        if (mode === 'view') {
            return (
                <div className="flex justify-between w-full border-t border-gray-100 pt-4 mt-6">
                    <div className="flex-1"></div>
                    <Button onClick={handleSubmit} className="bg-accent hover:bg-accent/80 text-white px-8">
                        UPDATE
                    </Button>
                </div>
            );
        }

        return (
            <div className="flex justify-end w-full border-t border-gray-100 pt-4 mt-6">
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

    return (
        <Drawer isOpen={isOpen} onClose={onClose} title={title} footer={<Footer />}>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                {/* 
                   In Figma 'Read article' (Frame 16), the fields look like disabled inputs / gray backgrounds.
                   I will use the same FormField structure for all modes, but disable inputs in 'view' mode.
                */}
                <FormField label="Headline" required>
                    <Input
                        value={formData.headline}
                        onChange={(e) => handleChange('headline', e.target.value)}
                        placeholder="Article headline"
                        disabled={mode === 'view'}
                        className={mode === 'view' ? "bg-gray-50 text-gray-500 border-gray-200" : ""}
                    />
                </FormField>

                <FormField label="Author" required>
                    <Input
                        value={formData.author}
                        onChange={(e) => handleChange('author', e.target.value)}
                        placeholder="Author name"
                        disabled={mode === 'view'}
                        className={mode === 'view' ? "bg-gray-50 text-gray-500 border-gray-200" : ""}
                    />
                </FormField>

                <FormField label="Body" required>
                    <Textarea
                        value={formData.body}
                        onChange={(e) => handleChange('body', e.target.value)}
                        placeholder="Article content..."
                        className={`min-h-[200px] ${mode === 'view' ? "bg-gray-50 text-gray-500 border-gray-200" : ""}`}
                        disabled={mode === 'view'}
                    />
                </FormField>

                <FormField label="Publish Date" required>
                    <Input
                        type="date"
                        value={formData.publicationDate}
                        onChange={(e) => handleChange('publicationDate', e.target.value)}
                        disabled={mode === 'view'}
                        className={mode === 'view' ? "bg-gray-50 text-gray-500 border-gray-200" : ""}
                    />
                </FormField>

                <div className="flex items-center justify-between pt-2">
                    <span className="text-gray-700 font-medium">Publish</span>
                    <Switch
                        checked={formData.published}
                        onCheckedChange={(checked) => handleChange('published', checked)}
                    // In View mode, screenshot shows toggle is active? "You can only change the switch status". 
                    // So NOT disabled.
                    />
                </div>
            </form>
        </Drawer>
    );
};
