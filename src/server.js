const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  const url = `http://localhost:${PORT}/`;
  console.log(`Servidor iniciado: ${url}`);
});