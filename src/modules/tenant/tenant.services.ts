import { PaymentStatus, RequestStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IGetTenantStats } from "./tenant.interface";

const getTenantStats = async (tenantId: string): Promise<IGetTenantStats> => {
  const [
    totalRequests,
    pendingRequests,
    approvedRequests,
    rejectedRequests,
    activeRequests,
    completedRequests,
    cancelledRequests,
    totalReviews,
    totalAmountSpentResult,
    totalPayments,
  ] = await Promise.all([
    prisma.rentalRequest.count({ where: { tenantId } }),
    prisma.rentalRequest.count({
      where: { tenantId, status: RequestStatus.PENDING },
    }),
    prisma.rentalRequest.count({
      where: { tenantId, status: RequestStatus.APPROVED },
    }),
    prisma.rentalRequest.count({
      where: { tenantId, status: RequestStatus.REJECTED },
    }),
    prisma.rentalRequest.count({
      where: { tenantId, status: RequestStatus.ACTIVE },
    }),
    prisma.rentalRequest.count({
      where: { tenantId, status: RequestStatus.COMPLETED },
    }),
    prisma.rentalRequest.count({
      where: { tenantId, status: RequestStatus.CANCELLED },
    }),
    prisma.review.count({ where: { tenantId } }),
    prisma.payment.aggregate({
      where: {
        rentalRequest: { tenantId },
        status: PaymentStatus.COMPLETED,
      },
      _sum: { amount: true },
    }),
    prisma.payment.count({
      where: {
        rentalRequest: { tenantId },
        status: PaymentStatus.COMPLETED,
      },
    }),
  ]);

  return {
    totalRequests,
    pendingRequests,
    approvedRequests,
    rejectedRequests,
    activeRequests,
    completedRequests,
    cancelledRequests,
    totalReviews,
    totalPayments,
    totalAmountSpent: Number(totalAmountSpentResult._sum.amount) ?? 0,
  };
};

export const tenantService = {
  getTenantStats,
};
