import { useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import './styles/skeleton.css';
const Hello = () => {
  const [item, setItem] = useState({
    name: '',
    key: '',
  });
  function handleInput(event: Event) {
    const name: String = event.target.name;
    const value: String = event.target.value;
    setItem((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }
  function ping() {
    window.electron.ipcRenderer.myPing();

    window.electron.ipcRenderer.once('ipc-example', (data) => {
      // eslint-disable-next-line no-console
      console.log(data);
    });
  }
  return (
    <div className="container p-4">
      <div className="row">
        <div className="twelve columns">
          <h1>Setup</h1>
          <button className="button-primary" onClick={ping}>
            Ping
          </button>
        </div>
      </div>
      <div className="row">
        <div className="eight columns">
          <table class="u-full-width">
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Sex</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Dave Gamache</td>
                <td>26</td>
                <td>Male</td>
                <td>San Francisco</td>
              </tr>
              <tr>
                <td>Dwayne Johnson</td>
                <td>42</td>
                <td>Male</td>
                <td>Hayward</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="four columns">
          <form>
            <div className="row">
              <div className="twelve columns">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="u-full-width"
                  name="name"
                  onChange={(event) => {
                    return handleInput(event);
                  }}
                />
              </div>
            </div>
            <div className="row">
              <div className="twelve columns">
                <label htmlFor="key">Key</label>
                <input
                  type="text"
                  className="u-full-width"
                  name="key"
                  onChange={(event) => {
                    return handleInput(event);
                  }}
                />
              </div>
            </div>
            {JSON.stringify(item, null, 2)}
            <div className="row">
              <div className="six columns">
                <button className="button-primary">Save</button>
              </div>
              <div className="six columns"></div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
