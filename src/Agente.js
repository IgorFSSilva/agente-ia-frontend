// src/Agente.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

function Agente() {
  const [name, setName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [token, setToken] = useState('');
  const [agentId, setAgentId] = useState(null);
  const [whatsappNumbers, setWhatsappNumbers] = useState(['']);
  const navigate = useNavigate();
  const location = useLocation();

  const API_BASE_URL = 'https://agente-ia-jawq.onrender.com/api';
  const authToken = localStorage.getItem('token');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (id) {
      setAgentId(id);
      fetchAgente(id);
    }
  }, [location.search]);

  const fetchAgente = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/agents`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const agente = response.data.find((a) => a._id === id);
      if (agente) {
        setName(agente.name);
        setPrompt(agente.prompt);
        setToken(agente.openaiToken);
        setWhatsappNumbers(agente.whatsappNumbers || ['']);
      }
    } catch (err) {
      alert('Erro ao carregar agente: ' + err.message);
    }
  };

  const salvarAgente = async () => {
    try {
      const payload = { name, prompt, openaiToken: token, whatsappNumbers };
      if (agentId) {
        await axios.put(`${API_BASE_URL}/agents/${agentId}`, payload, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        alert('Agente atualizado com sucesso!');
      } else {
        const response = await axios.post(`${API_BASE_URL}/agents`, payload, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        setAgentId(response.data.id);
        alert('Agente criado com sucesso!');
      }
    } catch (err) {
      alert('Erro ao salvar agente: ' + err.message);
    }
  };

  const handleChangeNumber = (index, value) => {
    const novos = [...whatsappNumbers];
    novos[index] = value;
    setWhatsappNumbers(novos);
  };

  const adicionarNumero = () => {
    setWhatsappNumbers([...whatsappNumbers, '']);
  };

  const removerNumero = (index) => {
    const novos = whatsappNumbers.filter((_, i) => i !== index);
    setWhatsappNumbers(novos.length > 0 ? novos : ['']);
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h2>{agentId ? 'Editar Agente' : 'Criar Novo Agente'}</h2>
      <input
        placeholder="Nome do Agente"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: '100%', marginBottom: 10 }}
      />
      <textarea
        placeholder="Prompt do Agente"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ width: '100%', marginBottom: 10 }}
      />
      <input
        placeholder="Token da OpenAI"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        style={{ width: '100%', marginBottom: 20 }}
      />

      <h3>Números de WhatsApp associados</h3>
      {whatsappNumbers.map((num, index) => (
        <div key={index} style={{ display: 'flex', marginBottom: 10 }}>
          <input
            type="text"
            value={num}
            onChange={(e) => handleChangeNumber(index, e.target.value)}
            placeholder="Ex: 5511999999999"
            style={{ flex: 1, marginRight: 10 }}
          />
          <button onClick={() => removerNumero(index)}>Remover</button>
        </div>
      ))}
      <button onClick={adicionarNumero} style={{ marginBottom: 20 }}>
        Adicionar Número
      </button>

      <div>
        <button onClick={salvarAgente}>{agentId ? 'Atualizar' : 'Criar'}</button>
        <button onClick={() => navigate('/meus-agentes')} style={{ marginLeft: 10 }}>
          Voltar
        </button>
      </div>
    </div>
  );
}

export default Agente;
