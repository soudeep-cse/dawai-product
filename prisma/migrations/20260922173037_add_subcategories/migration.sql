/*
  Warnings:

  - You are about to drop the column `subcategory` on the `Medicine` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Medicine" DROP COLUMN "subcategory",
ADD COLUMN     "subcategoryId" TEXT;

-- CreateTable
CREATE TABLE "Subcategory" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameBn" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subcategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Subcategory_categoryId_idx" ON "Subcategory"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Subcategory_categoryId_slug_key" ON "Subcategory"("categoryId", "slug");

-- CreateIndex
CREATE INDEX "Medicine_subcategoryId_idx" ON "Medicine"("subcategoryId");

-- AddForeignKey
ALTER TABLE "Subcategory" ADD CONSTRAINT "Subcategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medicine" ADD CONSTRAINT "Medicine_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "Subcategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
