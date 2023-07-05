import {Injectable, inject} from '@angular/core';
import {
  TrackerEvent,
  TrackerEventPayload,
  TrackerHandler,
} from '@backbase/foundation-ang/observability';
import {RumEventsService} from './rum-events.service';

/*
This service will receive all the analytics events from your application and from here you can
send all your tracker events to the analytics system (eg: google analytics/segment stc)
 */
@Injectable()
export class AnalyticsService extends TrackerHandler {
  private rumEventsService: RumEventsService = inject(RumEventsService);

  register(): void {
    this.tracker.subscribeAll((event) => {
      this.sendRumEvent(event);
    });
  }

  sendRumEvent(event: TrackerEvent<string, TrackerEventPayload>): void {
    console.log('EVENT TRACKER', event);

    this.rumEventsService.sendRumEvent(event).subscribe((response) => {
      console.log('Rum response', response);
    });
  }
}
