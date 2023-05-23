import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateApiKeyTable1679632259183 implements MigrationInterface {
    name = 'CreateApiKeyrTable1679632259183'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "api_keys" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "user_id" integer NOT NULL, "api_key" varchar(255) NOT NULL, "api_secret" varchar(255) NOT NULL, "api_name" varchar(255) NOT NULL, "is_revoked" boolean, "scopes" text, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime DEFAULT (datetime('now')), "deleted_at" datetime, "expired_at" datetime, CONSTRAINT "UQ_9ccce5863aec84d045d778179de" UNIQUE ("api_key"), CONSTRAINT "UQ_eb116fe1e3bd2e9ab954a0c2486" UNIQUE ("api_secret"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "api_keys"`);
    }

}
