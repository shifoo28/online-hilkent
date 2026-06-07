/*
  Warnings:

  - You are about to drop the column `shippingCost` on the `Order` table. All the data in the column will be lost.
  - The primary key for the `ShippingMethod` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cost` on the `ShippingMethod` table. All the data in the column will be lost.
  - The `id` column on the `ShippingMethod` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `shippingMethodId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fee` to the `ShippingMethod` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CARD', 'ONLINE', 'PAYPAL');

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_shippingMethodId_fkey";

-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "shippingCost",
ADD COLUMN     "billingAddressId" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "paymentIntentId" TEXT,
ADD COLUMN     "paymentMethod" "PaymentMethod",
ADD COLUMN     "shippingAddressId" TEXT,
ADD COLUMN     "shippingFee" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "shippingToAnotherAddress" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "shippingMethodId",
ADD COLUMN     "shippingMethodId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ShippingMethod" DROP CONSTRAINT "ShippingMethod_pkey",
DROP COLUMN "cost",
ADD COLUMN     "fee" DECIMAL(65,30) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "ShippingMethod_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "avatar" SET DEFAULT '/images/users/default.webp';

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address1" TEXT NOT NULL,
    "address2" TEXT,
    "postalCode" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Order_shippingMethodId_idx" ON "Order"("shippingMethodId");

-- CreateIndex
CREATE INDEX "Order_shippingAddressId_idx" ON "Order"("shippingAddressId");

-- CreateIndex
CREATE INDEX "Order_billingAddressId_idx" ON "Order"("billingAddressId");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_shippingMethodId_fkey" FOREIGN KEY ("shippingMethodId") REFERENCES "ShippingMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_shippingAddressId_fkey" FOREIGN KEY ("shippingAddressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_billingAddressId_fkey" FOREIGN KEY ("billingAddressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;
