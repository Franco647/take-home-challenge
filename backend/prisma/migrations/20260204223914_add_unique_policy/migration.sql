/*
  Warnings:

  - The primary key for the `Policy` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Policy" DROP CONSTRAINT "Policy_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Policy_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Policy_id_seq";
