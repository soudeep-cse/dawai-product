-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "otpCodeHash",
DROP COLUMN "otpExpiresAt",
ADD COLUMN     "firebaseUid" TEXT,
ALTER COLUMN "phone" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Customer_firebaseUid_key" ON "Customer"("firebaseUid");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

