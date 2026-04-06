# chiro-intake-web
整体院向け「AIヒアリングナビ」のフロントエンドアプリケーションです。  
ユーザーの身体の状態や悩みをヒアリングし、適切な施術導線へつなげることを目的としています。


## Stack
- Next.js 14 (App Router)
- TypeScript, React
- TailwindCSS, shadcn/ui
- デプロイ: Vercel


## 必要環境
- Node.js 20+
- pnpm （推奨）


## セットアップ
pnpm i
cp .env.example .env.local
pnpm dev

## 起動手順
cd chiro-intake-web
pnpm dev


## 主な機能
- ユーザー入力フォーム（症状・状態ヒアリング）
- 入力内容に応じた分岐ロジック
- APIとの連携によるデータ送受信
- モバイルファーストのUI設計

## 工夫した点
- フォーム離脱を防ぐため、直感的でシンプルなUI/UXを設計
- 回答内容に応じた動的な画面遷移・分岐処理を実装
- 実運用を想定した導線設計（ヒアリング→予約導線）
- AI活用（ChatGPT等）を前提としたヒアリング設計

## アクセス
http://localhost:3000
