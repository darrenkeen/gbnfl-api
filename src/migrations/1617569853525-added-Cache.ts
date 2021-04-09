import {MigrationInterface, QueryRunner} from "typeorm";

export class addedCache1617569853525 implements MigrationInterface {
    name = 'addedCache1617569853525'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Cache" ("id" character varying(10) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "route" character varying NOT NULL, "timestamp" TIMESTAMP NOT NULL, CONSTRAINT "PK_5f7398e68f8dcbfa648c2a1bf07" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "Cache"`);
    }

}
