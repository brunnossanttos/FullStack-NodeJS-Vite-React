import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
  res.json({ message: 'Olá do Backend! 👋' });
});

app.listen(process.env.PORT, () => {
  console.log(`Backend a rodar em http://localhost:${process.env.PORT}`);
});