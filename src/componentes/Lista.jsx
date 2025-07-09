import './Lista.css';
import { useState } from 'react';

export default function Lista() {
    const [tarefa, setTarefa] = useState('');
    const [lista, setLista] = useState([]);
    const [tarefasFixadas, setTarefasFixadas] = useState([]);
    const [showAlert, setShowAlert] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!tarefa) return;

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
        setLista([]);
        setTarefasFixadas([]);
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
        <div>
            <h1>Sistema de Tarefas</h1>
            <h2>Descreva sua tarefa:</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    <input type="text" onChange={(e) => setTarefa(e.target.value)} value={tarefa} />
                </label>
                <button type="submit">Adicionar</button>
                <button onClick={handleClear}>Reset</button>
            </form>

            {/* Alert estilizado */}
            {showAlert && (
                <div className="alerta-customizado">
                    Você pode fixar no máximo 3 tarefas.
                </div>
            )}

            <h3>Tarefas Fixadas</h3>
            <ul>
                {tarefasFixadas.map(item => (
                    <li key={item.id} className={item.status ? 'concluida' : ''}>
                        <span>{item.texto}</span>
                        <button onClick={() => handleToggle(item.id)} className='buttonConcluir'>
                            {item.status ? 'Desmarcar' : 'Concluir'}
                        </button>
                        <button onClick={() => handleDesfixar(item.id)} className='buttonDesfixar'>Desfixar</button>
                        <button onClick={() => handleExcluir(item.id, true)} className='buttonExcluir'>Excluir</button>
                    </li>
                ))}
            </ul>

            <h3>Lista de Tarefas</h3>
            <ul>
                {lista.map((item, index) => (
                    <li key={item.id} className={item.status ? 'concluida' : ''}>
                        <div className="controles-ordem">
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
                        <span>{item.texto}</span>
                        <button onClick={() => handleToggle(item.id)} className='buttonConcluir'>
                            {item.status ? 'Desmarcar' : 'Concluir'}
                        </button>
                        <button onClick={() => handleFixar(item.id)} className='buttonFixar'>Fixar</button>
                        <button onClick={() => handleExcluir(item.id)} className='buttonExcluir'>Excluir</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
