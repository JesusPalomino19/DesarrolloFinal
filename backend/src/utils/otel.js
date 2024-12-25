const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-grpc');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');

// Crear el proveedor de trazas
const provider = new NodeTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'backend-service',
  }),
});

// Configurar el exportador de Jaeger
const exporter = new OTLPTraceExporter({
  url: 'http://localhost:4317', // Endpoint estándar de OTLP
});

provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
provider.register();

// Registrar instrumentaciones automáticas
registerInstrumentations({
  instrumentations: [],
});

// Exportar el tracer para usarlo en la aplicación
module.exports = provider.getTracer('backend-tracer');