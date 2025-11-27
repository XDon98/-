
import React from 'react';

interface ImageModelSelectorProps {
  selectedModel: string;
  onSelectModel: (model: string) => void;
  disabled: boolean;
}

const models = [
  {
    id: 'gemini-2.5-flash-image',
    name: 'Gemini Flash Image',
    description: '快速、灵活的模型，适合编辑和组合图片。支持使用您保存的模特和自定义背景。',
  },
  {
    id: 'imagen-4.0-generate-001',
    name: 'Imagen 4',
    description: '生成最高质量、最逼真图片的模型。它会分析您上传的服装，然后根据文本描述从头开始创建全新的图像。',
  }
];

export const ImageModelSelector: React.FC<ImageModelSelectorProps> = ({ selectedModel, onSelectModel, disabled }) => {
  return (
    <div className="space-y-3">
      {models.map((model) => (
        <button
          key={model.id}
          onClick={() => onSelectModel(model.id)}
          disabled={disabled}
          className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900
            ${
              selectedModel === model.id
                ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500'
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <h3 className="font-bold text-gray-800 dark:text-gray-100">{model.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{model.description}</p>
        </button>
      ))}
    </div>
  );
};
