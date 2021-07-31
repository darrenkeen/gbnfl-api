import {MigrationInterface, QueryRunner} from "typeorm";

export class achievementAddPlayerTable1625587953563 implements MigrationInterface {
    name = 'achievementAddPlayerTable1625587953563'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "playerAchievement" ("id" character varying(10) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "playerId" character varying(10), "achievementId" character varying(10), CONSTRAINT "PK_0ffe86fe7f6c58963f7ef8e6fd4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TYPE "public"."achievement_scope_enum" RENAME TO "achievement_scope_enum_old"`);
        await queryRunner.query(`CREATE TYPE "achievement_scope_enum" AS ENUM('MATCH', 'TEAM')`);
        await queryRunner.query(`ALTER TABLE "achievement" ALTER COLUMN "scope" TYPE "achievement_scope_enum" USING "scope"::"text"::"achievement_scope_enum"`);
        await queryRunner.query(`DROP TYPE "achievement_scope_enum_old"`);
        await queryRunner.query(`COMMENT ON COLUMN "achievement"."scope" IS NULL`);
        await queryRunner.query(`ALTER TABLE "playerAchievement" ADD CONSTRAINT "FK_9cd3cd035be13af53055508915b" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "playerAchievement" ADD CONSTRAINT "FK_77007861fec3951e865639e0601" FOREIGN KEY ("achievementId") REFERENCES "achievement"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "playerAchievement" DROP CONSTRAINT "FK_77007861fec3951e865639e0601"`);
        await queryRunner.query(`ALTER TABLE "playerAchievement" DROP CONSTRAINT "FK_9cd3cd035be13af53055508915b"`);
        await queryRunner.query(`COMMENT ON COLUMN "achievement"."scope" IS NULL`);
        await queryRunner.query(`CREATE TYPE "achievement_scope_enum_old" AS ENUM('MATCH', 'Team')`);
        await queryRunner.query(`ALTER TABLE "achievement" ALTER COLUMN "scope" TYPE "achievement_scope_enum_old" USING "scope"::"text"::"achievement_scope_enum_old"`);
        await queryRunner.query(`DROP TYPE "achievement_scope_enum"`);
        await queryRunner.query(`ALTER TYPE "achievement_scope_enum_old" RENAME TO  "achievement_scope_enum"`);
        await queryRunner.query(`DROP TABLE "playerAchievement"`);
    }

}
