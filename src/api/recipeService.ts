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
  ingredients: string
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
              content: `
              あなたはプロの料理研究家です。入力された食材を元に、実際に作れる具体的なレシピを提供してください。  
              **必ず以下の詳細を含めてください：**
              - **料理名**（できるだけ一般的な名称）
              - **レシピ手順**（1ステップごとに具体的な手順を箇条書きで）
              - **材料の分量**（できるだけ正確に g, ml, 大さじ, 小さじ などで記載）
              - **代替の料理候補**（類似した料理や、異なる調理法の提案）
              
              **出力フォーマット:**  
              必ず JSON 形式で出力してください。形式は以下に厳密に従うこと：
              \`\`\`json
              {
                "dishName": "料理名",
                "recipe": [
                  "手順1（例: フライパンに油を入れ中火で熱する）",
                  "手順2（例: 玉ねぎをみじん切りにして炒める）",
                  "手順3（例: 鶏肉を加えて焼き色をつける）",
                  "手順4（例: 調味料を加えて5分煮込む）"
                ],
                "ingredientsDetail": "2人分: 鶏もも肉 200g, 玉ねぎ 1個, にんじん 1/2本, しょうゆ 大さじ2, みりん 大さじ1",
                "alternatives": ["代替料理1", "代替料理2"]
              }
              \`\`\`
              
              **重要:**  
              - **分量は適量ではなく具体的に記載すること**  
              - **調理手順は1ステップごとに明確にすること**  
              - **代替料理も、入力食材を活かせるものを提案すること**  
              `,
            },
            {
              role: 'user',
              content: `以下の食材を使って、料理名、レシピ、材料の分量、及び代替の料理名候補を教えてください。\n食材: ${ingredients}`,
            },
          ],
          max_tokens: 500, // 必要に応じて増やす
          temperature: 0.5, // 創造性を抑えて正確性を高める
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