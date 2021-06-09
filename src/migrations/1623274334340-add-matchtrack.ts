import {MigrationInterface, QueryRunner} from "typeorm";

export class addMatchtrack1623274334340 implements MigrationInterface {
    name = 'addMatchtrack1623274334340'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "matchTrack" ("id" character varying(10) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d64a82cc356accf9b1b2055b05c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "lifetimePlayer" DROP CONSTRAINT "FK_3374e01ea8d6380a453a2f21227"`);
        await queryRunner.query(`ALTER TABLE "lifetimePlayer" ALTER COLUMN "playerId" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "lifetimePlayer"."playerId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "weeklyMode" DROP CONSTRAINT "FK_ea0414df98191c4abd343a987f4"`);
        await queryRunner.query(`ALTER TABLE "weeklyMode" ALTER COLUMN "playerId" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "weeklyMode"."playerId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "lifetimePlayer" ADD CONSTRAINT "FK_3374e01ea8d6380a453a2f21227" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "weeklyMode" ADD CONSTRAINT "FK_ea0414df98191c4abd343a987f4" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "weeklyMode" DROP CONSTRAINT "FK_ea0414df98191c4abd343a987f4"`);
        await queryRunner.query(`ALTER TABLE "lifetimePlayer" DROP CONSTRAINT "FK_3374e01ea8d6380a453a2f21227"`);
        await queryRunner.query(`COMMENT ON COLUMN "weeklyMode"."playerId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "weeklyMode" ALTER COLUMN "playerId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "weeklyMode" ADD CONSTRAINT "FK_ea0414df98191c4abd343a987f4" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`COMMENT ON COLUMN "lifetimePlayer"."playerId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "lifetimePlayer" ALTER COLUMN "playerId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lifetimePlayer" ADD CONSTRAINT "FK_3374e01ea8d6380a453a2f21227" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP TABLE "matchTrack"`);
    }

}
