import app from './index.js';

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Servidor levantado en http://localhost:${PORT}`);
});