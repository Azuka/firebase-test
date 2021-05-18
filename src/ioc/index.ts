import { IocContainer } from '@tsoa/runtime';
import { container } from 'tsyringe';
import * as admin from 'firebase-admin';
import { firestore } from 'firebase-admin/lib/firestore';
import Database = firestore.Firestore;

export { Database };
container.register<Database>('Database', {
  useFactory: (_) => admin.firestore(),
});

export const iocContainer: IocContainer = {
  get: <T>(controller: { prototype: T }): T => {
    return container.resolve<T>(controller as never);
  },
};
