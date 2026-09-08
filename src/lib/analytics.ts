// ISSUE-036, ISSUE-037, ISSUE-038: Telemetry, Web Vitals and Error Tracking

export interface WebVitalsMetric {
  id: string;
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

export function reportWebVitals(metric: WebVitalsMetric) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}:`, metric.value);
  }
  // Integration point for Google Analytics or Sentry
}

export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] ${eventName}:`, properties);
  }
}

export function trackError(error: Error, errorInfo?: any) {
  console.error('[Error Tracking]', error, errorInfo);
  // Integration point for Sentry.captureException(error)
}
