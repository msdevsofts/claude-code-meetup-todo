# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 作業ルール

- **SPEC.md が仕様の正。** 実装・テストは SPEC.md に従う。コードと SPEC.md が食い違う場合はコードを修正する。
- **変更は依頼された範囲に限定する。** 依頼外で気づいた問題は修正せず、作業後に報告する。
- **`data/` ディレクトリは実行時に自動生成される。** 直接編集しない。

## コマンド

```bash
npm run dev      # 開発サーバー起動
npm run lint     # ESLint
npm test         # テスト全件実行 (vitest)
```

単一テストファイルの実行（Git Bash または cmd で実行）:
```bash
npx vitest run lib/date.test.ts
```

## アーキテクチャ

Next.js 15 (App Router) の TODO アプリ。DB なし、`data/todos.json` にファイル永続化（初回起動時にシードデータで自動生成）。

- `lib/store.ts` — 永続化層。`load()` / `save()` 経由でのみ読み書き。
- `app/api/todos/route.ts` — `GET`（一覧）/ `POST`（追加）
- `app/api/todos/[id]/route.ts` — `PATCH`（完了トグル）/ `DELETE`
- `app/page.tsx` — 単一クライアントコンポーネント。API を呼んで UI 状態を管理。
- `lib/date.ts` — 日付ユーティリティ。テスト: `lib/date.test.ts`

## 次リリース予定（未実装）

優先度フィールド（`high` / `medium` / `low`） — SPEC.md §7 参照。
