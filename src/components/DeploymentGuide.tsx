import React from 'react';
import { Github, Cloud, FileText, CheckCircle2, Terminal, Key } from 'lucide-react';

export const DeploymentGuide: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto text-zinc-200">
      
      {/* イントロダクション */}
      <div className="bg-gradient-to-br from-indigo-950/80 via-zinc-900 to-zinc-900 border border-indigo-500/30 p-6 sm:p-8 rounded-3xl shadow-2xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-indigo-600/20 border border-indigo-500/40 rounded-2xl text-indigo-400">
            <Cloud className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              GitHub Pages & Cloudflare Pages 公開・環境変数設定ガイド
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              作成したWebサイトを無料で世界中に公開・高速配信し、Discord OAuth連携環境変数を設定する完全手順です。
            </p>
          </div>
        </div>
      </div>

      {/* Cloudflare Pages 環境変数設定の手順 */}
      <div className="bg-zinc-900/90 border border-indigo-500/30 p-6 rounded-2xl space-y-4 shadow-xl">
        <h3 className="text-base font-extrabold text-indigo-300 flex items-center gap-2">
          <Key className="w-5 h-5 text-indigo-400" /> Cloudflare Pages 環境変数 (Variables and secrets) の設定
        </h3>

        <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
          <p className="text-zinc-400">
            Discord 連携認証機能を使用するには、Cloudflare Pages のダッシュボードで以下の環境変数を登録する必要があります。
          </p>

          <ol className="list-decimal list-inside space-y-2 bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-zinc-300">
            <li>Cloudflare ダッシュボードにログインし、対象の <strong>Pages プロジェクト</strong> を開きます。</li>
            <li><strong>Settings → Variables and secrets</strong> メニューを開きます。</li>
            <li><strong>Add variable</strong> (または Environment Variables) をクリックし、以下を登録します：
              <div className="mt-2 space-y-2 font-mono text-[11px] bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                <div><span className="text-indigo-400 font-bold">DISCORD_CLIENT_ID</span> : Discord Developer Portalの Client ID</div>
                <div><span className="text-indigo-400 font-bold">DISCORD_CLIENT_SECRET</span> : Discord Developer Portalの Client Secret</div>
                <div><span className="text-indigo-400 font-bold">DISCORD_REDIRECT_URI</span> : <code className="text-amber-300">https://your-app.pages.dev/api/auth/discord/callback</code></div>
                <div><span className="text-indigo-400 font-bold">DISCORD_GUILD_ID</span> : 特定Discordサーバーの ギルドID</div>
              </div>
            </li>
            <li>設定を保存し、再デプロイ（または「Deployments」で再作成）を行うと有効化されます。</li>
          </ol>
        </div>
      </div>

      {/* 変更点と設定ファイルの説明 */}
      <div className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-2xl space-y-4">
        <h3 className="text-base font-extrabold text-amber-400 flex items-center gap-2">
          <FileText className="w-5 h-5" /> 1. 設定ファイルの重要指定箇所
        </h3>

        <div className="space-y-3 text-xs leading-relaxed">
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
            <div className="font-bold text-indigo-300 font-mono">1. vite.config.ts (Baseパスの設定)</div>
            <p className="text-zinc-400">
              GitHub Pagesでサブディレクトリホスティング（例: <code className="text-amber-300">https://username.github.io/repository-name/</code>）する場合、<code className="text-amber-300">base</code> オプションを指定します。
            </p>
            <pre className="bg-zinc-900 p-3 rounded-lg text-emerald-400 font-mono text-[11px] overflow-x-auto">
{`// vite.config.ts に追加
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/<your-repo-name>/' : '/',
  // Cloudflare Pages や独自ドメインの場合は '/' のままでOKです！
})`}
            </pre>
          </div>

          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
            <div className="font-bold text-indigo-300 font-mono">2. package.json (ビルド＆デプロイスクリプト)</div>
            <p className="text-zinc-400">
              ビルド時は TypeScript の型チェック（<code className="text-emerald-300">tsc</code>）を通して静的ファイルを生成します。
            </p>
            <pre className="bg-zinc-900 p-3 rounded-lg text-emerald-400 font-mono text-[11px] overflow-x-auto">
{`"scripts": {
  "dev": "vite",
  "build": "tsc --noEmit && vite build",
  "preview": "vite preview"
}`}
            </pre>
          </div>
        </div>
      </div>

      {/* GitHub Pages 公開手順 */}
      <div className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-2xl space-y-4">
        <h3 className="text-base font-extrabold text-indigo-400 flex items-center gap-2">
          <Github className="w-5 h-5" /> 2. GitHub Pages での自動公開手順 (GitHub Actions)
        </h3>

        <ol className="space-y-3 text-xs text-zinc-300 list-decimal list-inside leading-relaxed">
          <li className="pl-1">
            <strong>GitHubリポジトリを作成してコードをコミット＆プッシュ:</strong>
            <pre className="bg-zinc-950 p-3 rounded-xl text-zinc-200 font-mono text-[11px] mt-1.5 overflow-x-auto">
{`git init
git add .
git commit -m "Initial commit for イタチイタ戦隊キャラ図鑑"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main`}
            </pre>
          </li>

          <li className="pl-1">
            <strong>GitHub Actions ワークフローを作成:</strong><br />
            プロジェクトルートに <code className="text-indigo-300">.github/workflows/deploy.yml</code> を作成します。
            <pre className="bg-zinc-950 p-3 rounded-xl text-amber-300 font-mono text-[11px] mt-1.5 overflow-x-auto">
{`name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
      - uses: actions/deploy-pages@v3`}
            </pre>
          </li>

          <li className="pl-1">
            <strong>GitHubリポジトリ設定の有効化:</strong><br />
            リポジトリの <strong>Settings → Pages</strong> を開き、<code className="text-emerald-300">Source</code> を <strong>「GitHub Actions」</strong> に変更します。これだけでプッシュするたびに自動公開されます！
          </li>
        </ol>
      </div>

      {/* Cloudflare Pages 公開手順 */}
      <div className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-2xl space-y-4">
        <h3 className="text-base font-extrabold text-orange-400 flex items-center gap-2">
          <Cloud className="w-5 h-5" /> 3. Cloudflare Pages での公開手順
        </h3>

        <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
            <h4 className="font-bold text-amber-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 方法A: Cloudflare Pages Git連携（推奨！）
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 pl-2 text-zinc-400">
              <li>Cloudflare ダッシュボードにログイン → <strong>Workers & Pages</strong> を選択。</li>
              <li><strong>「Pages」→「Git に接続」</strong> をクリック。</li>
              <li>GitHubリポジトリを選択。</li>
              <li>ビルド設定:
                <ul className="list-disc list-inside pl-4 my-1 text-zinc-300 font-mono text-[11px]">
                  <li>フレームワーク プリセット: <strong>Vite</strong></li>
                  <li>ビルド コマンド: <code className="text-emerald-400">npm run build</code></li>
                  <li>ビルド出力ディレクトリ: <code className="text-emerald-400">dist</code></li>
                </ul>
              </li>
              <li>「保存してデプロイ」をクリックすると自動的にデプロイされます！</li>
            </ol>
          </div>

          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
            <h4 className="font-bold text-indigo-300 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-indigo-400" /> 方法B: Wrangler CLI を使ったコマンドデプロイ
            </h4>
            <pre className="bg-zinc-900 p-3 rounded-xl text-zinc-200 font-mono text-[11px] overflow-x-auto">
{`# 1. ビルド実行
npm run build

# 2. Wrangler CLI で Cloudflare Pages へ即座にデプロイ
npx wrangler pages deploy dist --project-name=itachi-781`}
            </pre>
          </div>
        </div>
      </div>

    </div>
  );
};
