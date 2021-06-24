import {MigrationInterface, QueryRunner} from "typeorm";

export class addOverallGoal1624572107688 implements MigrationInterface {
    name = 'addOverallGoal1624572107688'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "overallGoal" ("id" character varying(10) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "kd" numeric NOT NULL, "winPercent" integer NOT NULL, "topTenPercent" integer NOT NULL, "playerId" character varying(10), CONSTRAINT "REL_a10fe2980a340f66d258dca36d" UNIQUE ("playerId"), CONSTRAINT "PK_219c9003331ef3ba6fcb77e4c55" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "players" ADD "userId" character varying(10)`);
        await queryRunner.query(`ALTER TABLE "players" ADD CONSTRAINT "UQ_7c11c744c0601ab432cfa6ff7ad" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "players" ADD "overallGoalId" character varying(10)`);
        await queryRunner.query(`ALTER TABLE "players" ADD CONSTRAINT "UQ_1fee6c5ca6ccb09b7891a878f3c" UNIQUE ("overallGoalId")`);
        await queryRunner.query(`ALTER TABLE "overallGoal" ADD CONSTRAINT "FK_a10fe2980a340f66d258dca36d3" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "players" ADD CONSTRAINT "FK_7c11c744c0601ab432cfa6ff7ad" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "players" ADD CONSTRAINT "FK_1fee6c5ca6ccb09b7891a878f3c" FOREIGN KEY ("overallGoalId") REFERENCES "overallGoal"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "players" DROP CONSTRAINT "FK_1fee6c5ca6ccb09b7891a878f3c"`);
        await queryRunner.query(`ALTER TABLE "players" DROP CONSTRAINT "FK_7c11c744c0601ab432cfa6ff7ad"`);
        await queryRunner.query(`ALTER TABLE "overallGoal" DROP CONSTRAINT "FK_a10fe2980a340f66d258dca36d3"`);
        await queryRunner.query(`ALTER TABLE "players" DROP CONSTRAINT "UQ_1fee6c5ca6ccb09b7891a878f3c"`);
        await queryRunner.query(`ALTER TABLE "players" DROP COLUMN "overallGoalId"`);
        await queryRunner.query(`ALTER TABLE "players" DROP CONSTRAINT "UQ_7c11c744c0601ab432cfa6ff7ad"`);
        await queryRunner.query(`ALTER TABLE "players" DROP COLUMN "userId"`);
        await queryRunner.query(`DROP TABLE "overallGoal"`);
    }

}
