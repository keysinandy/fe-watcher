import React from 'react';
import renderer from 'react-test-renderer';
import { Desc } from '../Index';
describe('<Desc />', () => {
  it('Snapshot', () => {
    const component = renderer.create(<Desc/>);
    let snapshot = component.toJSON();
    expect(snapshot).toMatchSnapshot();
  });
});
