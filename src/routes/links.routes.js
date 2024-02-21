import { Router } from "express";
import { authRequired } from '../middlewares/validateToken.js';
import { getLink,getLinks,updateLink,deleteLink,createLink,getGroups,getGroup,createGroup,deleteGroup,updateGroup } from "../controllers/links.controller.js";

import { validateSchema } from '../middlewares/validator.middleware.js';
import { linkSchema,groupSchema } from "../schemas/link.schema.js";

const router = Router()

router.get('/links/:id',authRequired,getLinks)
router.post('/link',authRequired,validateSchema(linkSchema),createLink)
router.delete('/link/:id',authRequired,deleteLink)
router.put('/link/:id',authRequired,updateLink)

// router.get('/link/:id',authRequired,getLink)

router.get('/group',authRequired,getGroups)
router.get('/group/:id',authRequired,getGroup)
router.post('/group',authRequired,validateSchema(groupSchema),createGroup)
router.delete('/group/:id',authRequired,deleteGroup)
router.put('/group/:id',authRequired,updateGroup)


export default router;