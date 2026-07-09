import { Router } from "express";
import { userController } from "./user.controller";
import { userValidator } from "./user.validation";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get("/", auth(Role.ADMIN), userController.getAllUsers);
router.get(
  "/me",
  auth(Role.ADMIN, Role.LANDLORD, Role.TENANT),
  userController.getSingleUser,
);
router.patch(
  "/:id",
  auth(Role.ADMIN, Role.LANDLORD, Role.TENANT),
  userValidator.update,
  userController.updateUser,
);
router.delete("/:id", auth(Role.ADMIN), userController.deleteUser);
router.patch(
  "/:id/moderate",
  auth(Role.ADMIN),
  userValidator.moderate,
  userController.moderateUser,
);

export const userRoutes = router;
