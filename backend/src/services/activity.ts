import { supabase } from './supabase';

export type ActionType = 'upload_document' | 'create_subject' | 'update_subject' | 'delete_subject' | 'chat_query';

/**
 * Log user activity to the database
 */
export async function logActivity(
  userId: string,
  actionType: ActionType,
  entityId?: string,
  metadata: Record<string, any> = {}
) {
  try {
    const { error } = await supabase
      .from('activity_logs')
      .insert({
        user_id: userId,
        action_type: actionType,
        entity_id: entityId,
        metadata
      });

    if (error) {
      console.error('❌ Failed to log activity:', error.message);
    }
  } catch (error) {
    console.error('❌ Error logging activity:', error);
  }
}
