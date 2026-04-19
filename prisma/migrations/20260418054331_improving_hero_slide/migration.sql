/*
  Warnings:

  - You are about to drop the column `link` on the `HeroSlider` table. All the data in the column will be lost.
  - You are about to drop the column `subtitle` on the `HeroSlider` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `HeroSlider` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[productId]` on the table `HeroSlider` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `image` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `headline` to the `HeroSlider` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `HeroSlider` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subline` to the `HeroSlider` table without a default value. This is not possible if the table is not empty.
  - Made the column `position` on table `ProductImage` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "image" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "HeroSlider" DROP COLUMN "link",
DROP COLUMN "subtitle",
DROP COLUMN "title",
ADD COLUMN     "headline" TEXT NOT NULL,
ADD COLUMN     "isSlider" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "subline" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProductImage" ALTER COLUMN "position" SET NOT NULL,
ALTER COLUMN "position" SET DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "HeroSlider_productId_key" ON "HeroSlider"("productId");

-- AddForeignKey
ALTER TABLE "HeroSlider" ADD CONSTRAINT "HeroSlider_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
