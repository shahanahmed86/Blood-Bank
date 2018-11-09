import React, { Component } from 'react';
import { Provider } from 'react-redux';
import Login from './components/login';
import './App.css';

class App extends Component {
  render() {
    return (
      <Provider>
        <div>
          <Login />
        </div>
      </Provider>
    );
  }
}

export default App;
