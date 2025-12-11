import { Router } from 'express'; 
import { Tenant } from '../models/Tenant';  

const router = Router();

// creating a tenant
router.post('/', async(req,res) => {
    try {
        const { name, slug } = req.body;

        if(!name || !slug) {
            return res.status(400).json({
                message: "Name and  Slug required"
            })
        }
        await Tenant.create({ name, slug })

        res.status(201).json({
            message: "Tenant Created"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to create tenant"
        })
        
    }
})

//getting all the tenant
router.get('/', async(req,res) => {
    try {
        const tenants = await Tenant.find({})
        res.status(200).json(tenants)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to fetch tenants"
        })
    }
})

export default router;