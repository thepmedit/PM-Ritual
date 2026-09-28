// Membership through RevenueCat. If no API key is set yet (before Apple is
// set up), the app still runs: members-only content simply stays locked.
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import Purchases, { CustomerInfo, PurchasesPackage } from 'react-native-purchases';

const extra: any = Constants.expoConfig?.extra || {};
const ENTITLEMENT = extra.entitlementId || 'member';
const apiKey: string = Platform.OS === 'ios' ? extra.revenueCatIosKey : extra.revenueCatAndroidKey;

let configured = false;
let listeners: ((m: boolean) => void)[] = [];
let lastMember = false;

export const purchasesReady = () => configured;

function emit(info?: CustomerInfo | null) {
  lastMember = !!info?.entitlements?.active?.[ENTITLEMENT];
  listeners.forEach((l) => l(lastMember));
}

export function initPurchases() {
  if (configured || !apiKey) return;
  try {
    Purchases.configure({ apiKey });
    configured = true;
    Purchases.addCustomerInfoUpdateListener((info) => emit(info));
    Purchases.getCustomerInfo().then(emit).catch(() => {});
  } catch {
    configured = false;
  }
}

export function onMembershipChange(fn: (m: boolean) => void) {
  listeners.push(fn);
  fn(lastMember);
  return () => {
    listeners = listeners.filter((l) => l !== fn);
  };
}

export type Plan = { id: 'year' | 'month'; pkg: PurchasesPackage; price: string };

export async function getPlans(): Promise<Plan[]> {
  if (!configured) return [];
  try {
    const o = await Purchases.getOfferings();
    const cur = o.current;
    if (!cur) return [];
    const plans: Plan[] = [];
    if (cur.annual) plans.push({ id: 'year', pkg: cur.annual, price: cur.annual.product.priceString });
    if (cur.monthly) plans.push({ id: 'month', pkg: cur.monthly, price: cur.monthly.product.priceString });
    return plans;
  } catch {
    return [];
  }
}

export type BuyResult = 'ok' | 'cancelled' | 'failed';

export async function buy(pkg: PurchasesPackage): Promise<BuyResult> {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    emit(customerInfo);
    return customerInfo.entitlements.active[ENTITLEMENT] ? 'ok' : 'failed';
  } catch (e: any) {
    return e?.userCancelled ? 'cancelled' : 'failed';
  }
}

export async function restore(): Promise<boolean> {
  if (!configured) return false;
  try {
    const info = await Purchases.restorePurchases();
    emit(info);
    return !!info.entitlements.active[ENTITLEMENT];
  } catch {
    return false;
  }
}

// Opens Apple's own sheet for redeeming the Edition 01 Offer Codes.
export function redeemCode(): boolean {
  if (!configured || Platform.OS !== 'ios') return false;
  try {
    Purchases.presentCodeRedemptionSheet();
    return true;
  } catch {
    return false;
  }
}
