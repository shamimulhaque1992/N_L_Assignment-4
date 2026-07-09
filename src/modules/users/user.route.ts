import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get("/", auth(Role.ADMIN), userController.getAllUsers);
router.get(
  "/me",
  auth(Role.ADMIN, Role.LANDLORD, Role.TENANT),
  userController.getSingleUser,
);
router.put(
  "/:id",
  auth(Role.ADMIN, Role.LANDLORD, Role.TENANT),
  userController.updateUser,
);
router.delete("/:id", auth(Role.ADMIN), userController.deleteUser);
router.patch("/:id/moderate", auth(Role.ADMIN), userController.moderateUser);

export const userRoutes = router;
