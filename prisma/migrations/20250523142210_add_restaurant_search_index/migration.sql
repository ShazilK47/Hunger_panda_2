-- AlterTable
ALTER TABLE `restaurants` MODIFY `name` VARCHAR(255) NOT NULL,
    MODIFY `description` TEXT NULL,
    MODIFY `imageUrl` TEXT NULL,
    MODIFY `address` TEXT NOT NULL;

-- CreateIndex
CREATE INDEX `restaurants_name_idx` ON `restaurants`(`name`);
