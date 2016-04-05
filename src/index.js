import React from 'react';
import { render } from 'react-dom';
import { createStore, compose } from 'redux';
import { connect } from 'react-redux';
import view from './view';
import reducer from './update';
import init from './model';
import takeSamples from './take_samples'

const App = connect((model) => ({ model }))(view);
const store = createStore(reducer,
                          init(),
                          window.devToolsExtension ?
                            compose(devToolsExtension()):
                            compose());
takeSamples(store);

render(
  <App store={store} />,
  document.querySelector('main')
);
