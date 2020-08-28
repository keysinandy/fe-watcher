const getRandomKey = (time = 1) => {
  let getRandomStr = function () {
    return Math.random().toString(32).slice(2, 7)
  }
  let randomStr = ''
  for (let i = 0; i < time; i++) {
    randomStr += getRandomStr()
    i !== time - 1 && (randomStr += '-')
  }
  return randomStr
}

const extend = () => {

}

/**
 *
 * @param method  请求类型(大写)  GET/POST
 * @param url     请求URL
 * @param param   请求参数
 * @param successCallback  成功回调方法
 * @param failCallback   失败回调方法
 */
const request = (method, url, param, successCallback, failCallback) => {
  // eslint-disable-next-line no-undef
  let xmlHttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
  xmlHttp.open(method, url, true);
  xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status >= 200 && xmlHttp.status < 300) {
      let res = JSON.parse(xmlHttp.responseText);
      typeof successCallback == 'function' && successCallback(res);
    } else {
      typeof failCallback == 'function' && failCallback();
    }
  };
  xmlHttp.send("data=" + JSON.stringify(param));
}

export {
  getRandomKey,
  request
}
