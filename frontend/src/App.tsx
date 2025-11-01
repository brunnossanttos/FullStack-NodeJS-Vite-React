import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('A carregar...');

  useEffect(() => {
    axios.get('/api')
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error('Erro ao buscar dados:', error);
        setMessage('Falha ao ligar ao backend.');
      });
  }, []);

  return (
    <div className="container mt-5">
      <div className="alert alert-success">
        <h1 className="text-center">{message}</h1>
      </div>
    </div>
  );
}

export default App;