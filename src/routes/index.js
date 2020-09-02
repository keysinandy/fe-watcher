import React from 'react';
import { Redirect } from 'react-router-dom';
import Index from '../page/index/Index';
import Test from '../page/test/Test'
export default [
  {
    path: '/',
    exact: true,
    render: () => {
      return <Redirect to="/index" />
    }
  },
  {
    path: '/index',
    component: Index
  },
  {
    path: '/test',
    component: Test
  }
]
