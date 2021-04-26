import { Horizon } from "./../horizon_api";
import { OfferAsset } from "./assets";

// Reference: GO SDK https://github.com/stellar/go/blob/ec5600bd6b2b6900d26988ff670b9ca7992313b8/services/horizon/internal/resourceadapter/effects.go
export enum EffectType {
  // account effects
  account_created = 0,
  account_removed = 1,
  account_credited = 2,
  account_debited = 3,
  account_thresholds_updated = 4,
  account_home_domain_updated = 5,
  account_flags_updated = 6,
  account_inflation_destination_updated = 7,
  // signer effects
  signer_created = 10,
  signer_removed = 11,
  signer_updated = 12,
  // trustline effects
  trustline_created = 20,
  trustline_removed = 21,
  trustline_updated = 22,
  trustline_authorized = 23,
  trustline_deauthorized = 24,
  trustline_authorized_to_maintain_liabilities = 25, // deprecated, use trustline_flags_updated
  trustline_flags_updated = 26,
  // trading effects
  offer_created = 30,
  offer_removed = 31,
  offer_updated = 32,
  trade = 33,
  // data effects
  data_created = 40,
  data_removed = 41,
  data_updated = 42,
  sequence_bumped = 43,
  // claimable balance effects
  claimable_balance_created = 50,
  claimable_balance_claimant_created = 51,
  claimable_balance_claimed = 52,
  // sponsorship effects
  account_sponsorship_created = 60,
  account_sponsorship_updated = 61,
  account_sponsorship_removed = 62,
  trustline_sponsorship_created = 63,
  trustline_sponsorship_updated = 64,
  trustline_sponsorship_removed = 65,
  data_sponsorship_created = 66,
  data_sponsorship_updated = 67,
  data_sponsorship_removed = 68,
  claimable_balance_sponsorship_created = 69,
  claimable_balance_sponsorship_updated = 70,
  claimable_balance_sponsorship_removed = 71,
  signer_sponsorship_created = 72,
  signer_sponsorship_updated = 73,
  signer_sponsorship_removed = 74,
  claimable_balance_clawed_back = 80,
}
export interface BaseEffectRecord extends Horizon.BaseResponse {
  id: string;
  account: string;
  paging_token: string;
  type_i: EffectType;
  type: string;
  created_at: string;
}
export interface AccountCreated extends BaseEffectRecord {
  type_i: EffectType.account_created;
  starting_balance: string;
}
export interface AccountCredited extends BaseEffectRecord, OfferAsset {
  type_i: EffectType.account_credited;
  amount: string;
}
export interface AccountDebited extends BaseEffectRecord {
  type_i: EffectType.account_debited;
  amount: string;
}
export interface AccountThresholdsUpdated extends BaseEffectRecord {
  type_i: EffectType.account_thresholds_updated;
  low_threshold: number;
  med_threshold: number;
  high_threshold: number;
}
export interface AccountHomeDomainUpdated extends BaseEffectRecord {
  type_i: EffectType.account_home_domain_updated;
  home_domain: string;
}
export interface AccountFlagsUpdated extends BaseEffectRecord {
  type_i: EffectType.account_flags_updated;
  auth_required_flag: boolean;
  auth_revokable_flag: boolean;
}
interface DataEvents extends BaseEffectRecord {
  name: boolean;
  value: boolean;
}
export interface DataCreated extends DataEvents {
  type_i: EffectType.data_created;
}
export interface DataUpdated extends DataEvents {
  type_i: EffectType.data_updated;
}
export interface DataRemoved extends DataEvents {
  type_i: EffectType.data_removed;
}
export interface SequenceBumped extends BaseEffectRecord {
  type_i: EffectType.sequence_bumped;
  new_seq: number | string;
}
interface SignerEvents extends BaseEffectRecord {
  weight: number;
  key: string;
  public_key: string;
}
export interface SignerCreated extends SignerEvents {
  type_i: EffectType.signer_created;
}
export interface SignerRemoved extends SignerEvents {
  type_i: EffectType.signer_removed;
}
export interface SignerUpdated extends SignerEvents {
  type_i: EffectType.signer_updated;
}
interface TrustlineEvents extends BaseEffectRecord, OfferAsset {
  limit: string;
}
export interface TrustlineCreated extends TrustlineEvents {
  type_i: EffectType.trustline_created;
}
export interface TrustlineRemoved extends TrustlineEvents {
  type_i: EffectType.trustline_removed;
}
export interface TrustlineUpdated extends TrustlineEvents {
  type_i: EffectType.trustline_updated;
}
export interface TrustlineAuthorized extends BaseEffectRecord {
  type_i: EffectType.trustline_authorized;
  asset_type: OfferAsset["asset_type"];
  asset_code: OfferAsset["asset_code"];
  trustor: string;
}
export interface TrustlineDeautorized
  extends Omit<TrustlineAuthorized, "type_i"> {
  type_i: EffectType.trustline_deauthorized;
}
export interface TrustlineAutorizedToMaintainLiabilities
  extends Omit<TrustlineAuthorized, "type_i"> {
  type_i: EffectType.trustline_authorized_to_maintain_liabilities;
}
export interface ClaimableBalanceCreated extends BaseEffectRecord {
  type_i: EffectType.claimable_balance_created;
  amount: string;
  balance_type_i: string;
  asset: string;
}
export interface ClaimableBalanceClaimed
  extends Omit<ClaimableBalanceCreated, "type_i"> {
  type_i: EffectType.claimable_balance_claimed;
}

