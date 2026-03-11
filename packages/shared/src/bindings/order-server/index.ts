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

import AddOrderItemReducer from "./add_order_item_reducer";
import CancelOrderReducer from "./cancel_order_reducer";
import CreateOrderReducer from "./create_order_reducer";
import UpdateOrderStatusReducer from "./update_order_status_reducer";

import OrderRow from "./order_table";
import OrderItemRow from "./order_item_table";

const tablesSchema = __schema({
  order: __table(
    {
      name: "order",
      indexes: [
        { accessor: "id", name: "id", algorithm: "btree", columns: ["id"] },
      ],
      constraints: [
        { name: "order_id_key", constraint: "unique", columns: ["id"] },
      ],
    },
    OrderRow,
  ),
  order_item: __table(
    {
      name: "order_item",
      indexes: [
        { accessor: "id", name: "id", algorithm: "btree", columns: ["id"] },
      ],
      constraints: [
        { name: "order_item_id_key", constraint: "unique", columns: ["id"] },
      ],
    },
    OrderItemRow,
  ),
});

const reducersSchema = __reducers(
  __reducerSchema("add_order_item", AddOrderItemReducer),
  __reducerSchema("cancel_order", CancelOrderReducer),
  __reducerSchema("create_order", CreateOrderReducer),
  __reducerSchema("update_order_status", UpdateOrderStatusReducer),
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
