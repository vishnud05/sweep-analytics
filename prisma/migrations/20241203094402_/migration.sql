/*
  Warnings:

  - A unique constraint covering the columns `[userId,month,year]` on the table `Quota` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Quota_userId_month_year_key" ON "Quota"("userId", "month", "year");
