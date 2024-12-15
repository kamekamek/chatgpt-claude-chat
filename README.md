# 🤖 ChatGPT-Claude 会話 MCP サーバー

このプロジェクトは、Model Context Protocol (MCP) を使用して、ChatGPTとClaudeの会話をシミュレートするサーバーを実装しています。

## 📋 機能

- ChatGPTとClaudeの会話をシミュレート
- 指定されたトピックに基づいて会話を生成
- 指定された回数のターンで会話を実行

## 🛠 セットアップ

1. このリポジトリをクローンします。
2. 必要な依存関係をインストールします：
   ```
   npm install
   ```
3. `.env`ファイルを作成し、OpenAI APIキーを設定します：
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
4. サーバーをビルドします：
   ```
   npm run build
   ```

## 🚀 使用方法

1. サーバーを起動します：
   ```
   npm start
   ```
2. MCPクライアント（例：Claude.app）を使用して、サーバーに接続します。
3. `start_conversation`ツールを使用して、会話を開始します。以下のパラメータが必要です：
   - `topic`: 会話のトピック（文字列）
   - `turns`: 会話のターン数（数値）

## 📝 注意事項

- このプロジェクトは、OpenAI APIを使用してChatGPTとClaudeの両方の応答を生成しています。実際のClaudeAPIは使用していません。
- APIキーの使用には注意してください。不適切な使用は避け、OpenAIの利用規約に従ってください。

## 🤝 貢献

プルリクエストは歓迎します。大きな変更を加える場合は、まずissueを開いて変更内容を議論してください。

## 📄 ライセンス

[MIT](https://choosealicense.com/licenses/mit/)
