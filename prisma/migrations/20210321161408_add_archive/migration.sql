-- CreateTable
CREATE TABLE `archiv` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `evaluated_at` DATETIME(3),
    `result` VARCHAR(191) NOT NULL,
    `test_kit_name` VARCHAR(191) NOT NULL,
    `person` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
