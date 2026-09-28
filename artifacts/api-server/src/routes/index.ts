import { Router, type IRouter } from "express";
import catalogRouter from "./catalog";
import healthRouter from "./health";
import inquiriesRouter from "./inquiries";

const router: IRouter = Router();

router.use(healthRouter);
router.use(catalogRouter);
router.use(inquiriesRouter);

export default router;
