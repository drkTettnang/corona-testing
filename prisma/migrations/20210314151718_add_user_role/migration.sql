-- AlterTable
ALTER TABLE `users` ADD COLUMN     `role` ENUM('user', 'moderator', 'admin') NOT NULL DEFAULT 'user';
