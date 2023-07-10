import { MigrationInterface, QueryRunner } from 'typeorm';
import userService from "../../../services/typeorm/data.service";


export class SeedUsers1590519635401 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        let user = {
            name: '',
            description: ''
        };

        user.name = 'Walter White';
        user.description = 'This is the 1st user';
        // @ts-ignore
        await userService.createOne(user);

        user.name = 'Brightney James';
        user.description = 'This is the 2nd user';
        // @ts-ignore
        await userService.createOne(user);

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        console.log('Not implemented');
    }
}