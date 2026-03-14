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

import AddCategoryReducer from "./add_category_reducer";
import AddProductReducer from "./add_product_reducer";
import DeleteCategoryReducer from "./delete_category_reducer";
import DeleteProductReducer from "./delete_product_reducer";
import UpdateCategoryReducer from "./update_category_reducer";
import UpdateProductReducer from "./update_product_reducer";
import UpdateProductStockReducer from "./update_product_stock_reducer";

import CategoryRow from "./category_table";
import ProductRow from "./product_table";

const tablesSchema = __schema({
  category: __table(
    {
      name: "category",
      indexes: [
        { accessor: "id", name: "id", algorithm: "btree", columns: ["id"] },
      ],
      constraints: [
        { name: "category_id_key", constraint: "unique", columns: ["id"] },
      ],
    },
    CategoryRow,
  ),
  product: __table(
    {
      name: "product",
      indexes: [
        { accessor: "id", name: "id", algorithm: "btree", columns: ["id"] },
      ],
      constraints: [
        { name: "product_id_key", constraint: "unique", columns: ["id"] },
      ],
    },
    ProductRow,
  ),
});

const reducersSchema = __reducers(
  __reducerSchema("add_category", AddCategoryReducer),
  __reducerSchema("add_product", AddProductReducer),
  __reducerSchema("delete_category", DeleteCategoryReducer),
  __reducerSchema("delete_product", DeleteProductReducer),
  __reducerSchema("update_category", UpdateCategoryReducer),
  __reducerSchema("update_product", UpdateProductReducer),
  __reducerSchema("update_product_stock", UpdateProductStockReducer),
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
> { }

export class DbConnectionBuilder extends __DbConnectionBuilder<DbConnection> { }

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
