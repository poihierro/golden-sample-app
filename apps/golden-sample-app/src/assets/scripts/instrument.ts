import { registerInstrumentations } from '@opentelemetry/instrumentation';
import {
  WebTracerProvider,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
  BatchSpanProcessor,
} from '@opentelemetry/sdk-trace-web';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { ZoneContextManager } from '@opentelemetry/context-zone';

export function instrumentOtel(
  apiKey: string,
  url: string,
  isProduction = false
) {
  const provider = new WebTracerProvider();

  const SpanProcessor = isProduction ? BatchSpanProcessor : SimpleSpanProcessor;

  // For demo purposes only, immediately log traces to the console
  provider.addSpanProcessor(new SpanProcessor(new ConsoleSpanExporter()));

  // Batch traces before sending them to backend server
  provider.addSpanProcessor(
    new BatchSpanProcessor(
      new OTLPTraceExporter({
        timeoutMillis: 1000,
        url,
        headers: {
          'BB-App-Key': apiKey,
        },
      })
    )
  );

  provider.register({ contextManager: new ZoneContextManager() });

  registerInstrumentations({
    instrumentations: [
      getWebAutoInstrumentations({
        '@opentelemetry/instrumentation-document-load': {},
        '@opentelemetry/instrumentation-user-interaction': {},
        '@opentelemetry/instrumentation-fetch': {},
        '@opentelemetry/instrumentation-xml-http-request': {},
      }),
    ],
  });
}
