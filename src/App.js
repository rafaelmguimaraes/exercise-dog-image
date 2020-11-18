import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    console.log('constructor')
    super(props);
    //this.getNextDog = this.getNextDog(this);
    this.state = {
      error: null,
      isLoaded: false,
      dogImage: '',
    };
  }

  componentDidMount() {
    console.log('componentDidMount');
    this.getNextDog();
  }

  shouldComponentUpdate(_nextProps, nextState) {
    console.log('shouldComponentUpdate');
    console.log(nextState.dogImage);
    if (nextState.dogImage.includes('terrier'))
      return false;
    return true;
  }

  componentDidUpdate() {
    console.log('componentDidUpdate');
    const { dogImage } = this.state;
    if (dogImage) {
      localStorage.setItem("lastDogImage", JSON.stringify(dogImage));
      const regexBreed = /breeds\/(.*)\//gm;
      const breed = regexBreed.exec(dogImage)[1];
      alert(breed);
    }
  }
  

  getNextDog = () => {
    this.setState({ isLoaded: false }, () => {
      fetch("https://dog.ceo/api/breeds/image/random")
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
              isLoaded: true,
              dogImage: result.message
            });
          },
          (error) => {
            this.setState({
              isLoaded: true,
              error
            });
          }
        )
    })
  }

  render() {
    console.log('render')
    const { error, isLoaded, dogImage } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {

      return (
        <div className="main">
          <img src={dogImage} alt="Random Dog"/>
          <button onClick={this.getNextDog} >Next Dog</button>
        </div>
      );
    }
  }
}

export default App;
