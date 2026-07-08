import { Router } from "express";
import { categoriesController } from "./categories.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get("/", categoriesController.getAllCategories);
router.get("/:id", categoriesController.getSingleCategory);
router.post("/", auth(Role.ADMIN), categoriesController.createCategory);
router.put("/:id", auth(Role.ADMIN), categoriesController.updateCategory);
router.delete("/:id", auth(Role.ADMIN), categoriesController.deleteCategory);

export const categoriesRoutes = router;
