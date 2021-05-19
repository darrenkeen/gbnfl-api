import { MigrationInterface, QueryRunner } from 'typeorm';

export class addLifetimeplayer1620837119883 implements MigrationInterface {
  name = 'addLifetimeplayer1620837119883';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "lifetimePlayer" ("id" character varying(10) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "wins" integer NOT NULL, "kills" integer NOT NULL, "kdRatio" integer NOT NULL, "downs" integer NOT NULL, "topTwentyFive" integer NOT NULL, "topTen" integer NOT NULL, "contracts" integer NOT NULL, "revives" integer NOT NULL, "topFive" integer NOT NULL, "score" integer NOT NULL, "timePlayed" integer NOT NULL, "gamesPlayed" integer NOT NULL, "tokens" integer NOT NULL, "scorePerMinute" integer NOT NULL, "cash" integer NOT NULL, "deaths" integer NOT NULL, "playerId" character varying(10) NOT NULL, CONSTRAINT "PK_5ca65a469bdd884982e4693ca5e" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "lifetimePlayer" ADD CONSTRAINT "FK_3374e01ea8d6380a453a2f21227" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lifetimePlayer" DROP CONSTRAINT "FK_3374e01ea8d6380a453a2f21227"`
    );
    await queryRunner.query(`DROP TABLE "lifetimePlayer"`);
  }
}
