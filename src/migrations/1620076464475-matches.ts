import {MigrationInterface, QueryRunner} from "typeorm";

export class matches1620076464475 implements MigrationInterface {
    name = 'matches1620076464475'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trophies" DROP CONSTRAINT "FK_4c76f29c8a79cd2cdff44dd46a3"`);
        await queryRunner.query(`ALTER TABLE "trophies" DROP CONSTRAINT "FK_42437e074eca201fd39ad7af92b"`);
        await queryRunner.query(`ALTER TABLE "matchDataPlayer" DROP CONSTRAINT "FK_a908f930159cdc98341345fe931"`);
        await queryRunner.query(`ALTER TABLE "matchDataPlayer" DROP CONSTRAINT "FK_c121674b95f88a71a0afefd001c"`);
        await queryRunner.query(`ALTER TABLE "matchDataTeam" DROP CONSTRAINT "FK_4a975b53026890878602d08fa33"`);
        await queryRunner.query(`DROP INDEX "IDX_f042f82604e753f46e5722f633"`);
        await queryRunner.query(`CREATE INDEX "IDX_1b597c8eb2fadb72240d576fd0" ON "players" ("name") `);
        await queryRunner.query(`ALTER TABLE "trophies" ADD CONSTRAINT "FK_47d5752640563587f2396c9365f" FOREIGN KEY ("matchId") REFERENCES "matchData"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "trophies" ADD CONSTRAINT "FK_c175722051cd917913a5cc29c4a" FOREIGN KEY ("name") REFERENCES "players"("name") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "matchDataPlayer" ADD CONSTRAINT "FK_221711b7674ce56621c0fff23bd" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "matchDataPlayer" ADD CONSTRAINT "FK_10df15d3cbac687d4dd7199852a" FOREIGN KEY ("teamId") REFERENCES "matchDataTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "matchDataTeam" ADD CONSTRAINT "FK_24a7a94813d7a4d857e3d6940a2" FOREIGN KEY ("matchId") REFERENCES "matchData"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "matchDataTeam" DROP CONSTRAINT "FK_24a7a94813d7a4d857e3d6940a2"`);
        await queryRunner.query(`ALTER TABLE "matchDataPlayer" DROP CONSTRAINT "FK_10df15d3cbac687d4dd7199852a"`);
        await queryRunner.query(`ALTER TABLE "matchDataPlayer" DROP CONSTRAINT "FK_221711b7674ce56621c0fff23bd"`);
        await queryRunner.query(`ALTER TABLE "trophies" DROP CONSTRAINT "FK_c175722051cd917913a5cc29c4a"`);
        await queryRunner.query(`ALTER TABLE "trophies" DROP CONSTRAINT "FK_47d5752640563587f2396c9365f"`);
        await queryRunner.query(`DROP INDEX "IDX_1b597c8eb2fadb72240d576fd0"`);
        await queryRunner.query(`CREATE INDEX "IDX_f042f82604e753f46e5722f633" ON "players" ("name") `);
        await queryRunner.query(`ALTER TABLE "matchDataTeam" ADD CONSTRAINT "FK_4a975b53026890878602d08fa33" FOREIGN KEY ("matchId") REFERENCES "matchData"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "matchDataPlayer" ADD CONSTRAINT "FK_c121674b95f88a71a0afefd001c" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "matchDataPlayer" ADD CONSTRAINT "FK_a908f930159cdc98341345fe931" FOREIGN KEY ("teamId") REFERENCES "matchDataTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "trophies" ADD CONSTRAINT "FK_42437e074eca201fd39ad7af92b" FOREIGN KEY ("name") REFERENCES "players"("name") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "trophies" ADD CONSTRAINT "FK_4c76f29c8a79cd2cdff44dd46a3" FOREIGN KEY ("matchId") REFERENCES "matchData"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
