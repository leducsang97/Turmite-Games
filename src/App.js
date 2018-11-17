import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Langton from './Langton'
import Conway from './Conway'

class App extends Component {
  state={
    langton: true
  }
  handleChange = () => {
		if (this.state.langton) {
			this.setState({
				langton: false
			})
		}
		else {
			this.setState({
				langton: true
			})
		}
  }
  
  render() {
    return (
      <div className="App">
        {this.state.langton ?
          <h1>The Langton's Ant Game</h1> : <h1>The Conway's Game of Life</h1>
        }
        <button className="btn" onClick={() => this.handleChange()}>Change Game Mode</button>
        {this.state.langton? <Langton /> : <Conway/>}
      </div>
    );
  }
}

export default App;
