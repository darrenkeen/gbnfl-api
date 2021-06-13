import {MigrationInterface, QueryRunner} from "typeorm";

export class addPlayerToUser1623606888067 implements MigrationInterface {
    name = 'addPlayerToUser1623606888067'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "playerId" character varying(10)`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_08df5d6d77f6191e53715afa910" UNIQUE ("playerId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_08df5d6d77f6191e53715afa910" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_08df5d6d77f6191e53715afa910"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_08df5d6d77f6191e53715afa910"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "playerId"`);
    }

}
