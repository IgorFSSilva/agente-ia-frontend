// src/Dashboard.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [name, setName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [token, setToken] = useState('');
  const [agentId, setAgentId] = useState(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const navigate = useNavigate();

  const API_BASE_URL = 'https://agente-ia-jawq.onrender.com/api';
  const authToken = localStorage.getItem('token');

  const createAgent = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/agents`,
        { name, prompt, openaiToken: token },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setAgentId(response.data.id);
      alert('Agente criado com sucesso!');
    } catch (err) {
      alert('Erro ao criar agente: ' + err.message);
    }
  };

  const askAgent = async () => {
    if (!agentId || !question) return;
    try {
      const response = await axios.post(
        `${API_BASE_URL}/agents/${agentId}/query`,
        { question },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setAnswer(response.data.answer);
    } catch (err) {
      alert('Erro ao perguntar: ' + err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <button onClick={() => navigate('/meus-agentes')}>
          Ver Meus Agentes
        </button>
        <button onClick={handleLogout}>
          Sair
        </button>
      </div>

      <h2>Criar Agente de IA</h2>
      <input
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: '100%', marginBottom: 10 }}
      />
      <textarea
        placeholder="Prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ width: '100%', marginBottom: 10 }}
      />
      <input
        placeholder="Token da OpenAI"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        style={{ width: '100%', marginBottom: 10 }}
      />
      <button onClick={createAgent}>Criar Agente</button>

      {agentId && (
        <>
          <h3 style={{ marginTop: 30 }}>Perguntar ao Agente</h3>
          <input
            placeholder="Pergunta"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            style={{ width: '100%', marginBottom: 10 }}
          />
          <button onClick={askAgent}>Perguntar</button>
          {answer && (
            <div style={{ marginTop: 20, padding: 10, border: '1px solid #ccc' }}>
              <strong>Resposta:</strong> <br /> {answer}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;
