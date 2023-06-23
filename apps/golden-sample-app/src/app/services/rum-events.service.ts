import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  PayLoadScreenResize,
  PayLoadScreenView,
  PayLoadUserAction,
  RUMEvent,
  RUMEventResponse,
} from '../model/rum.model';
import { Observable } from 'rxjs';
import { v4 as uuidV4 } from 'uuid';
import { environment } from '../../environments/environment';
import {
  TrackerEvent,
  TrackerEventPayload,
} from '@backbase/foundation-ang/observability';

import packageInfo from 'package-json';

@Injectable({
  providedIn: 'root',
})
export class RumEventsService {
  readonly sessionId = `${uuidV4()}-${packageInfo.version}`;

  constructor(private httpClient: HttpClient) {}

  private prepareEvent(
    event: TrackerEvent<string, TrackerEventPayload>,
    eventType: RUMEvent['name']
  ): RUMEvent {
    return {
      bb: {
        version: 0,
      },
      id: uuidV4(),
      name: eventType,
      appVersion: packageInfo.version,
      env: environment.production ? 'prod' : 'dev',
      date: new Date().valueOf(),
      session: {
        type: 'USER',
        id: this.sessionId,
      },
      journey: event.journey,
      payload: this.determinePayload(event),
    };
  }

  private determinePayload(
    event: TrackerEvent<string, TrackerEventPayload>
  ): RUMEvent['payload'] {
    if (event.name === 'screen-view') {
      return this.screenViewEvent(event);
    }

    if (event.name === 'screen-resize') {
      return this.screenResizeEvent(event);
    }

    return this.userActionEvent(event);
  }

  private userActionEvent(
    event: TrackerEvent<string, TrackerEventPayload>
  ): PayLoadUserAction {
    return {
      type: 'user-action',
      name: event.name,
      additions: event.payload,
    };
  }

  private screenResizeEvent(
    event: TrackerEvent<string, TrackerEventPayload>
  ): PayLoadScreenResize {
    const payload = event.payload as TrackerEventPayload;
    return {
      type: 'screen-resize',
      width: payload['width'] as number,
      height: payload['height'] as number,
    };
  }

  private screenViewEvent(
    event: TrackerEvent<string, TrackerEventPayload>
  ): PayLoadScreenView {
    return {
      type: 'screen-view',
      title: event.name,
    };
  }

  sendRumEvent(
    event: TrackerEvent<string, TrackerEventPayload>,
    eventType: RUMEvent['name']
  ): Observable<RUMEventResponse> {
    return this.httpClient.post<RUMEventResponse>(
      `https://rum-collector.bartbase.com/api/v1/rum?bb-api-key=${
        environment.rumEventKey
      }&bb-request-id=${uuidV4()}-${packageInfo.name}`,
      [this.prepareEvent(event, eventType)]
    );
  }
}
