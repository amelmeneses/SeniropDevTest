import React, { useState } from 'react';
import { useArticles } from '../context/ArticleContext';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface LiveSiteProps {
    articleId: string;
    onBack: () => void;
}

export const LiveSite: React.FC<LiveSiteProps> = ({ articleId, onBack }) => {
    const { articles } = useArticles();
    const article = articles.find((a) => a.id === articleId);
    const [currentImage, setCurrentImage] = useState(0);

    if (!article) {
        return (
            <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center gap-4">
                <p className="text-gray-500 text-lg">Article not found.</p>
                <button onClick={onBack} className="text-[#578AFF] hover:underline text-sm flex items-center gap-1">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                </button>
            </div>
        );
    }

    const images = article.image ?? [];
    const hasImages = images.length > 0;
    const hasMultipleImages = images.length > 1;

    const handlePrev = () => {
        setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    return (
        <div className="min-h-screen bg-gray-200">
            {/* Live Site link */}
            <div className="px-6 py-3">
                <button
                    onClick={onBack}
                    className="text-[#578AFF] hover:underline text-sm font-medium"
                >
                    Live Site
                </button>
            </div>

            {/* Main card */}
            <div className="max-w-[1200px] mx-auto border border-gray-300 bg-white">
                {/* Dark header */}
                <header className="bg-[#404040] px-8 py-4">
                    <span className="text-white text-base font-medium">Daily News</span>
                </header>

                {/* Article content */}
                <div className="px-8 py-10 border-t border-gray-300">
                    {/* Date */}
                    <p className="text-sm text-gray-600 mb-6">
                        {formatDate(article.publicationDate)}
                    </p>

                    {/* Headline centered */}
                    <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
                        {article.headline}
                    </h1>

                    {/* Author centered */}
                    <p className="text-base text-gray-500 text-center mb-8">
                        By {article.author}
                    </p>

                    {/* Image carousel */}
                    {hasImages && (
                        <div className="mb-6">
                            <div className="max-w-2xl mx-auto">
                                <img
                                    src={images[currentImage].dataUrl}
                                    alt={images[currentImage].name}
                                    className="w-full object-cover"
                                />
                            </div>

                            {/* Back / Next controls */}
                            {hasMultipleImages && (
                                <div className="max-w-2xl mx-auto flex items-center justify-between mt-3">
                                    <button
                                        onClick={handlePrev}
                                        className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        back
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
                                    >
                                        next
                                        <ArrowRight className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Body */}
                    <div className="max-w-2xl mx-auto text-sm text-gray-800 leading-relaxed whitespace-pre-wrap mt-6">
                        {article.body}
                    </div>
                </div>
            </div>
        </div>
    );
};
