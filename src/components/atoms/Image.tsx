import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImagePlus, X } from 'lucide-react';
import { cn } from '../../utils/utils';
import type { ImageFile } from '../../types/article';

interface ImageUploaderProps {
    value: ImageFile[];
    onChange: (images: ImageFile[]) => void;
    disabled?: boolean;
    error?: boolean;
}

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} b`;
    return `${(bytes / 1024).toFixed(2)} kb`;
}

export const ImageUploader = React.forwardRef<HTMLDivElement, ImageUploaderProps>(
    ({ value, onChange, disabled = false, error = false }, ref) => {
        const onDrop = useCallback(
            (acceptedFiles: File[]) => {
                const readers = acceptedFiles.map(
                    (file) =>
                        new Promise<ImageFile>((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onload = () =>
                                resolve({
                                    name: file.name,
                                    size: file.size,
                                    dataUrl: reader.result as string,
                                });
                            reader.onerror = () => reject(reader.error);
                            reader.readAsDataURL(file);
                        })
                );
                Promise.all(readers).then((newImages) => {
                    onChange([...value, ...newImages]);
                });
            },
            [onChange, value]
        );

        const handleRemove = (index: number) => {
            onChange(value.filter((_, i) => i !== index));
        };

        const { getRootProps, getInputProps, isDragActive } = useDropzone({
            onDrop,
            accept: { 'image/*': [] },
            multiple: true,
            disabled,
        });

        return (
            <div
                ref={ref}
                className={cn(
                    'flex flex-col gap-2.5 w-full rounded-sm border border-[#578AFF] bg-white p-2.5',
                    error && value.length === 0 && 'border-red-500',
                    disabled && 'opacity-50'
                )}
            >
                {/* Dropzone area */}
                <div
                    {...getRootProps()}
                    className={cn(
                        'flex flex-row items-center gap-2.5 rounded-sm bg-gray-50 cursor-pointer transition-colors p-2.5',
                        isDragActive && 'bg-[#578AFF]/10',
                        disabled && 'cursor-not-allowed'
                    )}
                >
                    <input {...getInputProps()} />
                    <span className="bg-[#578AFF]/60 text-white text-xs font-bold uppercase px-4 py-2 rounded-sm shrink-0">
                        Select files...
                    </span>
                    {isDragActive ? (
                        <p className="text-sm text-[#578AFF] font-medium">Drop files here...</p>
                    ) : (
                        <p className="text-sm text-gray-500">Drop files here to upload</p>
                    )}
                </div>

                {/* File list */}
                {value.map((file, index) => (
                    <div key={index} className="flex items-start gap-2.5 py-1">
                        <div className="shrink-0 w-10 h-10 bg-[#578AFF]/10 rounded flex items-center justify-center">
                            <ImagePlus className="h-5 w-5 text-[#578AFF]" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                            <p className="text-xs text-green-600">File successfully uploaded.</p>
                        </div>
                        {!disabled && (
                            <button
                                type="button"
                                onClick={() => handleRemove(index)}
                                className="shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        );
    }
);

ImageUploader.displayName = 'ImageUploader';
