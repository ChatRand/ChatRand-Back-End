/*
  Warnings:

  - Made the column `token` on table `black_listed_tokens` required. This step will fail if there are existing NULL values in that column.
  - Made the column `token_id` on table `user_logins` required. This step will fail if there are existing NULL values in that column.
  - Made the column `first_name` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `last_name` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `username` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone_number` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `black_listed_tokens` MODIFY `token` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user_logins` MODIFY `logged_out_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `token_id` VARCHAR(191) NOT NULL,
    MODIFY `token_deleted` BOOLEAN NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `first_name` VARCHAR(191) NOT NULL,
    MODIFY `last_name` VARCHAR(191) NOT NULL,
    MODIFY `username` VARCHAR(191) NOT NULL,
    MODIFY `email` VARCHAR(191) NOT NULL,
    MODIFY `phone_number` VARCHAR(191) NOT NULL,
    MODIFY `reset_password_token` VARCHAR(191) NULL,
    MODIFY `reset_password_expires` DATETIME(3) NULL,
    MODIFY `confirmation_code` VARCHAR(191) NULL,
    MODIFY `Activated` BOOLEAN NULL;
