import actionTypes from './actionTypes';
import { produce } from 'immer'
const defaultState = {
  clickNum: 0
}
const reducer = (state = defaultState, action) => {
  switch (action.type) {
  case actionTypes.ADD_NUM:
    return produce(state, draft => {
      console.log(state, draft)
      draft.clickNum = state.clickNum + 1;
    })
  default:
    return state;
  }
}

export default reducer
