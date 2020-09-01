/* eslint-disable */

/**
 * 页面接口请求监控
 */
const recordHttpLog = () => {
  // 监听ajax的状态
  const eventRegister = (event) => {
    let eve = new CustomEvent(event, {
        detail: this
    });
    window.dispatchEvent(eve);
  }
  let oldXHR = window.XMLHttpRequest;
  const newXHR = () => {
      var realXHR = new oldXHR();
      // 添加了两个自定义监听器
      realXHR.addEventListener(
        "loadstart",
        function() {
          eventRegister.call(this, "ajaxLoadStart");
        },
        false
      );
      realXHR.addEventListener(
        "loadend",
        function() {
          eventRegister.call(this, "ajaxLoadEnd");
        },
        false
      );
      // 此处的捕获的异常会连日志接口也一起捕获，如果日志上报接口异常了，就会导致死循环了。
      // realXHR.onerror = function () {
      //   siftAndMakeUpMessage("Uncaught FetchError: Failed to ajax", WEB_LOCATION, 0, 0, {});
      // }
      return realXHR;
  }
  var timeRecordArray = [];
  window.XMLHttpRequest = newXHR;
  window.addEventListener("ajaxLoadStart", function(e) {
    console.log(e,'ajaxLoadStart')
    // var tempObj = {
    //     timeStamp: new Date().getTime(),
    //     event: e
    // };
    // timeRecordArray.push(tempObj);
  });
  window.addEventListener("ajaxLoadEnd", function() {
    for (var i = 0; i < timeRecordArray.length; i++) {
      if (timeRecordArray[i].event.detail.status > 0) {
        var currentTime = new Date().getTime();
        var url = timeRecordArray[i].event.detail.responseURL;
        var status = timeRecordArray[i].event.detail.status;
        var statusText = timeRecordArray[i].event.detail.statusText;
        var loadTime = currentTime - timeRecordArray[i].timeStamp;
        if (!url || url.indexOf(HTTP_UPLOAD_LOG_API) != -1) return;
        var httpLogInfoStart = new HttpLogInfo(
            HTTP_LOG,
            url,
            status,
            statusText,
            "发起请求",
            timeRecordArray[i].timeStamp,
            0
        );
        httpLogInfoStart.handleLogInfo(HTTP_LOG, httpLogInfoStart);
        var httpLogInfoEnd = new HttpLogInfo(
            HTTP_LOG,
            url,
            status,
            statusText,
            "请求返回",
            currentTime,
            loadTime
        );
        httpLogInfoEnd.handleLogInfo(HTTP_LOG, httpLogInfoEnd);
        // 当前请求成功后就在数组中移除掉
        timeRecordArray.splice(i, 1);
      }
    }
  });
}
