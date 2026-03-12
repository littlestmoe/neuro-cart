import { type Infer as __Infer } from "spacetimedb";

import AddReviewReducer from "../add_review_reducer";
import DeleteReviewReducer from "../delete_review_reducer";
import MarkReviewHelpfulReducer from "../mark_review_helpful_reducer";
import UpdateReviewReducer from "../update_review_reducer";

export type AddReviewParams = __Infer<typeof AddReviewReducer>;
export type DeleteReviewParams = __Infer<typeof DeleteReviewReducer>;
export type MarkReviewHelpfulParams = __Infer<typeof MarkReviewHelpfulReducer>;
export type UpdateReviewParams = __Infer<typeof UpdateReviewReducer>;
