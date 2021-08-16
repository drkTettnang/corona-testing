-- AlterTable
ALTER TABLE `archiv` ADD COLUMN `cwa` ENUM('none', 'light', 'full') NOT NULL DEFAULT 'none';
