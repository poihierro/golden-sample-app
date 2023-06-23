export interface PayLoadScreenView {
  type: 'screen-view';
  url?: string;
  title: string;
  additions?: any; // any additional data
}

export interface PayLoadScreenResize {
  type: 'screen-resize';
  width: number;
  height: number;
}

export interface PayLoadResource {
  type: 'resource';
  id?: string;
  url?: string;
  duration?: number;
  size?: number;
  method?: string;
  statusCode?: number;
}

export interface PayLoadUserAction {
  type: 'user-action';
  name: string;
  value?: string | number | boolean;
  additions?: any;
}

// https://rum-collector.bartbase.com/api/v1/rum/docs/rum-collector-client-api-v0.0.1.html#operation/collectRUM
export interface RUMEvent {
  bb?: {
    version: number;
  };
  id: string;
  name?: 'action' | 'view' | 'resize' | 'resource'; // this is going to be removed
  journey?: string;
  appVersion: string;
  env?: string | 'dev' | 'test' | 'prod';
  date?: number;
  payload:
    | PayLoadResource
    | PayLoadScreenResize
    | PayLoadScreenView
    | PayLoadUserAction;
  session: {
    type: 'USER';
    id: string;
  };
}

export interface RUMEventResponse {
  requestId: string;
}
