import { useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import './styles/skeleton.css';
const Hello = () => {
  const [item, setItem] = useState({
    id: '',
    name: '',
    date_created: '',
  });

  const [allRecords, setAllRecords] = useState([]);
  function handleInput(event: Event) {
    const name: String = event.target.name;
    const value: String = event.target.value;
    setItem((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }
  function ping() {
    window.electron.ipcRenderer.myPing(item);

    window.electron.ipcRenderer.once('ipc-example', (responseData) => {
      // eslint-disable-next-line no-console
      console.log({ responseData });
    });
  }
  function createBill() {
    window.electron.ipcRenderer.createBill(item);

    window.electron.ipcRenderer.once('create:bill', (responseData) => {
      // eslint-disable-next-line no-console
      console.log({ responseData });
    });
  }
  function deleteBill() {
    window.electron.ipcRenderer.deleteBill(item.name);

    window.electron.ipcRenderer.once('delete:bill', (responseData) => {
      // eslint-disable-next-line no-console
      console.log({ responseData });
    });
  }
  function getAllBills() {
    window.electron.ipcRenderer.getAllBills();

    window.electron.ipcRenderer.once('get:bills', (responseData) => {
      // eslint-disable-next-line no-console
      console.log({ responseData });
      setAllRecords(responseData);
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
          <button className="button-primary" onClick={createBill}>
            Create
          </button>
          <button className="button-primary" onClick={deleteBill}>
            Delete
          </button>
          <button className="button-primary" onClick={getAllBills}>
            Get All
          </button>
        </div>
      </div>
      <div className="row">
        <div className="eight columns">
          <table class="u-full-width">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Date Created</th>
              </tr>
            </thead>
            <tbody>
              {allRecords.map((record) => {
                return (
                  <tr key={record.id}>
                    <td>{record.id}</td>
                    <td>{record.name}</td>
                    <td>{record.date_created}</td>
                  </tr>
                );
              })}
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
                <label htmlFor="date_created">Date Created</label>
                <input
                  readOnly
                  type="text"
                  className="u-full-width"
                  name="date_created"
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
