import {MigrationInterface, QueryRunner} from "typeorm";

export class addClantag1621169367281 implements MigrationInterface {
    name = 'addClantag1621169367281'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "matchDataPlayer" ADD "clanTag" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "matchDataPlayer" DROP COLUMN "clanTag"`);
    }

}
