export interface RumConfig {
    applicationId: string;
    clientToken: string;
    site: string;
    service: string;
    sampleRate: number;
    trackInteractions: boolean;
    defaultPrivacyLevel: string;
}
