import { UserActionTrackerEvent } from '@backbase/foundation-ang/observability';

// step 4: create a new class that extends UserActionTrackerEvent
export class AddToFavoritesTrackerEvent extends UserActionTrackerEvent<{
  payload: { accountId: string; accountName?: string };
}> {
  readonly name = 'add_to_favorites';
}

export class RemoveFromFavoritesTrackerEvent extends UserActionTrackerEvent<{
  payload: { accountId: string; accountName?: string };
}> {
  readonly name = 'remove_from_favorites';
}
