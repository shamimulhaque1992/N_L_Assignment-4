import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { notFound } from "./middlewares/notFound";
import { globalErrorHandler } from "./middlewares/globaErrorHandler";
import { authRoutes } from "./modules/auth/auth.route";
import { userRoutes } from "./modules/users/user.route";
import { propertiesRoutes } from "./modules/properties/properties.route";
import { categoriesRoutes } from "./modules/categories/categories.route";
import { requestRoutes } from "./modules/rental-requests/request.route";
import { reviewsRoutes } from "./modules/reviews/reviews.route";
import { adminRoutes } from "./modules/admin/admin.route";
import { landlordRoutes } from "./modules/landlord/landlord.route";

const app: Application = express();
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);
app.use(express.json());
app.get("/", async (req: Request, res: Response) => {
  res.send({ message: "RentNest API is running" });
});

// Authentication routes
app.use("/api/v1/auth", authRoutes);

// User routes
app.use("/api/v1/users", userRoutes);

// Property routes (public & landlord)
app.use("/api/v1/properties", propertiesRoutes);

// Category routes (public & admin)
app.use("/api/v1/categories", categoriesRoutes);

// Rental request routes (tenant & landlord)
app.use("/api/v1/rentals", requestRoutes);

// Review routes (public & tenant)
app.use("/api/v1/reviews", reviewsRoutes);

// Admin routes
app.use("/api/v1/admin", adminRoutes);

// Landlord routes
app.use("/api/v1/landlord", landlordRoutes);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
