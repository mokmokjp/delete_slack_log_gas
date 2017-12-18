function clearOldMessage() {
  // SlackAPI用の変数を準備
  var url = 'https://slack.com/api/';
  var token = '?token=' + PropertiesService.getScriptProperties().getProperty('slack_oauth_access_token');

  // ログを自動削除するチャンネル名と、何日分のメッセージを残しておくかを設定
  var objTargetChannels = {
    'チャンネル名': '14'
    , 'チャンネル名': '14'
  }

  // 現在日時
  var date = new Date();
  var now_unix_timestamp = Math.floor( date.getTime() / 1000 );

  // SlackAPIでチャンネルリストを取得
  var method = 'channels.list';
  var exec_api = url + method + token;
  var response = UrlFetchApp.fetch(exec_api);
  var json = response.getContentText();
  var data = JSON.parse(json);

  for (var i=0; i<data.channels.length; i++) {
    if (data.channels[i].name in objTargetChannels === true) {
      var target_channel_name      = data.channels[i].name;
      var target_channel_id        = data.channels[i].id;
      var target_channel_time      = objTargetChannels[target_channel_name];
      var target_channel_timestamp = now_unix_timestamp - (60 * 60 * 24 * target_channel_time);
      Logger.log(target_channel_time);

      // SlackAPIで、削除対象チャンネルの、削除対象メッセージのタイムスタンプ一覧を取得
      var method = 'channels.history';
      var arg1 = '&channel=' + target_channel_id;
      var arg2 = '&latest=' + target_channel_timestamp;
      var arg3 = '&count=' + 1000; // 最大で一度に1000件まで削除
      var exec_api = url + method + token + arg1 + arg2 + arg3;
      var response = UrlFetchApp.fetch(exec_api);
      var json = response.getContentText();
      var data_j = JSON.parse(json);
      var arrTimeStamp = [];
      for (var j=0; j<data_j.messages.length; j++) {
        arrTimeStamp.push(data_j.messages[j]['ts']);
      }

      // SlackAPIで不要なログを自動削除
      var method = 'chat.delete';
      var arg1 = '&channel=' + target_channel_id;
      for (var k=0; k<arrTimeStamp.length; k++) {
        var arg2 = '&ts=' + arrTimeStamp[k];
        var exec_api = url + method + token + arg1 + arg2;
        UrlFetchApp.fetch(exec_api);
        Utilities.sleep(1000); // 処理を1秒遅延させる
      }

      // SlackAPIで削除完了メッセージを投稿
      var method = 'chat.postMessage';
      var arg1 = '&channel=%23' + target_channel_name;
      var arg2 = '&text=' + target_channel_time + '日分以前の過去ログを削除しました';
      var exec_api = url + method + token + arg1 + arg2;
      var response = UrlFetchApp.fetch(exec_api);
    }
  }

}
