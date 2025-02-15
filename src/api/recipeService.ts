// src/api/recipeService.ts
import axios from 'axios';

export interface RecipeResponse {
  dishName: string;
  recipe: string[]; // 各手順を配列で
  ingredientsDetail: string;
  alternatives: string[]; // 代替の料理名候補
}

const MAX_ATTEMPTS = 3;
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

export const generateRecipe = async (
  ingredients: string,
  exclusionInstruction: string = ''
): Promise<RecipeResponse> => {
  let attempt = 0;
  while (attempt < MAX_ATTEMPTS) {
    attempt++;
    console.log(`レシピ生成 試行 ${attempt} 回目`);
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content:
                `あなたはプロの料理研究家です。食材が入力されたら、料理名、レシピ（各手順を配列で）、材料の分量、及び代替の料理名候補を必ずJSON形式で出力してください。出力フォーマットは {"dishName": "料理名", "recipe": ["手順1", "手順2", ...], "ingredientsDetail": "材料の分量", "alternatives": ["代替料理1", "代替料理2", ...]} のみとしてください。${exclusionInstruction}`,
            },
            {
              role: 'user',
              content: `以下の食材を使って、料理名、レシピ、材料の分量、及び代替の料理名候補を教えてください。\n食材: ${ingredients}`,
            },
          ],
          max_tokens: 300,
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      const content: string = response.data.choices[0]?.message?.content;
      console.log('レシピレスポンス取得:', content);
      // JSON パースを試みる
      const parsed: RecipeResponse = JSON.parse(content);
      console.log('レシピJSONパース成功:', parsed);
      return parsed;
    } catch (err: any) {
      console.error(`レシピ生成 試行 ${attempt} 回目のエラー:`, err);
      if (err instanceof SyntaxError && attempt === MAX_ATTEMPTS) {
        throw new Error('有効なJSON形式のレスポンスが得られませんでした。');
      } else if (!(err instanceof SyntaxError)) {
        throw new Error('レシピ生成中にエラーが発生しました。');
      }
    }
  }
  throw new Error('レシピ生成に失敗しました。');
};