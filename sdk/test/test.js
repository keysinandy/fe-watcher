/* eslint-disable */

import {init, setUser} from '../index'
init('test-project', {
  debug: true
})

fetch('312').then(res => {
  if (!res.ok) {
    // console.log(res)
    return Promise.reject(res.status + ' ' + res.statusText + ' ' + res.url)
  }
})

throw new Error("throw error")

