
import React, { useState, useCallback, useEffect } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ImageDisplay } from './components/ImageDisplay';
import { generateModelImage, constructPrompt } from './services/geminiService';
import { fileToBase64, urlToBase64, dataUrlToBase64 } from './utils/fileUtils';
import { AgeSelector } from './components/AgeSelector';
import { GenderSelector } from './components/GenderSelector';
import { PoseSelector } from './components/PoseSelector';
import { SceneSelector } from './components/SceneSelector';
import { AspectRatioSelector } from './components/AspectRatioSelector';
import { EthnicitySelector } from './components/EthnicitySelector';
import { ExpressionSelector } from './components/ExpressionSelector';
import { FacialFeaturesSelector } from './components/FacialFeaturesSelector';
import { HairSelector } from './components/HairSelector';
import { BodyTypeSelector } from './components/BodyTypeSelector';
import { ShotTypeSelector } from './components/ShotTypeSelector';
import { VariationSelector } from './components/VariationSelector';
import { HeightSelector } from './components/HeightSelector';
import { ModelSelector } from './components/ModelSelector';
import { RecentGenerations } from './components/RecentGenerations';

const Header: React.FC = () => (
  <header className="bg-white dark:bg-gray-800 shadow-md">
    <div className="container mx-auto px-4 py-4 md:py-6">
      <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-white">
        AI 时装模特生成器
      </h1>
      <p className="text-center text-gray-500 dark:text-gray-400 mt-1">
        上传服装图片，生成专业模特展示图
      </p>
    </div>
  </header>
);

const Footer: React.FC = () => (
  <footer className="text-center py-4 mt-8">
    <p className="text-sm text-gray-500 dark:text-gray-400">
      Powered by Gemini API
    </p>
  </footer>
);

interface SavedModel {
  id: string;
  name: string;
  thumbnailUrl: string; // This is imageDataUrl in ModelSelector
  config: {
    selectedAge: number; // Changed from ageRange to single age
    ageRange?: [number, number]; // Keep for backward compatibility
    selectedGender: string;
    selectedPose: string;
    selectedExpression: string;
    selectedEthnicity: string;
    selectedFacialFeatures: string[];
    selectedHairstyle: string;
    selectedHairColor: string;
    selectedBodyType: string;
    selectedHeight: number;
    selectedScene: string;
    customBackgroundUrl: string | null;
    aspectRatio: string;
  };
}

const defaultModelConfig = {
    selectedAge: 18, // Default to 18 within the 8-18 request, safest endpoint
    selectedGender: '随机',
    selectedPose: '站立',
    selectedExpression: '微笑',
    selectedEthnicity: '随机',
    selectedFacialFeatures: [],
    selectedHairstyle: '随机',
    selectedHairColor: '随机',
    selectedBodyType: '随机',
    selectedHeight: 170,
    selectedScene: '影棚',
    aspectRatio: '9:16',
};


