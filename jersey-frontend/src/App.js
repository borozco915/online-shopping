import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [jerseys, setJerseys] = useState([]);

  const API_URL = "https://taskmanager-app.calmstone-003dbd4c.centralus.azurecontainerapps.io"; // 👈 replace this

  useEffect(() => {
    axios.get(`${API_URL}/jerseys`)
      .then(res => setJerseys(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container">
      <h1>⚽ Soccer Jersey Store</h1>
      <p>Powered by Microservices + React</p>

      <div className="grid">
        {jerseys.map(j => (
          <div key={j.id} className="card">
            <h3>{j.name}</h3>
            <p>${j.price}</p>
            <button>Buy</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;