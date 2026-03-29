export const SUBSCRIPTION_OPTIONS = [
  { label: 'Trial', value: 'trial' },
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
  { label: 'Custom', value: 'custom' },
] as const;

export type SubscriptionType = typeof SUBSCRIPTION_OPTIONS[number]['value'];
