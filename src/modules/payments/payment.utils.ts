import Stripe from "stripe";
import { PaymentStatus, RequestStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

export const handleCheckoutSessionCompleted = async (
  session: Stripe.Checkout.Session,
) => {
  const rentalRequestId = session.metadata?.rentalRequestId;

  console.log("Webhook: checkout.session.completed");
  console.log("rentalRequestId:", rentalRequestId);
  console.log("session.id:", session.id);
  console.log("payment_intent:", session.payment_intent);

  if (!rentalRequestId) {
    console.error("Webhook: missing rentalRequestId in metadata — skipping");
    return;
  }

  const transactionId = session.payment_intent as string | null;

  const currentPeriodEnd = new Date();
  currentPeriodEnd.setDate(currentPeriodEnd.getDate() + 30);

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { rentalRequestId },
      data: {
        status: PaymentStatus.COMPLETED,
        stripeSubscriptionId: transactionId,
        currentPeriodEnd,
        paidAt: new Date(),
      },
    });

    const rentalRequest = await tx.rentalRequest.update({
      where: { id: rentalRequestId },
      data: { status: RequestStatus.ACTIVE },
    });

    // After the property is occupied by a tenant payment then we make the property unavailable
    await tx.property.update({
      where: { id: rentalRequest.propertyId },
      data: { status: "UNAVAILABLE" },
    });
  });

  console.log("currentPeriodEnd:", currentPeriodEnd.toISOString());
};

export const handleCheckoutSessionExpired = async (
  session: Stripe.Checkout.Session,
) => {
  const rentalRequestId = session.metadata?.rentalRequestId;

  console.log("Webhook: checkout.session.expired");
  console.log("  rentalRequestId:", rentalRequestId);

  if (!rentalRequestId) {
    console.error("Webhook: missing rentalRequestId in metadata — skipping");
    return;
  }

  await prisma.payment.update({
    where: { rentalRequestId },
    data: { status: PaymentStatus.FAILED },
  });

  console.log("Payment marked FAILED");
};
