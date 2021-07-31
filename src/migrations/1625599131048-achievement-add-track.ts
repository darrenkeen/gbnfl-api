import {MigrationInterface, QueryRunner} from "typeorm";

export class achievementAddTrack1625599131048 implements MigrationInterface {
    name = 'achievementAddTrack1625599131048'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "achievementTrack" ("id" character varying(10) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_91971e591921199bc1648c23b59" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "achievementTrack"`);
    }

}
