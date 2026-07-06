import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get(
  "/",
  auth(Role.ADMIN, Role.LANDLORD, Role.TENANT),
  userController.getAllUsers,
);
router.get(
  "/me",
  auth(Role.ADMIN, Role.LANDLORD, Role.TENANT),
  userController.getSingleUser,
);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.patch("/:id/moderate", userController.moderateUsr);

export const userRoutes = router;
