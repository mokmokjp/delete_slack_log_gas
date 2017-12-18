
# delete_slack_log_gas

## 概要
Slack上の、特定チャンネルの、特定日時以前の過去ログを自動で削除する、GoogleAppsScript

## 使い方

Slack Appsを作成する
1. https://api.slack.com/apps からslack appsを新規作成
2. 機能＞OAuth & 権限 ページで、スコープを設定する
3. 設定＞アプリをインストール ページで、インストールする
4. 機能＞OAuth & 権限 ページで、OAuthアクセストークンをコピーする

Google Apps Script を作成する
1. [Googleドライブ内](https://drive.google.com/drive/u/0/my-drive)にGoogle Apps Scriptを作成
2. GASのファイル＞プロジェクトのプロパティ＞スクリプトのプロパティに、OAuthアクセストークンをペースト
```
名前: slack_oauth_access_token 値: OAuthアクセストークンの値
```
3. src.jsのコードを修正
```js
  // ログを自動削除するチャンネル名と、何日分のメッセージを残しておくかを設定
  var objTargetChannels = {
    'チャンネル名': '14'
    , 'チャンネル名': '14'
  }
```
4. src.jsのコードをGASエディター上にペースト
5. GASエディターで、トリガーを設定
