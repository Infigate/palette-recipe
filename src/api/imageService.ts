// src/api/imageService.ts
import axios from 'axios';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

export const generateDishImages = async (prompt: string, n: number = 4): Promise<string[]> => {
  try {
    console.log('画像生成プロンプト:', prompt);
    const response = await axios.post(
      'https://api.openai.com/v1/images/generations',
      {
        prompt: prompt,
        n: n,
        size: '512x512',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );
    const urls: string[] = response.data.data.map((item: any) => item.url);
    console.log('画像生成成功:', urls);
    return urls;
  } catch (err) {
    console.error('画像生成エラー:', err);
    return [];
  }
};