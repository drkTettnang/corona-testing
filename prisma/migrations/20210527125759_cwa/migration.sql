-- AlterTable
ALTER TABLE `bookings` ADD COLUMN `cwa` ENUM('none', 'light', 'full') NOT NULL DEFAULT 'none',
    ADD COLUMN `salt` VARCHAR(191) NOT NULL DEFAULT '';
