export const SUBSCRIPTIONS = {
  TRIAL: 'trial',
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  CUSTOM: 'custom',
  STUDENT: 'student',
} as const;

export type SubscriptionType = (typeof SUBSCRIPTIONS)[keyof typeof SUBSCRIPTIONS];

export const SUBSCRIPTION_VALUES = Object.values(SUBSCRIPTIONS);

export const SUBSCRIPTION_OPTIONS = [
  { label: 'Trial', value: SUBSCRIPTIONS.TRIAL },
  { label: 'Small', value: SUBSCRIPTIONS.SMALL },
  { label: 'Medium', value: SUBSCRIPTIONS.MEDIUM },
  { label: 'Large', value: SUBSCRIPTIONS.LARGE },
  { label: 'Custom', value: SUBSCRIPTIONS.CUSTOM },
  { label: 'Student', value: SUBSCRIPTIONS.STUDENT },
] as const;
