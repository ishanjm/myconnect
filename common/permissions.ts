import { SubscriptionType, SUBSCRIPTIONS } from "./auth.constants";

export type Permission = 'upload_document' | 'quiz_builder' | 'create_category' | 'take_quiz';

const PERMISSIONS_MAP: Record<SubscriptionType, Permission[]> = {
  [SUBSCRIPTIONS.TRIAL]: ['upload_document', 'quiz_builder', 'create_category'],
  [SUBSCRIPTIONS.SMALL]: ['upload_document', 'quiz_builder', 'create_category'],
  [SUBSCRIPTIONS.MEDIUM]: ['upload_document', 'quiz_builder', 'create_category'],
  [SUBSCRIPTIONS.LARGE]: ['upload_document', 'quiz_builder', 'create_category'],
  [SUBSCRIPTIONS.CUSTOM]: ['upload_document', 'quiz_builder', 'create_category'],
  [SUBSCRIPTIONS.STUDENT]: ['take_quiz'], // Restricted features, but can take quizzes
};

/**
 * Checks if a user with a given subscription type has a specific permission.
 * 
 * @param subscription - The user's subscription type
 * @param permission - The permission to check for
 * @returns boolean indicating if the permission is granted
 */
export const hasPermission = (subscription: SubscriptionType | undefined, permission: Permission): boolean => {
  if (!subscription) return false;
  return PERMISSIONS_MAP[subscription]?.includes(permission) ?? false;
};
