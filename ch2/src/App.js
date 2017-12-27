import React, { Component } from 'react';

class App extends Component {
  render() {
    return (
      <div className="main-content">
        <div style={{textAlign: 'center', maxWidth: 660, margin: '0 auto'}}>
          <h1>
            Welcome to Redux in Action! Let's do this thing.
          </h1>
          <h2>
            If you used the easy-install script, you're all set with a local environment bootstrapped with Create React App. The repo also includes a few things like styles that will come handy in the book.
          </h2>
          <h2>
            Head to chapter 1 for a general intro to Redux, and then jump into the code starting with chapter 2.
          </h2>
        </div>
      </div>
    );
  }
}

export default App;
