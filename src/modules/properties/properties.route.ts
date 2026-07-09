import { Router } from "express";
import { propertiesController } from "./properties.controller";
import { propertiesValidator } from "./properties.validation";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get("/", propertiesController.getAllProperties);
router.get("/:id", propertiesController.getSingleProperty);
router.post(
  "/",
  auth(Role.LANDLORD, Role.ADMIN),
  propertiesValidator.create,
  propertiesController.createProperty,
);
router.patch(
  "/:id",
  auth(Role.LANDLORD, Role.ADMIN),
  propertiesValidator.update,
  propertiesController.updateProperty,
);
router.delete(
  "/:id",
  auth(Role.LANDLORD, Role.ADMIN),
  propertiesController.deleteProperty,
);

export const propertiesRoutes = router;
