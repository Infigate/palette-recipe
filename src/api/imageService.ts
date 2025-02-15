// src/api/imageService.ts
import axios from 'axios';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

export const generateDishImages = async (prompt: string, n: number = 1): Promise<string[]> => {
  try {
    console.log('画像生成プロンプト:', prompt);
    const urls: string[] = [];

    for (let i = 0; i < n; i++) {
      const response = await axios.post(
        'https://api.openai.com/v1/images/generations',
        {
          model: 'dall-e-3', // DALL·E 3 に変更
          prompt: prompt,
          n: 1, // 1回のリクエストで1枚ずつ取得
          size: '1024x1024', // 高解像度に変更
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );
      const generatedUrls = response.data.data.map((item: any) => item.url);
      if (generatedUrls.length > 0) {
        urls.push(generatedUrls[0]); // 最初の画像のみ取得
      }
    }

    console.log('画像生成成功:', urls);
    return urls;
  } catch (err) {
    console.error('画像生成エラー:', err);
    return [];
  }
};