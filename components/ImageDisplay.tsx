import React, { useState } from 'react';

interface ImageDisplayProps {
  imageUrls: string[] | null;
  isLoading: boolean;
  onDownload: () => void;
  selectedImageUrl: string | null;
  onSelectImage: (url: string | null) => void;
}

const ImageLoader: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-2">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        <p className="text-sm text-gray-500 dark:text-gray-400">图片魔法正在发生...</p>
    </div>
);

const Placeholder: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.03 3.97a.75.75 0 011.06 0l16 16a.75.75 0 01-1.06 1.06l-5.002-5.002a2.25 2.25 0 01-3.18 0l-2.01-2.011a2.25 2.25 0 010-3.181L4.03 3.97zM12 21a9 9 0 100-18 9 9 0 000 18z" />
        </svg>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">生成的媒体内容将在此处显示</p>
    </div>
);

type ImageSize = 'small' | 'medium' | 'large';

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ 
    imageUrls, 
    isLoading, 
    onDownload, 
    selectedImageUrl,
    onSelectImage
}) => {
  const [imageSize, setImageSize] = useState<ImageSize>('medium');
  const hasMultipleImages = !!(imageUrls && imageUrls.length > 1);

  const sizeClasses: Record<ImageSize, string> = {
    small: 'max-w-[50%] max-h-[50%]',
    medium: 'max-w-[75%] max-h-[75%]',
    large: 'max-w-full max-h-full',
  };

  const handleBackToGrid = () => {
    onSelectImage(null); // Deselecting shows the grid
  };

  const content = () => {
    if (isLoading) return <ImageLoader />;

    // Single Image View (if an image is selected)
    if (selectedImageUrl) {
        return <img src={selectedImageUrl} alt="Generated model" className={`${sizeClasses[imageSize]} object-contain transition-all duration-300 ease-in-out`} />;
    }
    
    // Grid View (if no image is selected, but multiple exist)
    if (hasMultipleImages) {
      return (
        <div className="w-full h-full p-4 grid grid-cols-2 gap-2 overflow-y-auto">
          {imageUrls.map((url, index) => (
            <button 
              key={index}
              onClick={() => onSelectImage(url)}
              className="relative aspect-square rounded-lg overflow-hidden focus:outline-none ring-2 ring-transparent hover:ring-indigo-400 transition-all duration-200"
            >
              <img src={url} alt={`Generated model variation ${index + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      );
    }
    
    // Fallback placeholder
    return <Placeholder />;
  }

  return (
    <div className="relative w-full min-h-[300px] md:min-h-[400px] bg-white dark:bg-gray-800 rounded-lg shadow-inner flex items-center justify-center overflow-hidden p-2">
      {content()}

      {!isLoading && selectedImageUrl && (
        <>
            {hasMultipleImages && (
                <button
                    onClick={handleBackToGrid}
                    className="absolute top-4 left-4 bg-white/80 dark:bg-gray-900/80 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-900 font-bold p-2 rounded-full shadow-lg transition-all duration-300 ease-in-out flex items-center justify-center backdrop-blur-sm"
                    aria-label="Back to gallery"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" clipRule="evenodd" />
                    </svg>
                </button>
            )}

            <div className="absolute bottom-4 right-4 flex flex-col items-end space-y-2">
                <div className="flex items-center space-x-1 bg-white/80 dark:bg-gray-900/80 p-1 rounded-full shadow-lg backdrop-blur-sm">
                {(['small', 'medium', 'large'] as ImageSize[]).map((size) => (
                    <button
                    key={size}
                    onClick={() => setImageSize(size)}
                    className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 dark:focus:ring-offset-gray-900
                        ${imageSize === size 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }
                    `}
                    >
                    {size === 'small' ? '小' : size === 'medium' ? '中' : '大'}
                    </button>
                ))}
                </div>

              <button
                onClick={onDownload}
                className="bg-white/80 dark:bg-gray-900/80 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-900 font-bold py-2 px-3 rounded-full shadow-lg transition-all duration-300 ease-in-out flex items-center space-x-2 backdrop-blur-sm"
                aria-label="Download media"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span className="text-sm">下载</span>
              </button>
            </div>
        </>
      )}
    </div>
  );
};