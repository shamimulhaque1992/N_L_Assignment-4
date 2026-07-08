import { Prisma } from "../../../generated/prisma/client";
import { PaymentStatus, RequestStatus } from "../../../generated/prisma/enums";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import {
  ICreatePaymentSessionPayload,
  IGetAllPaymentsQuery,
} from "./payment.interface";
import { handleCheckoutSessionCompleted } from "./payment.utils";

const createPaymentSession = async (
  tenantId: string,
  payload: ICreatePaymentSessionPayload,
) => {
  const { rentalRequestId } = payload;

  const rentalRequest = await prisma.rentalRequest.findUniqueOrThrow({
    where: { id: rentalRequestId },
    include: {
      property: true,
      tenant: true,
      payment: true,
    },
  });

  if (rentalRequest.tenantId !== tenantId) {
    throw new Error("You are not authorized to pay for this rental request");
  }

  if (
    rentalRequest.status !== RequestStatus.APPROVED &&
    rentalRequest.status !== RequestStatus.ACTIVE
  ) {
    throw new Error(
      "Payment can only be made for approved or active rental requests",
    );
  }

  if (
    rentalRequest.payment &&
    rentalRequest.payment.status === PaymentStatus.COMPLETED &&
    rentalRequest.payment.currentPeriodEnd &&
    new Date(rentalRequest.payment.currentPeriodEnd) > new Date()
  ) {
    throw new Error(
      "Your rental is still active. You can pay again after the current period ends",
    );
  }

  const amountInPaisa = Math.round(Number(rentalRequest.property.price) * 100);

  let stripeCustomerId = rentalRequest.payment?.stripeCustomerId ?? null;

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: rentalRequest.tenant.email,
      name: rentalRequest.tenant.name,
      metadata: { tenantId },
    });
    stripeCustomerId = customer.id;
  }

  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "bdt",
          unit_amount: amountInPaisa,
          product_data: {
            name: `Monthly rent — ${rentalRequest.property.title}`,
            description: rentalRequest.property.address,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${config.app_url}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.app_url}/payment/cancel`,
    metadata: {
      rentalRequestId,
      tenantId,
    },
  });

  await prisma.payment.upsert({
    where: { rentalRequestId },
    create: {
      rentalRequestId,
      stripeCustomerId,
      stripeSessionId: session.id,
      amount: rentalRequest.property.price,
      provider: "STRIPE",
      method: "CARD",
      status: "PENDING",
    },
    update: {
      stripeCustomerId,
      stripeSessionId: session.id,
      stripeSubscriptionId: null,
      status: "PENDING",
      currentPeriodEnd: null,
      paidAt: null,
    },
  });

  return {
    paymentUrl: session.url,
  };
};

const handleWebhook = async (payload: Buffer, signature: string) => {
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    config.stripe_webhook_secret,
  );

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutSessionCompleted(event.data.object);
      break;

    default:
      console.log(`Unhandled Stripe event type: ${event.type}`);
      break;
  }
};

const getAllPayments = async (query: IGetAllPaymentsQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "desc";

  const andConditions: Prisma.PaymentWhereInput[] = [];

  if (query.status) {
    andConditions.push({ status: query.status as PaymentStatus });
  }

  if (query.tenantId) {
    andConditions.push({
      rentalRequest: { tenantId: query.tenantId },
    });
  }

  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where: { AND: andConditions },
      take: limit,
      skip,
      orderBy: { [sortBy]: sortOrder },
      include: {
        rentalRequest: {
          include: {
            property: {
              include: { category: true },
            },
            tenant: {
              omit: { password: true },
            },
          },
        },
      },
    }),
    prisma.payment.count({ where: { AND: andConditions } }),
  ]);

  return {
    data: payments,
    meta: { page, limit, total },
  };
};

const getSinglePayment = async (paymentId: string) => {
  const payment = await prisma.payment.findUniqueOrThrow({
    where: { id: paymentId },
    include: {
      rentalRequest: {
        include: {
          property: {
            include: { category: true },
          },
          tenant: {
            omit: { password: true },
          },
        },
      },
    },
  });

  return payment;
};

export const paymentService = {
  createPaymentSession,
  handleWebhook,
  getAllPayments,
  getSinglePayment,
};
