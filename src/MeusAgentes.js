// src/MeusAgentes.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function MeusAgentes() {
  const [agentes, setAgentes] = useState([]);
  const navigate = useNavigate();
  const API_BASE_URL = 'https://agente-ia-jawq.onrender.com/api';
  const authToken = localStorage.getItem('token');

  useEffect(() => {
    const fetchAgentes = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/agents`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        setAgentes(response.data);
      } catch (err) {
        alert('Erro ao buscar agentes: ' + err.message);
      }
    };

    fetchAgentes();
  }, [authToken]);

  const handleEditar = (id) => {
    navigate(`/agente?id=${id}`);
  };

  const handleExcluir = async (id) => {
    const confirm = window.confirm('Tem certeza que deseja excluir este agente?');
    if (!confirm) return;

    try {
      await axios.delete(`${API_BASE_URL}/agents/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setAgentes(agentes.filter((agente) => agente._id !== id));
      alert('Agente excluído com sucesso.');
    } catch (err) {
      alert('Erro ao excluir agente: ' + err.message);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <h2>Meus Agentes</h2>
      <button onClick={() => navigate('/agente')} style={{ marginBottom: 20 }}>
        Criar Novo Agente
      </button>
      {agentes.length === 0 ? (
        <p>Nenhum agente criado ainda.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Nome</th>
              <th style={{ borderBottom: '1px solid #ccc' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {agentes.map((agente) => (
              <tr key={agente._id}>
                <td style={{ padding: '8px 0' }}>{agente.name}</td>
                <td>
                  <button onClick={() => handleEditar(agente._id)} style={{ marginRight: 10 }}>
                    Editar
                  </button>
                  <button onClick={() => handleExcluir(agente._id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MeusAgentes;
