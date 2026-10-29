import {readFile} from 'node:fs/promises';
import {database} from '../netlify/analytics/database.mjs';
if(!process.env.ANALYTICS_DATABASE_URL)throw Error('Set ANALYTICS_DATABASE_URL in your local environment. Do not put it in source.');
const schema=await readFile(new URL('../netlify/analytics/schema.sql',import.meta.url),'utf8');
const query=database();
for(const statement of schema.split(';').map(s=>s.trim()).filter(Boolean))await query(statement);
console.log('Dedicated portfolio_analytics schema initialized. No existing application tables changed.');
