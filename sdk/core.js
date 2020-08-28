import { getRandomKey, getDeviceInfo, request, config } from './internal'

const JS_ERROR = 10;

// 基本信息
function BaseMonitorInfo () {
  // this.happenTime = new Date().getTime(); // 日志发生时间
  this.projectId = ''    // 用于区分应用的唯一标识（一个项目对应一个）
  // this.simpleUrl =  window.location.href.split('?')[0].replace('#', ''); // 页面的url
  this.visitorKey = getRandomKey()  // 每一个页面对应一个值，当用户登陆后可覆盖这个值

  // 获取设备信息
  let deviceInfo = getDeviceInfo()
  this.engine = deviceInfo.engine
  this.engineVs = deviceInfo.engineVs
  this.systemName = deviceInfo.sys
  this.systemVersion = deviceInfo.sysVs
  this.browserName = deviceInfo.supporter
  this.browserVersion = deviceInfo.supporterVs

  // TODO: 位置信息, 待处理
  this.monitorIp = "";  // 用户的IP地址
  this.country = "";  // 用户所在国家
  this.province = "";  // 用户所在省份
  this.city = "";  // 用户所在城市
  // 用户自定义信息， 由开发者主动传入， 便于对线上进行准确定位
  this.userId = "";

  this.errorStack = [];
  this.setUser = (id) => {
    this.userId = id
  }
  this.setProjectId = (id) => {
    this.projectId = id
  }

  this.isInit = this.projectId !== ''
  this.pushStack = (errorObj) => {
    this.errorStack.push(errorObj)
  }
  // 设置一个定时器，定时上报错误
  this.start = () => {
    setInterval(() => {
      let stack = this.errorStack.slice()
      this.errorStack = []
      request('get', config.remoteUrl, stack)
    }, 2000)
  }
}

// 创建他的实例
const monitorInstance = new BaseMonitorInfo()

// JS错误日志
function JSError (errorMsg, errorStack) {
  this.uploadType = JS_ERROR;
  this.errorMessage = encodeURIComponent(errorMsg);
  this.errorStack = errorStack;
  this.timestamp = new Date().getTime()
  this.currentUrl = window.location.href
}

/**
 * 初始化方法，传入projectId
 * @param {*} projectId
 * @param {*} options
 * debug-boolean
 */
export const init = (projectId, options) => {
  monitorInstance.setProjectId(projectId)
  monitorInstance.start()
  // 记录js错误
  recordJavaScriptError()
}

/**
 * 页面JS错误监控
 */
const recordJavaScriptError = () => {
  // 重写 onerror 进行jsError的监听
  window.onerror = function (errorMsg, url, lineNumber, columnNumber, errorObj) {
    let errorStack = errorObj ? errorObj.stack : null;
    siftAndMakeUpMessage(errorMsg, url, lineNumber, columnNumber, errorStack);
  };

  function siftAndMakeUpMessage (origin_errorMsg, origin_url, origin_lineNumber, origin_columnNumber, origin_errorObj) {
    let errorMsg = origin_errorMsg ? origin_errorMsg : '';
    let errorObj = origin_errorObj ? origin_errorObj : '';
    let errorType = "";
    if (errorMsg) {
      let errorStackStr = JSON.stringify(errorObj)
      errorType = errorStackStr.split(": ")[0].replace('"', "");
    }
    let jsError = new JSError(errorType + ": " + errorMsg, errorObj);
    monitorInstance.pushStack(jsError)
  }
}

/**
 * 设置用户唯一id，在登陆时使用
 * @param {*} id
 */
export const setUser = (id) => {
  monitorInstance.setUser(id)
}
