// db.js
import postgres from 'postgres'
import { POSTGRES_HOST } from './constants'

const sql = postgres({ 
    host: POSTGRES_HOST
}) // will use psql environment variables

export default sql