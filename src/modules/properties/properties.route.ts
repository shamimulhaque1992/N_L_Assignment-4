import { Router } from "express";
import { propertiesController } from "./properties.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

// Public routes
router.get("/", propertiesController.getAllProperties);
router.get("/:id", propertiesController.getSingleProperty);

// Landlord routes
router.post(
  "/",
  auth(Role.LANDLORD),
  propertiesController.createProperty,
);

router.put(
  "/:id",
  auth(Role.LANDLORD),
  propertiesController.updateProperty,
);

router.delete(
  "/:id",
  auth(Role.LANDLORD),
  propertiesController.deleteProperty,
);

export const propertiesRoutes = router;
