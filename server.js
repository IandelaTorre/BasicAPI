// server.js
const app = require('./app');
const PORT = process.env.PORT || 3010;

const { Client } = require("pg");

(async () => {
  try {
    const c = new Client({ connectionString: process.env.DATABASE_URL });
    await c.connect();
    const r = await c.query("select 1 as ok");
    console.log("PG CONNECT OK:", r.rows);
    await c.end();
  } catch (e) {
    console.error("PG CONNECT FAIL:", e.message);
  }
})();


// Evita arrancar en tests
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en puerto ${PORT}`);
    });
}