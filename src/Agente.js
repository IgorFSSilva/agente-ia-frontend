// src/Agente.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Agente() {
  const [name, setName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [token, setToken] = useState('');
  const [agentId, setAgentId] = useState(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const API_BASE_URL = 'https://agente-ia-jawq.onrender.com/api';
  const authToken = localStorage.getItem('token');

  useEffect(() => {
    if (!authToken) {
      navigate('/login');
    }
  }, [authToken, navigate]);

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
      console.error(err);
      const msg = err.response?.data?.error || err.message || 'Erro ao criar agente.';
      setError(msg);
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
      console.error(err);
      const msg = err.response?.data?.error || err.message || 'Erro ao perguntar.';
      setError(msg);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h2>Criar Agente de IA</h2>

      {error && (
        <div style={{ color: 'red', marginBottom: 10 }}>
          <strong>{error}</strong>
        </div>
      )}

      <input
        placeholder="Nome do agente"
        value={name}
        onChange={e => setName(e.target.value)}
        style={{ width: '100%', marginBottom: 10 }}
      />

      <textarea
        placeholder="Prompt"
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        style={{ width: '100%', marginBottom: 10 }}
      />

      <input
        placeholder="Token da OpenAI"
        value={token}
        onChange={e => setToken(e.target.value)}
        style={{ width: '100%', marginBottom: 10 }}
      />

      <button onClick={createAgent}>Criar Agente</button>

      {agentId && (
        <>
          <h3 style={{ marginTop: 30 }}>Perguntar ao Agente</h3>
          <input
            placeholder="Pergunta"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            style={{ width: '100%', marginBottom: 10 }}
          />
          <button onClick={askAgent}>Perguntar</button>
          {answer && (
            <div style={{ marginTop: 20, padding: 10, border: '1px solid #ccc' }}>
              <strong>Resposta:</strong>
              <br />
              {answer}
            </div>
          )}
        </>
      )}
    </div>
  );
}
