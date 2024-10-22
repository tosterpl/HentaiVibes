import './App.css';
import Downloader from './Downloader';

function App() {
  return (
    <div className="App">
      <div class='jumbotron text-center mainheader'>
        <img src='./assets/logo.png' class="logo"></img>
        <h1 class="borel-regular">HentaiVibes</h1>
        <h3>hentai pics and more</h3>
      </div>
      <Downloader></Downloader>
    </div>
  );
}

export default App;
