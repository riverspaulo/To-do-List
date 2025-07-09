import './Lista.css';
import { useState } from 'react';

export default function Lista() {
    const [tarefa, setTarefa] = useState('');
    const [lista, setLista] = useState([]);
    const [tarefasFixadas, setTarefasFixadas] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!tarefa.trim()) return;

        const novaTarefa = {
            id: Math.floor(Math.random() * 10000),
            texto: tarefa,
            status: false,
        };

        setLista([...lista, novaTarefa]);
        setTarefa('');
    };

    const handleToggle = (id) => {
        setLista(lista.map(item =>
            item.id === id ? { ...item, status: !item.status } : item
        ));
    };

    const handleMove = (id, direcao) => {
        const indice = lista.findIndex(item => item.id === id);
        if ((indice === 0 && direcao === 'subir') || (indice === lista.length - 1 && direcao === 'descer')) {
            return;
        }

        const novaLista = [...lista];
        const itemMovido = novaLista.splice(indice, 1)[0];
        const novoIndice = direcao === 'subir' ? indice - 1 : indice + 1;
        novaLista.splice(novoIndice, 0, itemMovido);
        setLista(novaLista);
    };

    const handleClear = () => {
        if (window.confirm('Tem certeza que deseja limpar todas as tarefas?')) {
            setLista([]);
            setTarefasFixadas([]);
        }
    };

    const handleFixar = (id) => {
        if (tarefasFixadas.length >= 3) {
            alert(`Você pode fixar no máximo 3 tarefas.`);
            return;
        }

        const tarefaFixada = lista.find(item => item.id === id);
        setTarefasFixadas([...tarefasFixadas, tarefaFixada]);
        setLista(lista.filter(item => item.id !== id));
    };

    const handleDesfixar = (id) => {
        const tarefaDesfixada = tarefasFixadas.find(item => item.id === id);
        setLista([...lista, tarefaDesfixada]);
        setTarefasFixadas(tarefasFixadas.filter(item => item.id !== id));
    };

    const handleExcluir = (id, isFixada = false) => {
        if (isFixada) {
            setTarefasFixadas(tarefasFixadas.filter(item => item.id !== id));
        } else {
            setLista(lista.filter(item => item.id !== id));
        }
    };

    return (
        <div className="container">
            <header className="header">
                <h1>Sistema de Tarefas</h1>
                <p>Organize seu dia de forma eficiente</p>
            </header>

            <form onSubmit={handleSubmit} className="form">
                <input
                    type="text"
                    className="task-input"
                    onChange={(e) => setTarefa(e.target.value)}
                    value={tarefa}
                    placeholder="Digite uma nova tarefa..."
                    aria-label="Adicionar nova tarefa"
                />
                <button type="submit" className="btn adicionarTarefa">Adicionar</button>
                <button type="button" onClick={handleClear} className="btn limparTudo">Limpar Tudo</button>
            </form>

            {tarefasFixadas.length > 0 && (
                <div className="tarefas_fixadas">
                    <h3 className="subtitulo">
                        Tarefas Fixadas
                        <span className="numero_tarefas">{tarefasFixadas.length}</span>
                    </h3>
                    <ul className="task-list">
                        {tarefasFixadas.map(item => (
                            <li key={item.id} className={`task-item ${item.status ? 'completed' : ''}`}>
                                <span className="task-text">{item.texto}</span>
                                <div className="task-actions">
                                    <button onClick={() => handleDesfixar(item.id)} className="btn desfixarTarefa btn-sm">Desfixar</button>
                                    <button onClick={() => handleExcluir(item.id, true)} className="btn excluirTarefa btn-sm">Excluir</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="tarefas">
                <h3 className="subtitulo">
                    Todas as Tarefas
                    <span className="numero_tarefas">{lista.length}</span>
                </h3>
                {lista.length === 0 ? (
                    <p style={{ textAlign: 'center', padding: '20px', color: '#95a5a6' }}>Nenhuma tarefa cadastrada. Adicione uma nova tarefa acima.</p>
                ) : (
                    <ul className="task-list">
                        {lista.map((item, index) => (
                            <li key={item.id} className={`task-item ${item.status ? 'completed' : ''}`}>
                                <div className="order-controls">
                                    <button
                                        onClick={() => handleMove(item.id, 'subir')}
                                        disabled={index === 0}
                                        title="Mover para cima"
                                    >
                                        ↑
                                    </button>
                                    <button
                                        onClick={() => handleMove(item.id, 'descer')}
                                        disabled={index === lista.length - 1}
                                        title="Mover para baixo"
                                    >
                                        ↓
                                    </button>
                                </div>
                                <span className="task-text">{item.texto}</span>
                                <div className="task-actions">
                                    <button 
                                        onClick={() => handleToggle(item.id)} 
                                        className={`btn btn-sm ${item.status ? 'concluirTarefa' : ''}`}
                                    >
                                        {item.status ? 'Desmarcar' : 'Concluir'}
                                    </button>
                                    <button onClick={() => handleFixar(item.id)} className="btn fixarTarefa btn-sm">Fixar</button>
                                    <button onClick={() => handleExcluir(item.id)} className="btn excluirTarefa btn-sm">Excluir</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
