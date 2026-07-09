import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentService } from "./payment.service";

const createPaymentSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.id as string;
    const result = await paymentService.createPaymentSession(
      tenantId,
      req.body,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment session created successfully",
      data: result,
    });
  },
);

const handleWebhook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rawBody = req.body as Buffer;
    const signature = req.headers["stripe-signature"] as string;

    if (!signature) {
      console.error("Webhook: missing stripe-signature header");
      return res.status(400).send("Missing stripe-signature header");
    }

    try {
      await paymentService.handleWebhook(rawBody, signature);
      return res.status(200).json({ received: true });
    } catch (error: any) {
      console.error("Webhook error:", error.message);
      return res.status(400).send(`Webhook Error: ${error.message}`);
    }
  },
);

const getAllPayments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = { ...req.query } as any;

    // Tenants can only see their own payments
    if (req.user?.role === "TENANT") {
      query.tenantId = req.user.id;
    }

    const result = await paymentService.getAllPayments(query);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payments retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  },
);

const getSinglePayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const paymentId = req.params.id as string;
    const result = await paymentService.getSinglePayment(paymentId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment retrieved successfully",
      data: result,
    });
  },
);

export const paymentController = {
  createPaymentSession,
  handleWebhook,
  getAllPayments,
  getSinglePayment,
};
