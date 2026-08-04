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
          <Key className="w-5 h-5 text-indigo-400" /> Cloudflare ダッシュボードでの環境変数設定手順
        </h3>

        <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
          <p className="text-zinc-400">
            プロジェクトに <code className="text-amber-300">wrangler.jsonc</code> (または <code className="text-amber-300">wrangler.toml</code>) が含まれている場合、Cloudflare ダッシュボードでは通常の「Variables」の編集が制限され、<strong>「Secrets (暗号化変数)」として登録する仕様</strong>になります。
          </p>

          <div className="bg-rose-950/40 border border-rose-500/40 p-4 sm:p-5 rounded-xl text-rose-200 font-semibold space-y-3">
            <p className="text-xs sm:text-sm font-bold text-rose-300 flex items-center gap-1.5">
              🛑 Cloudflare Dashboardでのロック（編集不可・削除不可・重複エラー）の完全解決策
            </p>
            <p className="text-[11px] sm:text-xs text-rose-200/90 font-normal leading-relaxed">
              Cloudflare Pages はリポジトリに <code className="text-amber-300">wrangler.jsonc</code> が存在すると、過去に宣言された変数をダッシュボード上でロックし、<strong>編集・削除・Secretの追加（衝突エラー）を受け付けなくする仕様</strong>です。
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-[11px] sm:text-xs font-normal">
              <div className="bg-zinc-950/90 p-3.5 rounded-xl border border-emerald-500/40 space-y-2">
                <p className="font-bold text-emerald-300 text-xs flex items-center gap-1">
                  【方法 A】wrangler.jsonc に直接記入（一番簡単・確実！）
                </p>
                <p className="text-zinc-300 leading-relaxed text-[11px]">
                  ダッシュボードでの操作で詰まった場合、GitHub の <code className="text-amber-300">wrangler.jsonc</code> 内の <code className="text-amber-300">vars</code> に直接あなたの実際の ID（数字）を記入して Git プッシュしてください。自動的に即座に反映されます。
                </p>
                <div className="bg-zinc-900 p-2 rounded text-[10px] font-mono text-emerald-300 overflow-x-auto border border-zinc-800">
                  "vars": &#123;<br />
                  &nbsp;&nbsp;"DISCORD_CLIENT_ID": "12345678...",<br />
                  &nbsp;&nbsp;"DISCORD_REDIRECT_URI": "https://...",<br />
                  &nbsp;&nbsp;"DISCORD_GUILD_ID": "98765432..."<br />
                  &#125;
                </div>
                <p className="text-[10px] text-zinc-400">
                  ※ <code className="text-amber-300">DISCORD_CLIENT_SECRET</code> のみは過去に存在しないため、ダッシュボードの <strong>Add secret</strong> から問題なく追加できます。
                </p>
              </div>

              <div className="bg-zinc-950/90 p-3.5 rounded-xl border border-indigo-500/40 space-y-2">
                <p className="font-bold text-indigo-300 text-xs flex items-center gap-1">
                  【方法 B】ダッシュボードだけで管理したい場合
                </p>
                <p className="text-zinc-300 leading-relaxed text-[11px]">
                  すべての変数を Cloudflare ダッシュボード上で管理したい場合は、リポジトリから <code className="text-amber-300">wrangler.jsonc</code> ファイルを削除して Git プッシュします。<br />
                  Wrangler 連動が解除され、ダッシュボードでのロックが完全に外れます。
                </p>
              </div>
            </div>
          </div>

          <ol className="list-decimal list-inside space-y-2 bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-zinc-300">
            <li>Cloudflare ダッシュボードにログインし、対象の <strong>Pages プロジェクト</strong> を開きます。</li>
            <li><strong>Settings → Variables and secrets</strong> メニューを開きます。</li>
            <li><strong>Add secret</strong> (または Variables) ボタンをクリックし、以下の4つを登録します：
              <div className="mt-2 space-y-2 font-mono text-[11px] bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                <div><span className="text-indigo-400 font-bold">DISCORD_CLIENT_ID</span> : Discord Developer Portalの Client ID (数字のID。例: <code className="text-amber-300">123456789012345678</code>)</div>
                <div><span className="text-indigo-400 font-bold">DISCORD_CLIENT_SECRET</span> : Discord Developer Portalの Client Secret (暗号化文字列)</div>
                <div><span className="text-indigo-400 font-bold">DISCORD_REDIRECT_URI</span> : <code className="text-amber-300">https://itachi-781.pages.dev/api/auth/discord/callback</code></div>
                <div><span className="text-indigo-400 font-bold">DISCORD_GUILD_ID</span> : 対象Discordサーバーの ギルドID (数字のID。例: <code className="text-amber-300">987654321098765432</code>)</div>
              </div>
            </li>
            <li><strong>【重要】環境変数追加後に最新コードをGitHubへプッシュ（再デプロイ）</strong>してください。</li>
          </ol>

          <div className="bg-rose-950/40 border border-rose-500/30 p-4 rounded-xl text-rose-200 space-y-2 font-sans">
            <p className="text-xs font-bold text-rose-300 flex items-center gap-1">
              ⚠️ それでも環境変数エラーが解消されない場合の確認チェックリスト：
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-[11px] text-rose-200/90 leading-relaxed">
              <li>
                <strong>① 「Production」環境に登録されているか：</strong><br />
                Cloudflareダッシュボードの [Settings] → [Variables and secrets] で、<strong>「Production」</strong> の欄に変数が追加されているか確認してください（Previewのみに追加されていると本番URLで読み込めません）。
              </li>
              <li>
                <strong>② 最新コードのプッシュ（GitHubコミット）：</strong><br />
                直前にエラーとなっていた <code className="text-amber-300">wrangler.jsonc</code> の修正コードを GitHub に <code className="text-emerald-300">git push</code> してください。ビルドエラーが解消された新しいビルドがデプロイされることで初めて環境変数がFunctionsに接続されます。
              </li>
              <li>
                <strong>③ 環境変数名（スペル・大文字）の確認：</strong><br />
                変数名が完全一致（例: <code className="text-indigo-300">DISCORD_CLIENT_ID</code>）しているか、余計な空白スペースが含まれていないか確認してください。
              </li>
            </ul>
          </div>
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
