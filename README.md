# Gasshee GAS Server

個人サーバーに頼らないキャラクターシート Gasshee の GAS サーバ側。

Google Drive と Google Apps Scripts を利用することで Google が落ちない限りは使える。
Google Apps Scripts がダメになっても Drive が動いていればサルベージがかんたん。
Google Drive の中身をローカルに同期しておくなどすると Google Drive が落ちてもサルベージできる。

## サーバーの建て方

### 事前準備

1. clasp を入れておく `npm install -g @google/clasp"`
2. Google アカウントで Google Apps Scripts にプロジェクトと保存用のフォルダを作成する
3. 「プロジェクトの設定」から、スクリプトプロパティに「キー: FOLDER_ID」「値: 保存用フォルダの ID」を設定する

### サーバー本体

1. このリポジトリを git clone する
2. .clasp.json の scriptId を事前準備で作成したプロジェクトの ID に書き換える
3. `npm install`
4. `clasp login` でコンソールでログインする
5. `npm run push`
6. GAS 側で「デプロイ」→「新しいデプロイ」→「種類の選択: ウェブアプリ」
7. 「次のユーザーとして実行: 自分」「アクセスできるユーザー: 全員」でデプロイ、URL をメモしてクライアント側で設定する。

### クライアント

クライアントの立て方は [Gasshee](https://github.com/reismannnr2/gasshee) で
