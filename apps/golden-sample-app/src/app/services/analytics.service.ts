import {Injectable} from '@angular/core';
import {TrackerEvent, TrackerHandler} from '@backbase/foundation-ang/observability';
import {RUM_CONFIG} from "./datadog-rum.config";
import {datadogRum} from '@datadog/browser-rum'
import {v4 as uuidv4} from 'uuid';

/*
This service will receive all the analytics events from your application and from here you can
send all your tracker events to the analytics system (eg: google analytics/segment stc)
 */
@Injectable()
export class AnalyticsService extends TrackerHandler {

  config = RUM_CONFIG;
  rum_collector_url = "https://rum-collector.bartbase.com/api/v1/rum"
  // rum_collector_url = "http://localhost:7071/api/v1/rum"

  override init() {
    super.init();
    datadogRum.init({
      applicationId: this.config.applicationId,
      clientToken: this.config.clientToken,
      site: this.config.site,
      service: this.config.service,
      env: 'dev',
      version: '1.0.0',
      sessionSampleRate: 100,
      sessionReplaySampleRate: 100, // if not included, the default is 100
      trackResources: true,
      trackLongTasks: true,
      trackUserInteractions: true,
    })

  }

  register(): void {

    this.tracker.subscribeAll((event) => {
      console.log('EVENT TRACKER', event);
      console.log('EVENT TRACKER', JSON.stringify(event));
      datadogRum.addAction(event.name, event.payload)
      this.send_rum(event.name, event)
    });

  }

  send_rum(eventName: string, event: TrackerEvent): void {
    const UUID_KEY = 'bb_rum_id';
    const UUID_EXPIRATION_KEY = 'uuid_expiration';
    const UUID_EXPIRATION_TIME = 20 * 60 * 1000; // 20 minutes in milliseconds


    function storeUuid(uuid: string): void {
      const expirationTime = new Date().getTime() + UUID_EXPIRATION_TIME;
      localStorage.setItem(UUID_KEY, uuid);
      localStorage.setItem(UUID_EXPIRATION_KEY, expirationTime.toString());
    }

    function getUuid(): string | null {
      const uuid = localStorage.getItem(UUID_KEY);
      const uuidExpiration = localStorage.getItem(UUID_EXPIRATION_KEY);

      if (!uuid || !uuidExpiration) {
        return null;
      }

      const currentTimestamp = new Date().getTime();
      const expirationTimestamp = parseInt(uuidExpiration, 10);

      if (currentTimestamp > expirationTimestamp) {
        localStorage.removeItem(UUID_KEY);
        localStorage.removeItem(UUID_EXPIRATION_KEY);
        return null;
      }

      return uuid;
    }

    function getOrCreateUuid(): string {
      const existingUuid = getUuid();

      if (existingUuid) {
        return existingUuid;
      }

      const newUuid = uuidv4();
      storeUuid(newUuid);
      return newUuid;
    }


    const query_params: any = {
      "bb-source": "browser",
      "bb-api-key": "35e60bc1-7434-4b1b-bc33-1eb01a98e5c9",
      "bb-tags": JSON.stringify({
        "ssdk-version": "2023.3",
        "environment": "dev",
        "app-name": "Golden Sample App",
        "app-version": "0.0.0",
        "sample-rate": 100
      }),
      "bb-request-id": uuidv4()
    }
    const queryString = Object.keys(query_params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query_params[key])}`)
      .join('&');
    const rumEvent: any = {
      "_bb": {
        "version": 1
      },
      "id": uuidv4(),
      "name": eventName,
      "journey": event.journey,
      "application": "golden-sample-app",
      "service": "rum-tracker",
      "version": "0.0.0",
      "source": "browser",
      "environment": "dev",
      "session": {
        "type": "user",
        "id": getOrCreateUuid()
      },
      "date": Date.now(),
      "payload": event.payload
    }
    const url = this.rum_collector_url + "?" + queryString
    this.send_rum_data(url, JSON.stringify([rumEvent]))
  }


  send_rum_data(url: string, data: any): void {
    const request = new XMLHttpRequest()
    request.open('POST', url, true)
    request.send(data)
  }
}
