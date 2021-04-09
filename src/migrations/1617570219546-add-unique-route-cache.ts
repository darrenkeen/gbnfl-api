import {MigrationInterface, QueryRunner} from "typeorm";

export class addUniqueRouteCache1617570219546 implements MigrationInterface {
    name = 'addUniqueRouteCache1617570219546'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "Cache"."route" IS NULL`);
        await queryRunner.query(`ALTER TABLE "Cache" ADD CONSTRAINT "UQ_54978163865769b568706e8c983" UNIQUE ("route")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Cache" DROP CONSTRAINT "UQ_54978163865769b568706e8c983"`);
        await queryRunner.query(`COMMENT ON COLUMN "Cache"."route" IS NULL`);
    }

}
