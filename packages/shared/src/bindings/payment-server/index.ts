import {
  DbConnectionBuilder as __DbConnectionBuilder,
  DbConnectionImpl as __DbConnectionImpl,
  SubscriptionBuilderImpl as __SubscriptionBuilderImpl,
  TypeBuilder as __TypeBuilder,
  Uuid as __Uuid,
  convertToAccessorMap as __convertToAccessorMap,
  makeQueryBuilder as __makeQueryBuilder,
  procedureSchema as __procedureSchema,
  procedures as __procedures,
  reducerSchema as __reducerSchema,
  reducers as __reducers,
  schema as __schema,
  t as __t,
  table as __table,
  type AlgebraicTypeType as __AlgebraicTypeType,
  type DbConnectionConfig as __DbConnectionConfig,
  type ErrorContextInterface as __ErrorContextInterface,
  type Event as __Event,
  type EventContextInterface as __EventContextInterface,
  type Infer as __Infer,
  type QueryBuilder as __QueryBuilder,
  type ReducerEventContextInterface as __ReducerEventContextInterface,
  type RemoteModule as __RemoteModule,
  type SubscriptionEventContextInterface as __SubscriptionEventContextInterface,
  type SubscriptionHandleImpl as __SubscriptionHandleImpl,
} from "spacetimedb";

import CreatePaymentReducer from "./create_payment_reducer";
import UpdatePaymentStatusReducer from "./update_payment_status_reducer";

import PaymentRow from "./payment_table";

const tablesSchema = __schema({
  payment: __table(
    {
      name: "payment",
      indexes: [
        { accessor: "id", name: "id", algorithm: "btree", columns: ["id"] },
      ],
      constraints: [
        { name: "payment_id_key", constraint: "unique", columns: ["id"] },
      ],
    },
    PaymentRow,
  ),
});

const reducersSchema = __reducers(
  __reducerSchema("create_payment", CreatePaymentReducer),
  __reducerSchema("update_payment_status", UpdatePaymentStatusReducer),
);

const proceduresSchema = __procedures();

const REMOTE_MODULE = {
  versionInfo: {
    cliVersion: "2.0.3" as const,
  },
  tables: tablesSchema.schemaType.tables,
  reducers: reducersSchema.reducersType.reducers,
  ...proceduresSchema,
} satisfies __RemoteModule<
  typeof tablesSchema.schemaType,
  typeof reducersSchema.reducersType,
  typeof proceduresSchema
>;

export const tables: __QueryBuilder<typeof tablesSchema.schemaType> =
  __makeQueryBuilder(tablesSchema.schemaType);

export const reducers = __convertToAccessorMap(
  reducersSchema.reducersType.reducers,
);

export type EventContext = __EventContextInterface<typeof REMOTE_MODULE>;

export type ReducerEventContext = __ReducerEventContextInterface<
  typeof REMOTE_MODULE
>;

export type SubscriptionEventContext = __SubscriptionEventContextInterface<
  typeof REMOTE_MODULE
>;

export type ErrorContext = __ErrorContextInterface<typeof REMOTE_MODULE>;

export type SubscriptionHandle = __SubscriptionHandleImpl<typeof REMOTE_MODULE>;

export class SubscriptionBuilder extends __SubscriptionBuilderImpl<
  typeof REMOTE_MODULE
> {}

export class DbConnectionBuilder extends __DbConnectionBuilder<DbConnection> {}

export class DbConnection extends __DbConnectionImpl<typeof REMOTE_MODULE> {
  static builder = (): DbConnectionBuilder => {
    return new DbConnectionBuilder(
      REMOTE_MODULE,
      (config: __DbConnectionConfig<typeof REMOTE_MODULE>) =>
        new DbConnection(config),
    );
  };

  override subscriptionBuilder = (): SubscriptionBuilder => {
    return new SubscriptionBuilder(this);
  };
}
