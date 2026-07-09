import Stripe from "stripe";
import {
  PaymentStatus,
  PropertyStatus,
  RequestStatus,
} from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

export const handleCheckoutSessionCompleted = async (
  session: Stripe.Checkout.Session,
) => {
  const rentalRequestId = session.metadata?.rentalRequestId;

  if (!rentalRequestId) {
    console.error("Webhook: missing rentalRequestId in metadata — skipping");
    return;
  }

  const transactionId = session.payment_intent as string | null;

  const currentPeriodEnd = new Date();
  currentPeriodEnd.setDate(currentPeriodEnd.getDate() + 30);

  const transactionResult = await prisma.$transaction(async (tx) => {
    const [updatedPayment, updatedRentalRequest] = await Promise.all([
      tx.payment.update({
        where: { rentalRequestId },
        data: {
          status: PaymentStatus.COMPLETED,
          stripeSubscriptionId: transactionId,
          currentPeriodEnd,
          paidAt: new Date(),
        },
      }),
      tx.rentalRequest.update({
        where: { id: rentalRequestId },
        data: { status: RequestStatus.ACTIVE },
      }),
    ]);

    const updatedProperty = await tx.property.update({
      where: { id: updatedRentalRequest.propertyId },
      data: { status: PropertyStatus.UNAVAILABLE },
    });

    return { updatedPayment, updatedRentalRequest, updatedProperty };
  });

  return transactionResult;
};

export const handleCheckoutSessionExpired = async (
  session: Stripe.Checkout.Session,
) => {
  const rentalRequestId = session.metadata?.rentalRequestId;

  if (!rentalRequestId) {
    console.error("Webhook: missing rentalRequestId in metadata skipping");
    return;
  }

  await prisma.payment.update({
    where: { rentalRequestId },
    data: { status: PaymentStatus.FAILED },
  });
};
