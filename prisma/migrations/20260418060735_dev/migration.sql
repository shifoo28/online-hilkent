/*
  Warnings:

  - You are about to drop the `HeroSlider` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "HeroSlider" DROP CONSTRAINT "HeroSlider_productId_fkey";

-- DropTable
DROP TABLE "HeroSlider";

-- CreateTable
CREATE TABLE "HeroProduct" (
    "id" SERIAL NOT NULL,
    "productId" TEXT NOT NULL,
    "isSlider" BOOLEAN NOT NULL DEFAULT true,
    "headline" TEXT NOT NULL,
    "subline" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HeroProduct_productId_key" ON "HeroProduct"("productId");

-- AddForeignKey
ALTER TABLE "HeroProduct" ADD CONSTRAINT "HeroProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