export default function App() {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  const [generatedImageUrls, setGeneratedImageUrls] = useState<string[] | null>(null);
  const [selectedGeneratedImageUrl, setSelectedGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Model Config State
  const [selectedAge, setSelectedAge] = useState<number>(defaultModelConfig.selectedAge);
  const [selectedGender, setSelectedGender] = useState<string>(defaultModelConfig.selectedGender);
  const [selectedPose, setSelectedPose] = useState<string>(defaultModelConfig.selectedPose);
  const [selectedExpression, setSelectedExpression] = useState<string>(defaultModelConfig.selectedExpression);
  const [selectedEthnicity, setSelectedEthnicity] = useState<string>(defaultModelConfig.selectedEthnicity);
  const [selectedFacialFeatures, setSelectedFacialFeatures] = useState<string[]>(defaultModelConfig.selectedFacialFeatures);
  const [selectedHairstyle, setSelectedHairstyle] = useState<string>(defaultModelConfig.selectedHairstyle);
  const [selectedHairColor, setSelectedHairColor] = useState<string>(defaultModelConfig.selectedHairColor);
  const [selectedBodyType, setSelectedBodyType] = useState<string>(defaultModelConfig.selectedBodyType);
  const [selectedHeight, setSelectedHeight] = useState<number>(defaultModelConfig.selectedHeight);

  // Scene/Shot state
  const [selectedScene, setSelectedScene] = useState<string>(defaultModelConfig.selectedScene);
  const [customBackground, setCustomBackground] = useState<File | null>(null);
  const [customBackgroundUrl, setCustomBackgroundUrl] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<string>(defaultModelConfig.aspectRatio);
  const [selectedShotType, setSelectedShotType] = useState<string>('全身');
  const [numberOfVariations, setNumberOfVariations] = useState<number>(1);

  // Saved Models State
  const [savedModels, setSavedModels] = useState<SavedModel[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [recentGenerations, setRecentGenerations] = useState<string[]>([]);

  // Prompt Editing State
  const [promptText, setPromptText] = useState('');
  const [isPromptEdited, setIsPromptEdited] = useState(false);


  useEffect(() => {
    try {
      const storedModels = localStorage.getItem('savedModels');
      if (storedModels) {
        setSavedModels(JSON.parse(storedModels));
      }
      const storedRecents = localStorage.getItem('recentGenerations');
      if (storedRecents) {
        setRecentGenerations(JSON.parse(storedRecents));
      }
    } catch (e) {
      console.error("Failed to load data from localStorage", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('savedModels', JSON.stringify(savedModels));
    } catch (e) {
      console.error("Failed to save models to localStorage", e);
    }
  }, [savedModels]);
  
  useEffect(() => {
    const saveToLocalStorage = (data: string[]) => {
      try {
        localStorage.setItem('recentGenerations', JSON.stringify(data));
      } catch (e) {
        // If quota exceeded, try to remove the oldest item (last item in this context as we append new to front)
        // and try again recursively.
        if (data.length > 0) {
           // Remove the last element (oldest)
           const newData = data.slice(0, -1);
           saveToLocalStorage(newData);
        } else {
           console.error("Failed to save recent generations to localStorage - quota exceeded and list empty", e);
        }
      }
    };
    
    saveToLocalStorage(recentGenerations);
  }, [recentGenerations]);

  const handleImagesSelect = (file: File) => {
    setUploadedImages(prev => [...prev, file]);
    setUploadedImageUrls(prev => [...prev, URL.createObjectURL(file)]);
    // Select the newly added image
    setSelectedImageIndex(prev => uploadedImages.length);
    
    setGeneratedImageUrls(null);
    setSelectedGeneratedImageUrl(null);
    setError(null);
  };
  
  const handleRemoveImage = (index: number, e: React.MouseEvent) => {
      e.stopPropagation();
      
      // Revoke object URL to avoid memory leaks
      URL.revokeObjectURL(uploadedImageUrls[index]);
      
      const newImages = uploadedImages.filter((_, i) => i !== index);
      const newUrls = uploadedImageUrls.filter((_, i) => i !== index);
      
      setUploadedImages(newImages);
      setUploadedImageUrls(newUrls);
      
      // Adjust selection index
      if (index === selectedImageIndex) {
          // If we removed the selected one, select the previous one, or 0 if list is not empty
          setSelectedImageIndex(Math.max(0, index - 1));
      } else if (index < selectedImageIndex) {
          // If we removed one before the selected one, decrement index
          setSelectedImageIndex(prev => prev - 1);
      }
  };

  const handleSceneSelect = (scene: string) => {
    setSelectedScene(scene);
    setCustomBackground(null);
    setCustomBackgroundUrl(null);
  };
  
  const handleCustomBackgroundSelect = (file: File) => {
    setSelectedScene('__CUSTOM__');
    setCustomBackground(file);
    setCustomBackgroundUrl(URL.createObjectURL(file));
  };
  
  const handleCustomBackgroundUrlSelect = (url: string) => {
    setSelectedScene('__CUSTOM__');
    setCustomBackground(null);
    setCustomBackgroundUrl(url);
  };
  
  const handleToggleFacialFeature = (feature: string) => {
    setSelectedFacialFeatures(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const handleSelectModel = (modelId: string | null) => {
    setSelectedModelId(modelId);
    // Reset prompt editing state when switching models so defaults are loaded
    setIsPromptEdited(false); 

    if (modelId === null) {
        setSelectedAge(defaultModelConfig.selectedAge);
        setSelectedGender(defaultModelConfig.selectedGender);
        setSelectedPose(defaultModelConfig.selectedPose);
        setSelectedExpression(defaultModelConfig.selectedExpression);
        setSelectedEthnicity(defaultModelConfig.selectedEthnicity);
        setSelectedFacialFeatures(defaultModelConfig.selectedFacialFeatures);
        setSelectedHairstyle(defaultModelConfig.selectedHairstyle);
        setSelectedHairColor(defaultModelConfig.selectedHairColor);
        setSelectedBodyType(defaultModelConfig.selectedBodyType);
        setSelectedHeight(defaultModelConfig.selectedHeight);
        setSelectedScene(defaultModelConfig.selectedScene);
        setAspectRatio(defaultModelConfig.aspectRatio);
        setCustomBackground(null);
        setCustomBackgroundUrl(null);
    } else {
        const model = savedModels.find(m => m.id === modelId);
        if (model) {
            const { config } = model;
            // Handle backward compatibility for saved models with ageRange
            if (config.selectedAge !== undefined) {
                setSelectedAge(config.selectedAge);
            } else if (config.ageRange) {
                setSelectedAge(config.ageRange[0]);
            } else {
                setSelectedAge(defaultModelConfig.selectedAge);
            }
            
            setSelectedGender(config.selectedGender ?? defaultModelConfig.selectedGender);
            setSelectedPose(config.selectedPose);
            setSelectedExpression(config.selectedExpression);
            setSelectedEthnicity(config.selectedEthnicity);
            setSelectedFacialFeatures(config.selectedFacialFeatures);
            setSelectedHairstyle(config.selectedHairstyle);
            setSelectedHairColor(config.selectedHairColor);
            setSelectedBodyType(config.selectedBodyType);
            setSelectedHeight(config.selectedHeight);
            setSelectedScene(config.selectedScene ?? defaultModelConfig.selectedScene);
            setAspectRatio(config.aspectRatio ?? defaultModelConfig.aspectRatio);
            setCustomBackgroundUrl(config.customBackgroundUrl ?? null);
            setCustomBackground(null);
        }
    }
  };

  const handleDeleteModel = (modelId: string) => {
    setSavedModels(prev => prev.filter(m => m.id !== modelId));
    if (selectedModelId === modelId) {
        handleSelectModel(null);
    }
  };

  const handleRenameModel = (modelId: string, newName: string) => {
    setSavedModels(prev => prev.map(m => m.id === modelId ? { ...m, name: newName } : m));
  };

  const handleClearRecentGenerations = () => {
    if (window.confirm('您确定要清除所有最近生成的图片吗？此操作无法撤销。')) {
      setRecentGenerations([]);
    }
  };

  const handleSelectGeneratedImage = (url: string | null) => {
    setSelectedGeneratedImageUrl(url);
  }

  const calculatedPrompt = React.useMemo(() => {
    const hasCustomBackground = selectedScene === '__CUSTOM__' && !!(customBackground || customBackgroundUrl);
    const hasModelThumbnail = !!(selectedModelId && savedModels.find(m => m.id === selectedModelId));
    
    return constructPrompt(
        selectedAge,
        selectedGender,
        selectedPose,
        selectedExpression,
        selectedEthnicity,
        selectedScene,
        aspectRatio,
        selectedFacialFeatures,
        selectedHairstyle,
        selectedHairColor,
        selectedBodyType,
        selectedShotType,
        selectedHeight,
        hasCustomBackground,
        hasModelThumbnail
    );
  }, [
    selectedAge, selectedGender, selectedPose, selectedExpression, selectedEthnicity, 
    selectedScene, aspectRatio, selectedFacialFeatures, selectedHairstyle, 
    selectedHairColor, selectedBodyType, selectedShotType, selectedHeight, 
    selectedScene, customBackground, customBackgroundUrl, selectedModelId, savedModels
  ]);

  // Sync calculated prompt to text area if not manually edited
  useEffect(() => {
    if (!isPromptEdited) {
      setPromptText(calculatedPrompt);
    }
  }, [calculatedPrompt, isPromptEdited]);


  const handleGenerateClick = useCallback(async () => {
    if (uploadedImages.length === 0) return;
    const currentImage = uploadedImages[selectedImageIndex];
    if (!currentImage) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImageUrls(null);
    setSelectedGeneratedImageUrl(null);

    try {
      const clothingImage = await fileToBase64(currentImage);
      
      let customBgImage: { base64Data: string; mimeType: string } | undefined = undefined;
      if (selectedScene === '__CUSTOM__' && customBackgroundUrl) {
        if (customBackground) { // A file was uploaded
          customBgImage = await fileToBase64(customBackground);
        } else { // A URL was provided
          try {
            customBgImage = await urlToBase64(customBackgroundUrl);
          } catch (urlError) {
            console.error("Error fetching background URL:", urlError);
            setError("无法加载背景图片URL。请检查链接是否正确，并确保其允许跨域访问。");
            setIsLoading(false);
            return;
          }
        }
      }

      let modelThumbnail: { base64Data: string; mimeType: string } | undefined = undefined;
      if (selectedModelId) {
          const model = savedModels.find(m => m.id === selectedModelId);
          if (model) {
            try {
              // Use urlToBase64 to ensure the model thumbnail is resized/compressed
              // before sending to the API. Data URLs are valid URLs for fetch/blob processing.
              modelThumbnail = await urlToBase64(model.thumbnailUrl);
            } catch (e) {
              console.error("Failed to process saved model thumbnail", e);
              // If resizing fails, fallback to raw data (risky for payload size but better than nothing)
              modelThumbnail = dataUrlToBase64(model.thumbnailUrl);
            }
          }
      }
      
      const generatedImages = await generateModelImage(
          clothingImage.base64Data, 
          clothingImage.mimeType, 
          selectedAge,
          selectedGender,
          selectedPose, 
          selectedExpression, 
          selectedEthnicity, 
          selectedScene, 
          aspectRatio,
          selectedFacialFeatures,
          selectedHairstyle,
          selectedHairColor,
          selectedBodyType,
          selectedShotType,
          selectedHeight,
          customBgImage,
          modelThumbnail,
          numberOfVariations,
          promptText // Pass the prompt from the text area
      );
      setGeneratedImageUrls(generatedImages);
      if (generatedImages && generatedImages.length > 0) {
        setSelectedGeneratedImageUrl(generatedImages[0]);
        // Limit to 3 recent generations initially to avoid quota issues, though useEffect handles cleanup
        setRecentGenerations(prev => [...generatedImages, ...prev].slice(0, 3));

        if (selectedModelId === null) {
            const modelName = window.prompt("为新模特命名:", `模特 #${savedModels.length + 1}`);
            if (modelName) {
                const newModel: SavedModel = {
                    id: Date.now().toString(),
                    name: modelName,
                    thumbnailUrl: generatedImages[0],
                    config: {
                        selectedAge,
                        selectedGender,
                        selectedPose,
                        selectedExpression,
                        selectedEthnicity,
                        selectedFacialFeatures,
                        selectedHairstyle,
                        selectedHairColor,
                        selectedBodyType,
                        selectedHeight,
                        selectedScene,
                        aspectRatio,
                        customBackgroundUrl: selectedScene === '__CUSTOM__' ? customBackgroundUrl : null,
                    }
                };
                setSavedModels(prev => [...prev, newModel]);
                setSelectedModelId(newModel.id);
            }
        }
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '生成图片时发生未知错误。');
    } finally {
      setIsLoading(false);
    }
  }, [uploadedImages, selectedImageIndex, selectedAge, selectedGender, selectedPose, selectedExpression, selectedEthnicity, selectedScene, aspectRatio, customBackground, customBackgroundUrl, selectedFacialFeatures, selectedHairstyle, selectedHairColor, selectedBodyType, selectedShotType, numberOfVariations, selectedHeight, selectedModelId, savedModels, promptText]);


  const handleDownload = useCallback(() => {
    if (!selectedGeneratedImageUrl) return;

    const link = document.createElement('a');
    link.href = selectedGeneratedImageUrl;
    link.download = `ai-model-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [selectedGeneratedImageUrl]);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col space-y-4">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">1. 上传服装图片</h2>
            <ImageUploader 
                onImageSelect={handleImagesSelect} 
                imageUrls={uploadedImageUrls}
                selectedIndex={selectedImageIndex}
                onSelectIndex={setSelectedImageIndex}
                onRemoveImage={handleRemoveImage}
            />
          </div>
          <div className="flex flex-col space-y-4">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">2. 选择或新建模特</h2>
            <ModelSelector
              models={savedModels.map(m => ({ id: m.id, name: m.name, imageDataUrl: m.thumbnailUrl }))}
              selectedModelId={selectedModelId}
              onSelectModel={handleSelectModel}
              onDeleteModel={handleDeleteModel}
              onRenameModel={handleRenameModel}
            />

            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 pt-4">3. 自定义模特属性</h2>
            <div className="space-y-4">
                <AgeSelector value={selectedAge} onChange={setSelectedAge} />
                <p className="text-sm text-gray-500 dark:text-gray-400 -mb-2">选择性别:</p>
                <GenderSelector selectedGender={selectedGender} onSelectGender={setSelectedGender} />
                <p className="text-sm text-gray-500 dark:text-gray-400 -mb-2">选择模特肤色:</p>
                <EthnicitySelector selectedEthnicity={selectedEthnicity} onSelectEthnicity={setSelectedEthnicity} />
                <p className="text-sm text-gray-500 dark:text-gray-400 -mb-2">选择面部特征 (可多选):</p>
                <FacialFeaturesSelector selectedFeatures={selectedFacialFeatures} onToggleFeature={handleToggleFacialFeature} />
                <p className="text-sm text-gray-500 dark:text-gray-400 -mb-2">选择发型和发色:</p>
                <HairSelector selectedStyle={selectedHairstyle} selectedColor={selectedHairColor} onStyleChange={setSelectedHairstyle} onColorChange={setSelectedHairColor} />
                <p className="text-sm text-gray-500 dark:text-gray-400 -mb-2">选择体型:</p>
                <BodyTypeSelector selectedBodyType={selectedBodyType} onSelectBodyType={setSelectedBodyType} />
                <p className="text-sm text-gray-500 dark:text-gray-400 -mb-2">选择身高:</p>
                <HeightSelector value={selectedHeight} onChange={setSelectedHeight} />
            </div>

            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 pt-4">4. 选择模特姿势</h2>
            <PoseSelector selectedPose={selectedPose} onSelectPose={setSelectedPose} />

            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 pt-4">5. 选择模特表情</h2>
            <ExpressionSelector selectedExpression={selectedExpression} onSelectExpression={setSelectedExpression} />

            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 pt-4">6. 选择拍摄范围</h2>
            <ShotTypeSelector selectedShotType={selectedShotType} onSelectShotType={setSelectedShotType} />

            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 pt-4">7. 选择场景或上传背景</h2>
            <SceneSelector 
              selectedScene={selectedScene} 
              onSelectScene={handleSceneSelect}
              onSelectCustomBackground={handleCustomBackgroundSelect}
              onSelectCustomBackgroundUrl={handleCustomBackgroundUrlSelect}
              customBackgroundUrl={customBackgroundUrl}
            />
            
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 pt-4">8. 选择宽高比</h2>
            <AspectRatioSelector selectedRatio={aspectRatio} onSelectRatio={setAspectRatio} />

            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 pt-4">9. 提示词编辑</h2>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                    <label htmlFor="prompt-editor" className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        编辑提示词
                    </label>
                    {isPromptEdited && (
                        <button 
                            onClick={() => { setIsPromptEdited(false); setPromptText(calculatedPrompt); }}
                            className="text-xs text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 font-medium px-2 py-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                        >
                            重置为自动生成
                        </button>
                    )}
                </div>
                <textarea
                    id="prompt-editor"
                    value={promptText}
                    onChange={(e) => { setPromptText(e.target.value); setIsPromptEdited(true); }}
                    className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-200 resize-y leading-relaxed font-mono"
                    placeholder="生成的提示词将显示在这里，您可以进行编辑..."
                />
                <div className="flex justify-between items-start mt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        提示: 您可以在此手动修改提示词以添加更多细节。
                    </p>
                     <span className={`text-xs px-2 py-0.5 rounded ${isPromptEdited ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'}`}>
                        {isPromptEdited ? '手动编辑模式' : '自动生成模式'}
                    </span>
                </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 pt-4">10. 生成图片</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <VariationSelector
                  value={numberOfVariations}
                  onChange={setNumberOfVariations}
                  disabled={isLoading}
              />
              <button
                onClick={handleGenerateClick}
                disabled={uploadedImages.length === 0 || isLoading}
                className="w-full h-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 ease-in-out flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>
                )}
                <span>{isLoading ? '正在生成图片...' : `✨ 生成${numberOfVariations > 1 ? ` ${numberOfVariations} 张` : ''}图片`}</span>
              </button>
            </div>
            <ImageDisplay 
              imageUrls={generatedImageUrls} 
              isLoading={isLoading} 
              onDownload={handleDownload}
              selectedImageUrl={selectedGeneratedImageUrl}
              onSelectImage={handleSelectGeneratedImage}
            />
            {error && <div className="text-red-500 text-center p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">{error}</div>}

            <RecentGenerations
              images={recentGenerations}
              onSelect={setSelectedGeneratedImageUrl}
              onClear={handleClearRecentGenerations}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
