import { getRandomKey, getDeviceInfo, request, config, JSError, RejError, ResourceError } from './internal'

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
  this.debug = false;
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
      if (this.errorStack.length <= 0) {
        return
      }
      let stack = this.errorStack.slice()
      this.errorStack = []
      request('get', config.remoteUrl, stack)
    }, 2000)
  }

  this.log = (...msg) => {
    if (this.debug) {
      console.log(...msg)
    }
  }
}

// 创建他的实例
const monitorInstance = new BaseMonitorInfo()

/**
 * 初始化方法，传入projectId
 * @param {*} projectId
 * @param {*} options
 * debug-boolean
 */
export const init = (projectId, options) => {
  monitorInstance.setProjectId(projectId)
  monitorInstance.start()
  if (options.debug) {
    monitorInstance.debug = true
  }
  // 记录js错误
  recordJavaScriptError()
}

/**
 * 页面错误监控
 */
const recordJavaScriptError = () => {
  // 对error添加监听
  addEventListener('error', (e) => {
    let errorObj = e.error
    let errorStack = errorObj ? errorObj.stack : null
    let errorMsg = e.message
    let typeName = e.target.localName;
    let sourceUrl = "";
    if (!typeName) {
      pushJSError(errorMsg, errorStack);
    } else {
      switch (typeName) {
      case 'href':
        sourceUrl = e.target.href
        break;
      case 'script':
        sourceUrl = e.target.src
        break;
      case 'img':
        sourceUrl = e.target.src
        break;
      default:
        break;
      }
      // TODO: css background-img url 无法收集
      pushSourceError(typeName, sourceUrl)
    }
  }, true)

  addEventListener('unhandledrejection', (e) => {
    pushRejectError(e.reason);
  }, true)


}

const pushJSError = (origin_errorMsg, origin_errorObj) => {
  let errorMsg = origin_errorMsg ? origin_errorMsg : '';
  let errorObj = origin_errorObj ? origin_errorObj : '';
  let errorType = "";
  if (errorMsg) {
    let errorStackStr = JSON.stringify(errorObj)
    errorType = errorStackStr.split(": ")[0].replace('"', "");
  }
  let jsError = new JSError(errorType + ": " + errorMsg, errorObj);
  monitorInstance.log(jsError)
  monitorInstance.pushStack(jsError)
}

const pushRejectError = (origin_errorMsg) => {
  let errorMsg = origin_errorMsg ? origin_errorMsg : '';
  let rejError = new RejError(errorMsg);
  monitorInstance.log(rejError)
  monitorInstance.pushStack(rejError)
}

const pushSourceError = (resourceType, resourceUrl) => {
  let resourceError = new ResourceError(resourceType, resourceUrl);
  monitorInstance.log(resourceError)
  monitorInstance.pushStack(resourceError)
}

/**
 * 设置用户唯一id，在登陆时使用
 * @param {*} id
 */
export const setUser = (id) => {
  monitorInstance.setUser(id)
}
