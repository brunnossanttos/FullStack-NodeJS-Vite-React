import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string; 
}

type FilterStatus = 'all' | 'pending' | 'completed';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState<FilterStatus>('all');
  const [search, setSearch] = useState('');

  const fetchTasks = async () => {
    try {
      setError(null);
      const response = await axios.get<Task[]>('/api/tasks', {
        params: {
          status: filter,
          search: search,
        },
      });
      setTasks(response.data);
    } catch (err) {
      console.error('Erro ao buscar tarefas:', err);
      setError('Falha ao carregar tarefas.');
    }
  };

  const handleCreateTask = async (e: FormEvent) => {
    e.preventDefault(); 
    
    if (!title) {
      setError('O título é obrigatório.');
      return;
    }

    try {
      setError(null);
      await axios.post<Task>('/api/tasks', {
        title,
        description,
      });
      
      await fetchTasks();
      
      setTitle('');
      setDescription('');

    } catch (err: any) {
      console.error('Erro ao criar tarefa:', err);
      if (err.response && err.response.data.errors) {
        setError(err.response.data.errors[0].message);
      } else {
        setError('Falha ao criar tarefa.');
      }
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      const updatedTask = await axios.put<Task>(`/api/tasks/${task.id}`, {
        completed: !task.completed,
      });

      if (filter === 'all') {
        setTasks(
          tasks.map((t) => (t.id === task.id ? updatedTask.data : t))
        );
      } else {
        await fetchTasks();
      }
    } catch (err) {
      console.error('Erro ao atualizar tarefa:', err);
      setError('Falha ao atualizar tarefa.');
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!window.confirm('Tem a certeza que quer apagar esta tarefa?')) {
      return;
    }
    
    try {
      await axios.delete(`/api/tasks/${id}`);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Erro ao apagar tarefa:', err);
      setError('Falha ao apagar tarefa.');
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      fetchTasks();
    }, 300);

    return () => {
      clearTimeout(timerId);
    };
  }, [filter, search]); 

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 px-3 py-4" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="w-100" style={{ maxWidth: '600px', margin: '0 auto' }}>

        <h1 className="mb-4 text-center">Sistema de Tarefas</h1>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title">Nova Tarefa</h5>
            <form onSubmit={handleCreateTask}>
              {error && <div className="alert alert-danger">{error}</div>}
              
              <div className="mb-3">
                <label htmlFor="title" className="form-label">Título</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Descrição (Opcional)</label>
                <textarea
                  className="form-control"
                  id="description"
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Adicionar Tarefa
              </button>
            </form>
          </div>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title">Lista de Tarefas</h5>
            
            <div className="row g-2 my-3">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por título ou descrição..."
                  value={search}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="col-md-6">
                <div className="btn-group w-100" role="group">
                  <button
                    type="button"
                    className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setFilter('all')}
                  >
                    Todas
                  </button>
                  <button
                    type="button"
                    className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setFilter('pending')}
                  >
                    Pendentes
                  </button>
                  <button
                    type="button"
                    className={`btn ${filter === 'completed' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setFilter('completed')}
                  >
                    Concluir
                  </button>
                </div>
              </div>
            </div>

            <ul className="list-group list-group-flush mt-3">
              {tasks.length === 0 && (
                <li className="list-group-item text-center text-muted">
                  Nenhuma tarefa encontrada.
                </li>
              )}
              
              {tasks.map((task) => (
                <li key={task.id} className="list-group-item">
                  <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
                    <div className="flex-grow-1">
                      <h6
                        style={{
                          textDecoration: task.completed ? 'line-through' : 'none',
                          cursor: 'pointer',
                          marginBottom: '0.25rem'
                        }}
                        onClick={() => handleToggleComplete(task)}
                      >
                        {task.title}
                      </h6>
                      {task.description && (
                        <small className="text-muted d-block">{task.description}</small>
                      )}
                    </div>
                    <div className="d-flex gap-2 flex-shrink-0">
                      <button
                        className={`btn btn-sm ${task.completed ? 'btn-outline-secondary' : 'btn-outline-success'}`}
                        onClick={() => handleToggleComplete(task)}
                      >
                        {task.completed ? 'Desmarcar' : 'Concluir'}
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        Apagar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default App;