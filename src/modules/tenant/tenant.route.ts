import { Router } from "express";
import { tenantController } from "./tenant.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get("/stats", auth(Role.TENANT), tenantController.getTenantStats);

export const tenantRoutes = router;
