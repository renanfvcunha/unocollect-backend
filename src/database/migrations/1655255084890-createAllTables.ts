import {MigrationInterface, QueryRunner} from "typeorm";

export class createAllTables1655255084890 implements MigrationInterface {
    name = 'createAllTables1655255084890'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `groups` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(50) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `users` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(100) NOT NULL, `username` varchar(50) NOT NULL, `password` varchar(100) NOT NULL, `admin` tinyint NOT NULL DEFAULT 0, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `images_users_forms` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(30) NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `user_form_id` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `users_forms` (`id` int NOT NULL AUTO_INCREMENT, `latitude` decimal(10,8) NOT NULL, `longitude` decimal(11,8) NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `user_id` int NOT NULL, `form_id` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `fields_users_values` (`id` int NOT NULL AUTO_INCREMENT, `value` text NOT NULL, `updates` int NOT NULL DEFAULT 0, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `field_id` int NOT NULL, `user_form_id` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `fields` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(100) NOT NULL, `description` varchar(200) NULL, `type` varchar(20) NOT NULL DEFAULT 'text', `options` varchar(200) NULL, `required` tinyint NOT NULL DEFAULT 0, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `form_id` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `forms` (`id` int NOT NULL AUTO_INCREMENT, `title` varchar(100) NOT NULL, `description` text NOT NULL, `status` smallint NOT NULL DEFAULT 1, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `category_id` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `categories` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(50) NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `users_groups` (`user_id` int NOT NULL, `group_id` int NOT NULL, INDEX `IDX_3f4a7469c59e1c47a02a4f9ac5` (`user_id`), INDEX `IDX_d665a3539878a2669c5ff26966` (`group_id`), PRIMARY KEY (`user_id`, `group_id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `forms_groups` (`form_id` int NOT NULL, `group_id` int NOT NULL, INDEX `IDX_e521b8dc3a3af16b897deac3d6` (`form_id`), INDEX `IDX_280b8618458a3e5612431b4bbf` (`group_id`), PRIMARY KEY (`form_id`, `group_id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `images_users_forms` ADD CONSTRAINT `FK_4abb756b83a9acb5f93700e9956` FOREIGN KEY (`user_form_id`) REFERENCES `users_forms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE");
        await queryRunner.query("ALTER TABLE `users_forms` ADD CONSTRAINT `FK_0156bddbda0b5fc665d14dca510` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE");
        await queryRunner.query("ALTER TABLE `users_forms` ADD CONSTRAINT `FK_b83fdd0f8c7ad11305d8280e398` FOREIGN KEY (`form_id`) REFERENCES `forms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE");
        await queryRunner.query("ALTER TABLE `fields_users_values` ADD CONSTRAINT `FK_db92396f579a0ee4d6599834153` FOREIGN KEY (`field_id`) REFERENCES `fields`(`id`) ON DELETE CASCADE ON UPDATE CASCADE");
        await queryRunner.query("ALTER TABLE `fields_users_values` ADD CONSTRAINT `FK_d409cf48d09a726da4b60b89a54` FOREIGN KEY (`user_form_id`) REFERENCES `users_forms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE");
        await queryRunner.query("ALTER TABLE `fields` ADD CONSTRAINT `FK_1b10aa5577f9c30e6b475410416` FOREIGN KEY (`form_id`) REFERENCES `forms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE");
        await queryRunner.query("ALTER TABLE `forms` ADD CONSTRAINT `FK_ca77527e42d6b000e992fb7ff05` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE");
        await queryRunner.query("ALTER TABLE `users_groups` ADD CONSTRAINT `FK_3f4a7469c59e1c47a02a4f9ac50` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `users_groups` ADD CONSTRAINT `FK_d665a3539878a2669c5ff26966c` FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `forms_groups` ADD CONSTRAINT `FK_e521b8dc3a3af16b897deac3d6c` FOREIGN KEY (`form_id`) REFERENCES `forms`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `forms_groups` ADD CONSTRAINT `FK_280b8618458a3e5612431b4bbf1` FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `forms_groups` DROP FOREIGN KEY `FK_280b8618458a3e5612431b4bbf1`");
        await queryRunner.query("ALTER TABLE `forms_groups` DROP FOREIGN KEY `FK_e521b8dc3a3af16b897deac3d6c`");
        await queryRunner.query("ALTER TABLE `users_groups` DROP FOREIGN KEY `FK_d665a3539878a2669c5ff26966c`");
        await queryRunner.query("ALTER TABLE `users_groups` DROP FOREIGN KEY `FK_3f4a7469c59e1c47a02a4f9ac50`");
        await queryRunner.query("ALTER TABLE `forms` DROP FOREIGN KEY `FK_ca77527e42d6b000e992fb7ff05`");
        await queryRunner.query("ALTER TABLE `fields` DROP FOREIGN KEY `FK_1b10aa5577f9c30e6b475410416`");
        await queryRunner.query("ALTER TABLE `fields_users_values` DROP FOREIGN KEY `FK_d409cf48d09a726da4b60b89a54`");
        await queryRunner.query("ALTER TABLE `fields_users_values` DROP FOREIGN KEY `FK_db92396f579a0ee4d6599834153`");
        await queryRunner.query("ALTER TABLE `users_forms` DROP FOREIGN KEY `FK_b83fdd0f8c7ad11305d8280e398`");
        await queryRunner.query("ALTER TABLE `users_forms` DROP FOREIGN KEY `FK_0156bddbda0b5fc665d14dca510`");
        await queryRunner.query("ALTER TABLE `images_users_forms` DROP FOREIGN KEY `FK_4abb756b83a9acb5f93700e9956`");
        await queryRunner.query("DROP INDEX `IDX_280b8618458a3e5612431b4bbf` ON `forms_groups`");
        await queryRunner.query("DROP INDEX `IDX_e521b8dc3a3af16b897deac3d6` ON `forms_groups`");
        await queryRunner.query("DROP TABLE `forms_groups`");
        await queryRunner.query("DROP INDEX `IDX_d665a3539878a2669c5ff26966` ON `users_groups`");
        await queryRunner.query("DROP INDEX `IDX_3f4a7469c59e1c47a02a4f9ac5` ON `users_groups`");
        await queryRunner.query("DROP TABLE `users_groups`");
        await queryRunner.query("DROP TABLE `categories`");
        await queryRunner.query("DROP TABLE `forms`");
        await queryRunner.query("DROP TABLE `fields`");
        await queryRunner.query("DROP TABLE `fields_users_values`");
        await queryRunner.query("DROP TABLE `users_forms`");
        await queryRunner.query("DROP TABLE `images_users_forms`");
        await queryRunner.query("DROP TABLE `users`");
        await queryRunner.query("DROP TABLE `groups`");
    }

}
