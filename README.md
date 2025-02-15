# Palette Recipe

Palette Recipe は、ユーザーが入力した食材情報をもとに、料理名、レシピ、及び材料の分量を生成する革新的なレシピ生成ツールです。
ChatGPT API を利用して、入力された食材から美味しそうな料理の提案と詳細なレシピを自動生成します。また、生成結果に基づいた料理画像も取得できるため、視覚的にレシピを楽しむことができます。

## 特徴

### • 自動レシピ生成
- ChatGPT API により、食材から料理名、手順、材料の分量を JSON 形式で生成します。
- 各レシピは番号付きの手順として表示され、見やすく整理されています。

### • 画像生成
- DALL·E API などを利用して、生成された料理に基づく画像候補を最大 4 枚生成。
- 画像は横並びで表示され、はみ出した場合は横スクロールで確認できます。

### • ユーザーフレンドリーなデザイン
- Tailwind CSS による温かみのあるグラデーション背景と丸みを帯びたフォーム、ボタンで、直感的に操作できます。
- レスポンシブ対応で、どのデバイスからでも快適に利用可能です。

## インストール

### ローカル環境でのセットアップ

1. リポジトリをクローンします。

```sh
git clone https://github.com/your-username/palette-recipe.git
cd palette-recipe
```

2. 依存関係をインストールします。

```sh
yarn install
```

3. プロジェクトルートに `.env` ファイルを作成し、以下のように環境変数を設定します。

```sh
VITE_OPENAI_API_KEY=sk-XXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

4. 開発サーバーを起動します。

```sh
yarn dev
```

## デプロイ

このプロジェクトは Vercel によって自動デプロイされています。
GitHub リポジトリの `main` ブランチに変更をプッシュすると、Vercel が自動でビルド・デプロイを実行し、最新の変更が反映されます。

### Vercel への環境変数の設定

1. Vercel のダッシュボードで対象のプロジェクトを選択します。
2. `Settings` → `Environment Variables` に移動し、以下の環境変数を追加します。
   - `VITE_OPENAI_API_KEY` – あなたの OpenAI API キー

これにより、ビルド時に環境変数が注入され、アプリ内で `import.meta.env.VITE_OPENAI_API_KEY` を通じて参照できます。

