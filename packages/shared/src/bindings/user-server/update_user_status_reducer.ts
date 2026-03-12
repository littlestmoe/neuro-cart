import {
  TypeBuilder as __TypeBuilder,
  t as __t,
  type AlgebraicTypeType as __AlgebraicTypeType,
  type Infer as __Infer,
} from "spacetimedb";

import { AccountStatus } from "./types";

export default {
  id: __t.string(),
  get status() {
    return AccountStatus;
  },
};
