import {
    MigrationInterface,
    QueryRunner,
    TableColumn,
    TableForeignKey,
} from 'typeorm';

export class CreateSenderTransaction1685820307655 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('statements', new TableColumn({
            name: 'sender_id',
            type: 'uuid',
            isNullable: true
        }))

        const foreignKey = new TableForeignKey({
            name: 'senders',
            columnNames: ["sender_id"],
            referencedTableName: 'users',
            referencedColumnNames: ["id"],
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        });

        await queryRunner.createForeignKey("statements", foreignKey);
        await queryRunner.query(`ALTER TYPE statements_type_enum ADD VALUE 'transfer' AFTER 'withdraw'`)

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('statements', 'senders')
        await queryRunner.dropColumn('statements', 'sender_id')
    }

}
