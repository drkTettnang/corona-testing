/*
  Warnings:

  - Added the required column `slot_id` to the `reservations` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `slots.date_unique` ON `slots`;

-- CreateTable
CREATE TABLE `locations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `rolling_booking` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Insert default location
INSERT INTO `locations` (`name`, `address`, `description`, `rolling_booking`) VALUES ('Hauptstelle', 'Musterstr. 1', '', FALSE);

-- AlterTable
ALTER TABLE `slots` ADD COLUMN     `location_id` INTEGER NOT NULL DEFAULT 1;

ALTER TABLE `slots` ALTER `location_id` DROP DEFAULT;

-- AlterTable
ALTER TABLE `bookings` ADD COLUMN     `slot_id` INTEGER NOT NULL DEFAULT 0;

UPDATE `bookings` SET `slot_id` = (SELECT `id` FROM `slots` WHERE `slots`.`date` = `bookings`.`date`);

ALTER TABLE `bookings` ALTER `slot_id` DROP DEFAULT;

-- AlterTable
ALTER TABLE `reservations` DROP COLUMN `date`,
    ADD COLUMN     `slot_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `bookings` ADD FOREIGN KEY (`slot_id`) REFERENCES `slots`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reservations` ADD FOREIGN KEY (`slot_id`) REFERENCES `slots`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `slots` ADD FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
