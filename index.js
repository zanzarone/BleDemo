import React, {Component} from 'react';
import {AppRegistry} from 'react-native';
import App from './app/App.jsx';
import {name as appName} from './app.json';
// Now let's initialize the store.
import {Provider} from 'react-redux';
import {store} from './app/redux/store';

function AppWrapper() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

AppRegistry.registerComponent(appName, () => AppWrapper);
