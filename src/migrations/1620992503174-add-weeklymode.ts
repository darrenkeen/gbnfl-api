import { MigrationInterface, QueryRunner } from 'typeorm';

export class addWeeklymode1620992503174 implements MigrationInterface {
  name = 'addWeeklymode1620992503174';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "weeklyMode" ("id" character varying(10) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "mode" character varying NOT NULL, "kills" integer NOT NULL, "deaths" integer NOT NULL, "assists" integer NOT NULL, "avgLifeTime" numeric NOT NULL, "headshots" integer NOT NULL, "gulagDeaths" integer NOT NULL, "gulagKills" integer NOT NULL, "matchesPlayed" integer NOT NULL, "damageDone" integer NOT NULL, "damageTaken" integer NOT NULL, "kdRatio" numeric NOT NULL, "killsPerGame" numeric NOT NULL, "playerId" character varying(10) NOT NULL, CONSTRAINT "PK_0875c74f970e56e3e4f4a618c36" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "weeklyMode" ADD CONSTRAINT "FK_ea0414df98191c4abd343a987f4" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "weeklyMode" DROP CONSTRAINT "FK_ea0414df98191c4abd343a987f4"`
    );
    await queryRunner.query(`DROP TABLE "weeklyMode"`);
  }
}
