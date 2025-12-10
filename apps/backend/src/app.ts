import express from 'express'
import helmet from 'helmet';
import cors from 'cors'
import tenantMiddleware from './middleware/tenants';


const app = express();
app.use(helmet())
app.use(cors())
app.use(express.json())

app.use(tenantMiddleware)

app.get('/health', (req,res) => {
    res.json({
        status: "ok",
        tenant: (req as any).tenant
    })
})

export default app;