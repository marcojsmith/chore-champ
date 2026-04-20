/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as choreOccurrences from "../choreOccurrences.js";
import type * as chores from "../chores.js";
import type * as crons from "../crons.js";
import type * as dashboard from "../dashboard.js";
import type * as households from "../households.js";
import type * as invites from "../invites.js";
import type * as lib from "../lib.js";
import type * as notifications from "../notifications.js";
import type * as requestedRewards from "../requestedRewards.js";
import type * as rewardRedemptions from "../rewardRedemptions.js";
import type * as rewards from "../rewards.js";
import type * as tokenLedger from "../tokenLedger.js";
import type * as users from "../users.js";
import type * as voice from "../voice.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  choreOccurrences: typeof choreOccurrences;
  chores: typeof chores;
  crons: typeof crons;
  dashboard: typeof dashboard;
  households: typeof households;
  invites: typeof invites;
  lib: typeof lib;
  notifications: typeof notifications;
  requestedRewards: typeof requestedRewards;
  rewardRedemptions: typeof rewardRedemptions;
  rewards: typeof rewards;
  tokenLedger: typeof tokenLedger;
  users: typeof users;
  voice: typeof voice;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
