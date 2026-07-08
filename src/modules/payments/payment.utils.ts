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

    await tx.rentalRequest.update({
      where: { id: rentalRequestId },
      data: { status: RequestStatus.ACTIVE },
    });
  });

  console.log("currentPeriodEnd:", currentPeriodEnd.toISOString());
};