export interface ClaimableBalanceClaimantCreated
  extends Omit<ClaimableBalanceCreated, "type_i"> {
  type_i: EffectType.claimable_balance_claimant_created;
}
interface SponsershipFields {
  sponsor: string;
  new_sponsor: string;
  former_sponsor: string;
}
interface AccountSponsorshipEvents
  extends BaseEffectRecord,
    SponsershipFields {}

export type AccountSponsorshipCreated = Omit<
  AccountSponsorshipEvents,
  "new_sponsor" | "former_sponsor"
> & { type_i: EffectType.account_sponsorship_created };
export type AccountSponsorshipUpdated = Omit<
  AccountSponsorshipEvents,
  "sponsor"
> & { type_i: EffectType.account_sponsorship_updated };
export type AccountSponsorshipRemoved = Omit<
  AccountSponsorshipEvents,
  "new_sponsor" | "sponsor"
> & { type_i: EffectType.account_sponsorship_removed };
interface TrustlineSponsorshipEvents
  extends BaseEffectRecord,
    SponsershipFields {
  asset: string;
}
export type TrustlineSponsorshipCreated = Omit<
  TrustlineSponsorshipEvents,
  "new_sponsor" | "former_sponsor"
> & { type_i: EffectType.trustline_sponsorship_created };
export type TrustlineSponsorshipUpdated = Omit<
  TrustlineSponsorshipEvents,
  "sponsor"
> & { type_i: EffectType.trustline_sponsorship_updated };
export type TrustlineSponsorshipRemoved = Omit<
  TrustlineSponsorshipEvents,
  "new_sponsor" | "sponsor"
> & { type_i: EffectType.trustline_sponsorship_removed };
interface DataSponsorshipEvents extends BaseEffectRecord, SponsershipFields {
  data_name: string;
}
export type DateSponsorshipCreated = Omit<
  DataSponsorshipEvents,
  "new_sponsor" | "former_sponsor"
> & { type_i: EffectType.data_sponsorship_created };
export type DateSponsorshipUpdated = Omit<DataSponsorshipEvents, "sponsor"> & {
  type_i: EffectType.data_sponsorship_updated;
};
export type DateSponsorshipRemoved = Omit<
  DataSponsorshipEvents,
  "new_sponsor" | "sponsor"
> & { type_i: EffectType.data_sponsorship_removed };
interface ClaimableBalanceSponsorshipEvents
  extends BaseEffectRecord,
    SponsershipFields {
  balance_type_i: string;
}

export type ClaimableBalanceSponsorshipCreated = Omit<
  ClaimableBalanceSponsorshipEvents,
  "new_sponsor" | "former_sponsor"
> & { type_i: EffectType.claimable_balance_sponsorship_created };
export type ClaimableBalanceSponsorshipUpdated = Omit<
  ClaimableBalanceSponsorshipEvents,
  "sponsor"
> & { type_i: EffectType.claimable_balance_sponsorship_updated };
export type ClaimableBalanceSponsorshipRemoved = Omit<
  ClaimableBalanceSponsorshipEvents,
  "new_sponsor" | "sponsor"
> & { type_i: EffectType.claimable_balance_sponsorship_removed };
interface SignerSponsorshipEvents extends BaseEffectRecord, SponsershipFields {
  signer: string;
}

export type SignerSponsorshipCreated = Omit<
  SignerSponsorshipEvents,
  "new_sponsor" | "former_sponsor"
> & { type_i: EffectType.signer_sponsorship_created };
export type SignerSponsorshipUpdated = Omit<
  SignerSponsorshipEvents,
  "sponsor"
> & { type_i: EffectType.signer_sponsorship_updated };
export type SignerSponsorshipRemoved = Omit<
  SignerSponsorshipEvents,
  "new_sponsor" | "sponsor"
> & { type_i: EffectType.signer_sponsorship_removed };
