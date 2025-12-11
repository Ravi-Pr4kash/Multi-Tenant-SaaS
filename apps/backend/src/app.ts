import express from 'express'
import helmet from 'helmet';
import cors from 'cors'
import tenantMiddleware from './middleware/tenants';
import tenantRouter from './routes/tenants';
import documentRouter from './routes/documents'


const app = express();
app.use(helmet())
app.use(cors())
app.use(express.json())

app.use(tenantMiddleware)

app.use('/api/v1/tenants', tenantRouter)
app.use('/api/v1/documents', documentRouter)

app.get('/health', (req,res) => {
    res.json({
        status: "ok",
        tenant: (req as any).tenant
    })
})

export default app;