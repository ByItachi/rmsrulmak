import { Router, type IRouter } from "express";
import catalogRouter from "./catalog";
import healthRouter from "./health";
import inquiriesRouter from "./inquiries";
import authRouter from "./auth";
import catalogsRouter from "./catalogs";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(catalogRouter);
router.use(catalogsRouter);
router.use(inquiriesRouter);

export default router;
