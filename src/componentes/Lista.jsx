import './Lista.css';
import { useState } from 'react';

export default function Lista() {
    const [tarefa, setTarefa] = useState('');
    const [lista, setLista] = useState([]);
    const [tarefasFixadas, setTarefasFixadas] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [showConfirmAlert, setShowConfirmAlert] = useState(false);

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
        setTarefasFixadas(tarefasFixadas.map(item =>
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
        setShowConfirmAlert(true);
    };

    const confirmClear = () => {
        setLista([]);
        setTarefasFixadas([]);
        setShowConfirmAlert(false);
    };

    const handleFixar = (id) => {
        if (tarefasFixadas.length >= 3) {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
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

            {/* Alerta para limite de tarefas fixadas, ref: https://docs.appsmith.com/reference/appsmith-framework/widget-actions/show-alert */}
            {showAlert && (
                <div className="alerta-customizado">
                    Você pode fixar no máximo 3 tarefas.
                </div>
            )}

            {/* Alerta de confirmação para limpar tarefas */}
            {showConfirmAlert && (
                <div className="alerta-confirmacao">
                    <p>Tem certeza que deseja limpar todas as tarefas?</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
                        <button 
                            onClick={confirmClear} 
                            className="btn btn-sm"
                            style={{ background: 'white', color: 'var(--primary-color)' }}
                        >
                            Confirmar
                        </button>
                        <button 
                            onClick={() => setShowConfirmAlert(false)} 
                            className="btn btn-sm"
                            style={{ background: 'white', color: 'var(--danger-color)' }}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="form">
                <input
                    type="text"
                    className="Cadastro-tarefas"
                    onChange={(e) => setTarefa(e.target.value)}
                    value={tarefa}
                    placeholder="Digite uma nova tarefa..."
                    aria-label="Adicionar nova tarefa"
                />
                <button type="submit" className="btn adicionarTarefa">Adicionar</button>
                <button type="button" onClick={handleClear} className="btn limparTudo">Limpar Tudo</button>
            </form>

            {tarefasFixadas.length > 0 && (
                <div className="tarefas-fixadas">
                    <h3 className="subtitulo">
                        Tarefas Fixadas
                        <span className="numero-tarefas">{tarefasFixadas.length}</span>
                    </h3>
                    <ul className="lista-tarefas">
                        {tarefasFixadas.map(item => (
                            <li key={item.id} className={`item-tarefas ${item.status ? 'completed' : ''}`}>
                                <span className="texto-tarefas">{item.texto}</span>
                                <div className="ações-tarefas">
                                    <button 
                                        onClick={() => handleToggle(item.id)} 
                                        className={`btn btn-sm ${item.status ? 'concluirTarefa' : ''}`}
                                    >
                                        {item.status ? 'Desmarcar' : 'Concluir'}
                                    </button>
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
                    <span className="numero-tarefas">{lista.length}</span>
                </h3>
                {lista.length === 0 ? (
                    <p style={{ textAlign: 'center', padding: '20px', color: '#95a5a6' }}>Nenhuma tarefa cadastrada. Adicione uma nova tarefa acima.</p>
                ) : (
                    <ul className="lista-tarefas">
                        {lista.map((item, index) => (
                            <li key={item.id} className={`item-tarefas ${item.status ? 'completed' : ''}`}>
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
                                <span className="texto-tarefas">{item.texto}</span>
                                <div className="ações-tarefas">
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