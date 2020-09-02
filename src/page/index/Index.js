import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import actionCreator from './store/actionCreator'

export const Desc = () => {
  return <p>
    generate a react project
  </p>
}

const Index = () => {
  const s = useSelector(state => state.indexReducer)
  const dispatch = useDispatch()
  const handleAdd = () => {
    dispatch(actionCreator.addClickNum())
  }
  return <>
    <div onClick={handleAdd}>click me</div>
    {s.clickNum}
    <Desc />
  </>
}

export default Index
