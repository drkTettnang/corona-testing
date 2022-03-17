-- AlterTable
ALTER TABLE `archiv` ADD COLUMN `location_id` INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE `archiv` ADD FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
