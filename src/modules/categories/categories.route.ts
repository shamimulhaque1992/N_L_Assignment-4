import { Router } from "express";
import { categoriesController } from "./categories.controller";
import { categoriesValidator } from "./categories.validation";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get("/", categoriesController.getAllCategories);
router.get("/:id", categoriesController.getSingleCategory);
router.post("/", auth(Role.ADMIN), categoriesValidator.create, categoriesController.createCategory);
router.patch("/:id", auth(Role.ADMIN), categoriesValidator.update, categoriesController.updateCategory);
router.delete("/:id", auth(Role.ADMIN), categoriesController.deleteCategory);

export const categoriesRoutes = router;
