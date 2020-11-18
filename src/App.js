import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    console.log('constructor')
    super(props);
    this.state = {
      error: null,
      dogImage: '',
      dogData: {},
      name: '',
      savedDogs: [],
    };
  }

  componentDidMount() {
    console.log('componentDidMount');
    if (localStorage.savedDogs) {
      const savedDogsFromStorage = JSON.parse(localStorage.savedDogs);
      const lastSavedDog = savedDogsFromStorage[savedDogsFromStorage.length - 1];
      return this.setState({ 
        dogImage: lastSavedDog.dogImage,
        name: lastSavedDog.name,
        savedDogs: [...savedDogsFromStorage],  
      });
    }
    this.fetchDog();
  }

  shouldComponentUpdate(_nextProps, nextState) {
    console.log('shouldComponentUpdate');
    if (nextState.dogImage.includes('terrier'))
      return false;
    return true;
  }

  componentDidUpdate(_prevProps, prevState) {
    console.log('componentDidUpdate');
    const { dogImage, savedDogs } = this.state;
    if (dogImage && prevState.dogImage !== dogImage) {
      const regexBreed = /breeds\/(.*)\//gm;
      const breed = regexBreed.exec(dogImage)[1];
      return alert(breed);
    }
    localStorage.setItem("savedDogs", JSON.stringify(savedDogs));
  }
  

  fetchDog = () => {
    this.setState({ dogImage: ''}, () => {
      fetch("https://dog.ceo/api/breeds/image/random")
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
              dogImage: result.message,
              dogData: result,
              name: '',
            });
          },
          (error) => {
            this.setState({
              error
            });
          }
        )
    })
  }

  saveData = () => {
    const {
      dogImage,
      name,
      savedDogs,
    } = this.state;
    const saveDog = { dogImage, name };
    const newSavedDogs = [...savedDogs, saveDog];
    this.setState({ savedDogs: newSavedDogs });
    this.setState({ name: '' });
  }

  render() {
    console.log('render')
    const { error, dogImage } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!dogImage) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className="dog-container">
          <header className="dog-header">
            <h1> Photo Dog </h1>
          </header>
          <section className="dog-action-next">
            <button onClick={this.fetchDog}>Next Dog</button>
          </section>
          <section className="dog-image">
            <img src={dogImage} alt="Random Dog"/>
          </section>
          <section className="dog-action-save">
            <input
              type="text"
              value={this.state.name}
              onChange={e => this.setState({ name: e.target.value })}
              placeholder="type the dog name"
            />
            <button onClick={this.saveData}>Save Dog!</button>
          </section>
        </div>
      );
    }
  }
}

export default App;
