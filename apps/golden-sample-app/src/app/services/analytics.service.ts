import { Injectable } from '@angular/core';
import {
  ScreenResizeTrackerEvent,
  ScreenViewTrackerEvent,
  TrackerEvent,
  TrackerEventPayload,
  TrackerHandler,
  UserActionTrackerEvent,
} from '@backbase/foundation-ang/observability';

import openTelemetry, { Span } from '@opentelemetry/api';

/*
This service will receive all the analytics events from your application and from here you can
send all your tracker events to the analytics system (eg: google analytics/segment stc)
 */
@Injectable()
export class AnalyticsService extends TrackerHandler {
  private tracer = openTelemetry.trace.getTracer('backbase-tracker-handler');
  register(): void {
    this.tracker.subscribeAll((event) => {
      console.log('EVENT TRACKER', event);
      const activeSpan = openTelemetry.trace.getActiveSpan();
      if (activeSpan) {
        this.sendEvent(event, activeSpan);
      } else if (this.tracer) {
        this.tracer.startActiveSpan('backbase-tracker-handler', (span) => {
          this.sendEvent(event, span);
          span.end();
        });
      }
    });
  }

  private sendEvent(
    event: TrackerEvent<string, TrackerEventPayload>,
    activeSpan: Span
  ) {
    const payload = event.payload as TrackerEventPayload;
    let name = payload['name'] as string;
    let attributes = {} as any;
    if (event instanceof ScreenViewTrackerEvent) {
      name = 'screen-view';
      attributes['name'] = payload['name'];
      attributes['title'] = payload['title'];
      attributes['url'] = payload['url'];
    } else if (event instanceof ScreenResizeTrackerEvent) {
      name = 'screen-resize';
      attributes['width'] = payload['width'];
      attributes['height'] = payload['height'];
    } else if (event instanceof UserActionTrackerEvent) {
      name = 'user-action';
      attributes = payload;
    }
    console.log('Adding Event to Active Span', activeSpan, name, attributes);
    activeSpan.addEvent(name, attributes);
  }
}
