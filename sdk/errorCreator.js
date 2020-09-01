const JS_ERROR = 10
const REJ_ERROR = 20
const RESOURCE_ERROR = 30
// JS错误日志
export function JSError (errorMsg, errorStack) {
  this.uploadType = JS_ERROR;
  this.errorMessage = encodeURIComponent(errorMsg);
  this.errorStack = errorStack;
}

// promise uncatch错误日志
export function RejError (errorMsg) {
  this.uploadType = REJ_ERROR;
  this.errorMessage = encodeURIComponent(errorMsg);
}

// 资源加载错误
export function ResourceError (type, url) {
  this.uploadType = RESOURCE_ERROR
  this.resourceType = type
  this.resourceUrl = url
}
