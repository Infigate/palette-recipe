// src/App.tsx
import React, { useState } from 'react';
import { generateRecipe, RecipeResponse } from './api/recipeService';
import { generateDishImages } from './api/imageService';
import './App.css';

const App: React.FC = () => {
  const [ingredients, setIngredients] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [result, setResult] = useState<RecipeResponse | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  const handleGenerate = async () => {
    if (!ingredients.trim()) {
      console.log('入力が空です。');
      return;
    }

    console.log('レシピ生成を開始します。入力された食材:', ingredients);
    setLoading(true);
    setError('');
    setResult(null);
    setImageUrls([]);
    setImageLoading(false);

    try {
      const recipe = await generateRecipe(ingredients, '');
      setResult(recipe);

      // 料理名をもとに、詳細な画像生成プロンプトを作成
      const ingredientsText = recipe.ingredientsDetail.replace(/\n/g, ', ');
      const dishPrompt = `
        A high-quality, realistic food photograph of ${recipe.dishName}, 
        Ingredients: ${ingredientsText}, 
        plated elegantly in a restaurant-style setting, 
        with vibrant colors, professional lighting, 
        shallow depth of field, cinematic composition, 
        warm ambiance, appetizing, delicious
      `;
      console.log('画像生成プロンプト:', dishPrompt);
      setImageLoading(true);
      const urls = await generateDishImages(dishPrompt, 1);
      setImageLoading(false);
      if (urls && urls.length > 0) {
        setImageUrls(urls);
      }
    } catch (err: any) {
      console.error('全体エラー:', err);
      setError(err.message || 'レシピ生成中にエラーが発生しました。');
    }
    console.log('レシピ生成処理終了。');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 to-orange-400 flex flex-col items-center justify-center p-4">
      <div className="w-full md:max-w-4xl bg-white bg-opacity-90 rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-orange-600 mb-4 text-center">
          Palette Recipe
        </h1>
        <p className="mb-6 text-gray-700 text-center">
          食材を入力して、料理名、レシピ、及び材料の分量を生成しよう！
        </p>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 mb-6 shadow-sm"
          placeholder="例: トマト、バジル、モッツァレラチーズ"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          rows={4}
        />
        <button
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-full font-semibold transition-colors duration-300 disabled:opacity-50 shadow-lg"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? '生成中...' : 'レシピを生成'}
        </button>

        {error && <p className="text-red-600 mt-6 text-center">{error}</p>}
        {result && (
          <div className="mt-6 p-6 border border-gray-200 rounded-xl shadow bg-gray-50">
            <h2 className="text-2xl font-semibold text-orange-700 mb-4">
              {result.dishName}
            </h2>
            {/* 画像表示部分：横並びで、はみ出す場合は横スクロール */}
            <div className="flex overflow-x-auto flex-nowrap items-center space-x-4 my-5 justify-center">
              {/* 画像表示部分：中央配置 */}
              <div className="flex justify-center my-5">
                {imageLoading ? (
                  <div className="w-64 h-64 bg-gray-300 rounded-lg animate-pulse"></div>
                ) : (
                  imageUrls.length > 0 && (
                    <img
                      src={imageUrls[0]}
                      alt={`${result.dishName}`}
                      className="w-64 h-64 object-cover rounded-lg shadow-md mx-auto"
                    />
                  )
                )}
              </div>
            </div>
            <div className="text-gray-800 mb-4">
              {result.recipe?.map((step, index) => (
                <p key={index} className="whitespace-pre-wrap">
                  {step}
                </p>
              ))}
            </div>
            <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm mb-4">
              <h3 className="text-xl font-semibold text-orange-700 mb-2">
                材料の分量
              </h3>
              <p className="text-gray-800 whitespace-pre-wrap">
                {result.ingredientsDetail}
              </p>
            </div>
            {/* 代替料理の提案 */}
            {result.alternatives && result.alternatives.length > 0 && (
              <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm mb-4">
                <h3 className="text-xl font-semibold text-orange-700 mb-2">
                  他にもこんなのはどうですか？
                </h3>
                <ul className="pl-6 text-gray-800">
                  {result.alternatives.map((alt, index) => (
                    <li key={index}>{alt}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;