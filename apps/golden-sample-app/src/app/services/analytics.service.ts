import { Injectable } from '@angular/core';
import { TrackerHandler } from '@backbase/foundation-ang/observability';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const gtag: any;

/* 
This service will receive all the analytics events from your application and from here you can
send all your tracker events to the analytics system (eg: google analytics/segment stc)
 */
@Injectable()
export class AnalyticsService extends TrackerHandler {
  register(): void {
    this.tracker.subscribeAll((event) => {
      console.log('EVENT TRACKER', event);

      gtag('event', event.name, {
        event_category: event.type,
        event_label: event.name,
        value: JSON.stringify(event.payload),
      });
    });

    // this.tracker.subscribe(ScreenResizeEvent, event => {
    //   console.log(event);
    // });
  }
}
