import mysql from "mysql2/promise";
import fs from "node:fs/promises";
const config={host:process.env.DB_HOST,port:Number(process.env.DB_PORT||3306),user:process.env.DB_USER,password:process.env.DB_PASSWORD,database:process.env.DB_NAME,multipleStatements:true,charset:"utf8mb4"};
if(!config.host||!config.user||!config.database||!process.env.DB_PASSWORD){console.error("Missing DB_HOST, DB_USER, DB_NAME or DB_PASSWORD.");process.exit(2);}
const db=await mysql.createConnection(config);
try{await db.query(await fs.readFile(new URL("./schema.sql",import.meta.url),"utf8"));console.log("MySQL schema and initial CMS records installed. Existing tables are not dropped.");}finally{await db.end();}
