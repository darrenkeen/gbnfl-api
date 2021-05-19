import {MigrationInterface, QueryRunner} from "typeorm";

export class addLifetimeplayerAddDecimal1620837663762 implements MigrationInterface {
    name = 'addLifetimeplayerAddDecimal1620837663762'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lifetimePlayer" DROP COLUMN "kdRatio"`);
        await queryRunner.query(`ALTER TABLE "lifetimePlayer" ADD "kdRatio" numeric NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lifetimePlayer" DROP COLUMN "scorePerMinute"`);
        await queryRunner.query(`ALTER TABLE "lifetimePlayer" ADD "scorePerMinute" numeric NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lifetimePlayer" DROP COLUMN "scorePerMinute"`);
        await queryRunner.query(`ALTER TABLE "lifetimePlayer" ADD "scorePerMinute" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lifetimePlayer" DROP COLUMN "kdRatio"`);
        await queryRunner.query(`ALTER TABLE "lifetimePlayer" ADD "kdRatio" integer NOT NULL`);
    }

}
