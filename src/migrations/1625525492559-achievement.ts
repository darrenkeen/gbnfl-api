import { MigrationInterface, QueryRunner } from 'typeorm';

export class achievement1625525492559 implements MigrationInterface {
  name = 'achievement1625525492559';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "achievement_type_enum" AS ENUM('KILLS', 'KD', 'WIN', 'GULAG', 'KILLER', 'TOP_TEN')`
    );
    await queryRunner.query(
      `CREATE TYPE "achievement_scope_enum" AS ENUM('MATCH', 'Team')`
    );
    await queryRunner.query(
      `CREATE TYPE "achievement_special_enum" AS ENUM('NO_DEATH', 'HIGHEST_KILLER', 'UNDER_250_DMG')`
    );
    await queryRunner.query(
      `CREATE TYPE "achievement_modifiertype_enum" AS ENUM('ROW', 'LAST', 'ACHIEVE')`
    );
    await queryRunner.query(
      `CREATE TABLE "achievement" ("id" character varying(10) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "type" "achievement_type_enum" NOT NULL, "value" integer NOT NULL, "modifier" integer NOT NULL, "scope" "achievement_scope_enum", "special" "achievement_special_enum" array NOT NULL DEFAULT '{}', "modifierType" "achievement_modifiertype_enum" NOT NULL, CONSTRAINT "PK_441339f40e8ce717525a381671e" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "achievement"`);
    await queryRunner.query(`DROP TYPE "achievement_modifiertype_enum"`);
    await queryRunner.query(`DROP TYPE "achievement_special_enum"`);
    await queryRunner.query(`DROP TYPE "achievement_scope_enum"`);
    await queryRunner.query(`DROP TYPE "achievement_type_enum"`);
  }
}
