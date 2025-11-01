import express, { Request, Response } from 'express';
import cors from 'cors';
import { prisma } from './lib/prisma';
import { z } from 'zod';
import { PrismaClientKnownRequestError } from './generated/prisma/internal/prismaNamespace';
import dontenv from 'dotenv';

dontenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const createTaskSchema = z.object({
  title: z.string().min(1, { message: "O título é obrigatório." }),
  description: z.string().optional(),
});

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});

app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'Olá do Backend! 👋 (Etapa 2)' });
});

app.post('/api/tasks', async (req: Request, res: Response) => {
  try {
    const data = createTaskSchema.parse(req.body);

    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.issues });
    } else {
      res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }
});

app.get('/api/tasks', async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

app.put('/api/tasks/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const data = updateTaskSchema.parse(req.body);

    const task = await prisma.task.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title: data.title,
        description: data.description,
        completed: data.completed,
      },
    });

    res.status(200).json(task);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.issues });
    } else if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
      res.status(404).json({ message: 'Tarefa não encontrada.' });
    } else {
      res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }
});

app.delete('/api/tasks/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.task.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.status(204).send();
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
      res.status(404).json({ message: 'Tarefa não encontrada.' });
    } else {
      res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Backend a rodar em http://localhost:${PORT}`);
});