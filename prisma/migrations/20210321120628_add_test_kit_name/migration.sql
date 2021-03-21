-- AlterTable
ALTER TABLE `bookings` ADD COLUMN     `test_kit_name` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `locations` ADD COLUMN     `test_kit_name` VARCHAR(191) NOT NULL DEFAULT '';

UPDATE `bookings` SET `test_kit_name` = 'SARS-CoV-2 Rapid Antigen Test von Roche' WHERE date < NOW();

UPDATE `locations` SET `test_kit_name` = 'SARS-CoV-2 Rapid Antigen Test von Roche';
