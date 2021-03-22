/*
  Warnings:

  - Added the required column `age` to the `archiv` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `archiv` ADD COLUMN     `age` INTEGER NOT NULL;
