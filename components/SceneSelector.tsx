
import React, { useRef, useState } from 'react';

interface SceneSelectorProps {
  selectedScene: string;
  onSelectScene: (scene: string) => void;
  onSelectCustomBackground: (file: File) => void;
  onSelectCustomBackgroundUrl: (url: string) => void;
  customBackgroundUrl: string | null;
}

const scenes = [
  '影棚', '户外', '都市', '公园', '卧室', '客厅', '餐厅', '露营', '野炊', '学校',
  '游乐园', '海滩', '图书馆', '咖啡馆', '运动场', '雪景', '花海', '派对', '街头涂鸦',
  '森林', '博物馆', '沙漠', '乡村田野', '夜市', '山顶',
  '滑板公园', '篮球场', '书店', '艺术画廊', '工业风', '复古餐厅', '海边日落', '竹林',
  '度假胜地', '体育场馆', '音乐节', '历史古迹'
];


const UploadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 dark:text-gray-500 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
);


export const SceneSelector: React.FC<SceneSelectorProps> = ({ selectedScene, onSelectScene, onSelectCustomBackground, onSelectCustomBackgroundUrl, customBackgroundUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onSelectCustomBackground(event.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleUrlClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent file picker from opening
    const url = window.prompt("请输入背景图片的 URL:");
    if (url) {
      try {
        // Basic validation
        new URL(url);
        onSelectCustomBackgroundUrl(url);
      } catch (error) {
        alert("请输入一个有效的 URL。");
      }
    }
  };

  const filteredScenes = scenes.filter(scene =>
    scene.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="搜索场景..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/png, image/jpeg, image/webp"
        />
        <button
          onClick={handleUploadClick}
          className={`relative aspect-square w-28 h-28 rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 overflow-hidden border-2 group
            ${
              selectedScene === '__CUSTOM__'
                ? 'border-indigo-600 ring-2 ring-indigo-500'
                : 'border-dashed border-gray-300 dark:border-gray-600 hover:border-indigo-400'
            }
          `}
          aria-label="Upload custom background"
        >
          <button
            onClick={handleUrlClick}
            className="absolute top-2 right-2 z-10 p-1.5 bg-white/80 dark:bg-gray-900/80 rounded-full text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-900 hover:scale-110 transition-all duration-200 shadow"
            aria-label="Import from URL"
            title="从 URL 导入"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z" />
              <path d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z" />
            </svg>
          </button>
          {customBackgroundUrl ? (
             <>
                <img src={customBackgroundUrl} alt="Custom background" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-colors"></div>
                 <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent text-white text-xs font-semibold text-center p-2 truncate">
                    自定义
                </div>
             </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-2">
                <UploadIcon />
                <span className="text-xs font-medium text-center text-gray-700 dark:text-gray-300">上传背景</span>
            </div>
          )}
        </button>

        {filteredScenes.map((scene) => (
          <button
            key={scene}
            onClick={() => onSelectScene(scene)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900
              ${
                selectedScene === scene
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }
            `}
          >
            {scene}
          </button>
        ))}
         {filteredScenes.length === 0 && searchTerm && (
            <div className="w-full text-center py-4 text-gray-500 dark:text-gray-400">
                未找到与 "{searchTerm}" 匹配的场景。
            </div>
        )}
      </div>
    </div>
  );
};
