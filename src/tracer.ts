// Currently doesn't work. Problems with opentelemetry peer versions and inclusion.
// I'll use Google stackdriver directly

/* tslint:disable */
/* eslint-disable */
const opentelemetry = require('@opentelemetry/api');

// Not functionally required but gives some insight what happens behind the scenes
const { diag, DiagConsoleLogger, DiagLogLevel } = opentelemetry;
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { NodeTracerProvider } = require('@opentelemetry/node');
const { SimpleSpanProcessor } = require('@opentelemetry/tracing');
const {
  TraceExporter,
} = require('@google-cloud/opentelemetry-cloud-trace-exporter');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { ZipkinExporter } = require('@opentelemetry/exporter-zipkin');

const Exporter = (process.env.EXPORTER || '').toLowerCase().startsWith('z')
  ? ZipkinExporter
  : JaegerExporter;
const {
  ExpressInstrumentation,
} = require('@opentelemetry/instrumentation-express');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');

module.exports = (serviceName) => {
  const provider = new NodeTracerProvider();
  registerInstrumentations({
    tracerProvider: provider,
    instrumentations: [
      // Express instrumentation expects HTTP layer to be instrumented
      HttpInstrumentation,
      ExpressInstrumentation,
    ],
  });

  const exporter =
    process.env.NODE_ENV !== 'production'
      ? new TraceExporter()
      : new Exporter({
          serviceName,
        });

  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

  // Initialize the OpenTelemetry APIs to use the NodeTracerProvider bindings
  provider.register();

  return opentelemetry.trace.getTracer('express');
};
