import {MigrationInterface, QueryRunner} from "typeorm";

export class alterFieldOptionsToText1655726439641 implements MigrationInterface {
    name = 'alterFieldOptionsToText1655726439641'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `fields` DROP COLUMN `options`");
        await queryRunner.query("ALTER TABLE `fields` ADD `options` text NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `fields` DROP COLUMN `options`");
        await queryRunner.query("ALTER TABLE `fields` ADD `options` varchar(200) NULL");
    }

}
