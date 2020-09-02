/* eslint-disable */

import React, { useState } from 'react'
import style from './test.module.scss'

const Test = () => {

  const [imgSrc, setImgSrc] = useState('')
  const [cssSrc, setCssSrc] = useState('')
  const [scriptSrc, setScriptSrc] = useState('')

  const createError = (e) => {
    switch (e.target.id) {
    case 1:
      const e = 1
      e = 2
      break;
    case 2:
      new Promise.reject('reason')
      break;
    case 3:
      setImgSrc(`@radomImg${Math.random().toString(32).slice(2,7)}`)
      break;
    case 4:
      setCssSrc(`@radomCss${Math.random().toString(32).slice(2,7)}`)
      break;
    case 4:
      setScriptSrc(`@radomCss${Math.random().toString(32).slice(2,7)}`)
      break;
    default:
      break;
    }
  }

  return <>
    <p>点击生成异常</p>
    <ul  onClick={createError}>
      <li id='1'>js异常</li>
      <li id='2'>uncatch reject异常</li>
      <li id='3'>css加载异常</li>
      <li id='4'>image加载异常</li>
      <li id='5'>script加载异常</li>
    </ul>
    <img src={imgSrc} alt=""/>
    <link rel="stylesheet" href={cssSrc}/>
    <script src={scriptSrc}></script>
  </>
}

export default Test
