-- CreateTable
CREATE TABLE "Reservations" (
    "id" SERIAL NOT NULL,
    "timeStamp" TIMESTAMP(3) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "invoiceId" TEXT NOT NULL,

    CONSTRAINT "Reservations_pkey" PRIMARY KEY ("id")
);
