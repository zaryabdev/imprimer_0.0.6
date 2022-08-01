import React, { useState, useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import './styles/skeleton.css';

const Setup = () => {
  const [allRecords, setAllRecords] = useState([]);
  const [selectedItem, setSelectedItem] = useState({
    id: '',
    name: '',
    date_created: '',
  });

  useEffect(() => {
    // getAllBills();
  }, []);

  function handleSelectedItem(item) {
    console.log(item);
    setSelectedItem(item);
  }
  const handleInput = (event: Event) => {
    const name: String = event.target.name;
    const value: String = event.target.value;
    setSelectedItem((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const createBill = () => {
    console.log('Going to call createBill');
    window.electron.ipcRenderer.createBill(selectedItem);

    window.electron.ipcRenderer.on('create:bill', (responseData) => {
      console.log('create:bill event respose');
      console.log({ responseData });
      // getAllBills();
    });
  };
  const updateBill = (item) => {
    console.log('Going to call updateBill');
    console.log({ item });
    window.electron.ipcRenderer.updateBill(item);

    window.electron.ipcRenderer.on('update:bill', (responseData) => {
      console.log({ responseData });
      getAllBills();
    });
  };
  const deleteBill = (id) => {
    console.log('Going to call deleteBill');
    window.electron.ipcRenderer.deleteBill(id);

    window.electron.ipcRenderer.on('delete:bill', (responseData) => {
      console.log({ responseData });
      getAllBills();
    });
  };

  const getAllBills = () => {
    console.log('Going to call getAllBills');
    window.electron.ipcRenderer.getAllBills();

    window.electron.ipcRenderer.on('get:bills', (responseData) => {
      console.log({ responseData });
      setAllRecords(responseData);
    });
  };

  return (
    <div className="container p-4">
      <div className="row">
        <div className="twelve columns">
          <h1>Setup</h1>
        </div>
      </div>
      <div className="row">
        <div className="eight columns">
          <table className="u-full-width">
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
                    <td>
                      {record.date_created}
                      <button onClick={() => handleSelectedItem(record)}>
                        {' '}
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="four columns">
          <div className="row">
            <div className="twelve columns">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                className="u-full-width"
                name="name"
                value={selectedItem.name}
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
                value={selectedItem.date_created}
                type="text"
                className="u-full-width"
                name="date_created"
              />
            </div>
          </div>
          {JSON.stringify(selectedItem, null, 2)}
          <div className="row">
            <div className="four columns">
              <button className="button-primary" onClick={() => createBill()}>
                Create
              </button>
            </div>
            <div className="four columns">
              <button
                className="button-primary"
                onClick={() => updateBill(selectedItem)}
              >
                Update
              </button>
            </div>
            <div className="four columns">
              <button
                className="button-primary"
                onClick={() => deleteBill(selectedItem.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Setup />} />
      </Routes>
    </Router>
  );
}
