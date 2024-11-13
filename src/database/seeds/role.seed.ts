import { DataSource } from 'typeorm';
import { Role } from '../../modules/roles/entities/role.entity';

export default class RoleSeeder {
  public async run(_: unknown, connection: DataSource): Promise<void> {
    const entities = [Role];

    // for (const singleEntity of entities) {
    //   const repository = connection.getRepository(singleEntity);
    //   repository.query(`TRUNCATE TABLE "${repository.metadata.tableName}" CASCADE;`);
    // }

    await connection
      .createQueryBuilder()
      .insert()
      .into(Role)
      .values([
        {
          id: 'f8a5c9d4-5f5d-4c1b-8b3b-1f3c9a9b0b0e',
          name: 'Admin',
          slug: 'admin',
          description: 'Admin role',
        },
        {
          id: 'f8a5c9d4-5f5d-4c1b-8b3b-1f3c9a9b0b0f',
          name: 'User',
          slug: 'user',
          description: 'User role',
        },
      ])
      .execute();
  }
}
