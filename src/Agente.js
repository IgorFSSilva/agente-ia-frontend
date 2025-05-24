// src/Agente.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function Agente() {
  const [name, setName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [token, setToken] = useState('');
  const [agentId, setAgentId] = useState(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const editingId = searchParams.get('id');

  const API_BASE_URL = 'https://agente-ia-jawq.onrender.com/api';
  const authToken = localStorage.getItem('token');

  useEffect(() => {
    if (editingId) {
      axios
        .get(`${API_BASE_URL}/agents`, {
          headers: { Authorization: `Bearer ${authToken}` }
        })
        .then((response) => {
          const agente = response.data.find((a) => a._id === editingId);
          if (agente) {
            setName(agente.name);
            setPrompt(agente.prompt);
            setToken(agente.openaiToken);
            setAgentId(agente._id);
          }
        })
        .catch((err) => alert('Erro ao buscar agente: ' + err.message));
    }
  }, [editingId, authToken]);

  const handleSubmit = async () => {
    try {
      if (agentId) {
        await axios.put(
          `${API_BASE_URL}/agents/${agentId}`,
          { name, prompt, openaiToken: token },
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        alert('Agente atualizado com sucesso!');
      } else {
        const response = await axios.post(
          `${API_BASE_URL}/agents`,
          { name, prompt, openaiToken: token },
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        setAgentId(response.data.id);
        alert('Agente criado com sucesso!');
      }
    } catch (err) {
      alert('Erro ao salvar agente: ' + err.message);
    }
  };

  const handlePerguntar = async () => {
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

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h2>{agentId ? 'Editar Agente' : 'Criar Agente de IA'}</h2>
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
      <button onClick={handleSubmit} style={{ marginBottom: 20 }}>
        {agentId ? 'Atualizar Agente' : 'Criar Agente'}
      </button>

      {agentId && (
        <>
          <h3>Perguntar ao Agente</h3>
          <input
            placeholder="Pergunta"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            style={{ width: '100%', marginBottom: 10 }}
          />
          <button onClick={handlePerguntar}>Perguntar</button>
          {answer && (
            <div
              style={{ marginTop: 20, padding: 10, border: '1px solid #ccc' }}
            >
              <strong>Resposta:</strong> <br /> {answer}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Agente;
