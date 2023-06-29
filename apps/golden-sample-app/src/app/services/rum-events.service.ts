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
  ScreenResizeTrackerEvent,
  ScreenViewTrackerEvent,
  TrackerEvent,
  TrackerEventPayload,
} from '@backbase/foundation-ang/observability';
import packageInfo from 'package-json';
@Injectable({
  providedIn: 'root',
})
export class RumEventsService {
  readonly sessionId = `${uuidV4()}`;
  readonly app_version = packageInfo.version;
  readonly app_name = packageInfo.name;
  readonly app_env = environment.production ? 'prod' : 'dev';
  constructor(private httpClient: HttpClient) {}

  private prepareEvent(
    event: TrackerEvent<string, TrackerEventPayload>
  ): RUMEvent {
    return {
      id: uuidV4(),
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
    const payload = event.payload as TrackerEventPayload;
    if (event instanceof ScreenViewTrackerEvent) {
      return this.screenViewEvent(payload);
    }
    if (event instanceof ScreenResizeTrackerEvent) {
      return this.screenResizeEvent(payload);
    }
    return this.userActionEvent(payload);
  }
  private userActionEvent(payload: TrackerEventPayload): PayLoadUserAction {
    return {
      type: 'user-action',
      name: payload['name'] as string,
      additions: payload,
    };
  }
  private screenResizeEvent(payload: TrackerEventPayload): PayLoadScreenResize {
    return {
      type: 'screen-resize',
      width: payload['width'] as number,
      height: payload['height'] as number,
    };
  }
  private screenViewEvent(payload: TrackerEventPayload): PayLoadScreenView {
    return {
      type: 'screen-view',
      title: payload['title'] as string,
      url: payload['url'] as string,
    };
  }
  sendRumEvent(
    event: TrackerEvent<string, TrackerEventPayload>
  ): Observable<RUMEventResponse> {
    return this.httpClient.post<RUMEventResponse>(
      `https://rum-collector.bartbase.com/api/v1/rum?bb-api-key=${
        environment.rumEventKey
      }&bb-request-id=${uuidV4()}&bb-app-name=${this.app_name}&bb-app-version=${
        this.app_version
      }&bb-app-env=${this.app_env}`,
      [this.prepareEvent(event)]
    );
  }
}
