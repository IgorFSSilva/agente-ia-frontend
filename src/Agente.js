// src/Agente.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function Agente() {
  const [name, setName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [token, setToken] = useState('');
  const [whatsappNumbers, setWhatsappNumbers] = useState(['']);
  const [agentId, setAgentId] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const API_BASE_URL = 'https://agente-ia-jawq.onrender.com/api';
  const authToken = localStorage.getItem('token');

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const id = query.get('id');
    if (id) {
      setAgentId(id);
      axios
        .get(`${API_BASE_URL}/agents/${id}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        })
        .then((res) => {
          const agente = res.data;
          setName(agente.name);
          setPrompt(agente.prompt);
          setToken(agente.openaiToken);
          setWhatsappNumbers(agente.whatsappNumbers || ['']);
        })
        .catch((err) => alert('Erro ao carregar agente: ' + err.message));
    }
  }, [location.search, authToken]);

  const handleSave = async () => {
    const payload = {
      name,
      prompt,
      openaiToken: token,
      whatsappNumbers: whatsappNumbers.filter(Boolean)
    };

    try {
      if (agentId) {
        await axios.put(`${API_BASE_URL}/agents/${agentId}`, payload, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        alert('Agente atualizado com sucesso!');
      } else {
        await axios.post(`${API_BASE_URL}/agents`, payload, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        alert('Agente criado com sucesso!');
      }
      navigate('/meus-agentes');
    } catch (err) {
      alert('Erro ao salvar agente: ' + err.message);
    }
  };

  const updateWhatsappNumber = (index, value) => {
    const updated = [...whatsappNumbers];
    updated[index] = value;
    setWhatsappNumbers(updated);
  };

  const addWhatsappField = () => {
    setWhatsappNumbers([...whatsappNumbers, '']);
  };

  const removeWhatsappField = (index) => {
    const updated = whatsappNumbers.filter((_, i) => i !== index);
    setWhatsappNumbers(updated);
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h2>{agentId ? 'Editar Agente' : 'Criar Novo Agente'}</h2>
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

      <h4>Números de WhatsApp</h4>
      {whatsappNumbers.map((num, index) => (
        <div key={index} style={{ display: 'flex', marginBottom: 8 }}>
          <input
            value={num}
            onChange={(e) => updateWhatsappNumber(index, e.target.value)}
            placeholder="5511987654321"
            style={{ flex: 1, marginRight: 8 }}
          />
          <button onClick={() => removeWhatsappField(index)}>Remover</button>
        </div>
      ))}
      <button onClick={addWhatsappField} style={{ marginBottom: 20 }}>
        Adicionar Número
      </button>

      <button onClick={handleSave}>Salvar</button>
    </div>
  );
}

export default Agente;
