function clearOldMessage() {
  // SlackAPI用の変数を準備
  var url = 'https://slack.com/api/';
  var token = '?token=' + PropertiesService.getScriptProperties().getProperty('slack_oauth_access_token');

  // ログを自動削除するチャンネル名と、何日分のメッセージを残しておくかを設定
  var target_channel_name = '';
  var target_channel_names = {
    '': '7',
    '': '7'
  }
  var date = new Date();
  var now_unix_timestamp = Math.floor( date.getTime() / 1000 );
  var range_unix_timestamp = now_unix_timestamp - (60 * 60 * 24 * 7); // このタイムスタンプまでのメッセージを削除処理する

  // SlackAPIでチャンネルリストを取得
  var method = 'channels.list';
  var exec_api = url + method + token;
  var response = UrlFetchApp.fetch(exec_api);
  var json = response.getContentText();
  var data = JSON.parse(json);
  // チャンネルIDを取得
  for (var i=0; i<data.channels.length; i++) {
    if (data.channels[i].name == target_channel_name) {
      var target_channel_id = data.channels[i].id;
      break;
    }
  }

  // SlackAPIで削除するメッセージのタイムスタンプ一覧を取得
  var method = 'channels.history';
  var arg1 = '&channel=' + target_channel_id;
  var arg2 = '&latest=' + range_unix_timestamp;
  var arg3 = '&count=' + 1000; // 最大で一度に1000件まで削除
  var exec_api = url + method + token + arg1 + arg2 + arg3;
  var response = UrlFetchApp.fetch(exec_api);
  var json = response.getContentText();
  var data = JSON.parse(json);
  var arrTimeStamp = [];
  for (var i=0; i<data.messages.length; i++) {
    arrTimeStamp.push(data.messages[i]['ts']);
  }
  Logger.log(range_unix_timestamp);

  // SlackAPIで不要なログを自動削除
  var method = 'chat.delete';
  var arg1 = '&channel=' + target_channel_id;
  for (var i=0; i<arrTimeStamp.length; i++) {
    var arg2 = '&ts=' + arrTimeStamp[i];
    var exec_api = url + method + token + arg1 + arg2;
    UrlFetchApp.fetch(exec_api);
    Utilities.sleep(1000); // 処理を1秒遅延させる
  }

  // SlackAPIで削除完了メッセージを投稿
  var method = 'chat.postMessage';
  var arg1 = '&channel=%23general';
  var arg2 = '&text=不要な過去ログを削除しました';
  var exec_api = url + method + token + arg1 + arg2;
  var response = UrlFetchApp.fetch(exec_api);

}
