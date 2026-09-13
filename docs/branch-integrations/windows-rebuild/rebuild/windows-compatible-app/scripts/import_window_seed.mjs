import fs from "node:fs/promises";
import mysql from "mysql2/promise";
const sql = await fs.readFile("/tmp/onex-window-catalog.sql", "utf8");
const connection = await mysql.createConnection(process.env.DATABASE_URL);
for (const statement of sql.split(/;\s*\n/).map((part) => part.trim()).filter(Boolean)) {
  await connection.query(statement);
}
const [rows] = await connection.query("SELECT COUNT(*) AS count FROM window_registry");
console.log(`window_registry_count=${rows[0].count}`);
await connection.end();
