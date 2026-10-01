/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Lightweight Performance Monitoring Utility
 * Tracks render times, long-running asynchronous tasks, and identifies bottlenecks
 * in the Client Portal and Admin Dashboard.
 */

import { useEffect, useRef } from 'react';

export type MetricType = 'render' | 'async-task' | 'long-task';

export interface PerformanceMetric {
  id: string;
  type: MetricType;
  name: string;
  durationMs: number;
  timestamp: number;
  isBottleneck: boolean;
  context?: string;
  meta?: Record<string, any>;
}

export interface PerformanceSummary {
  totalMetrics: number;
  longTasksCount: number;
  averageDurationMs: number;
  maxDurationMs: number;
  slowestTask: PerformanceMetric | null;
  recentBottlenecks: PerformanceMetric[];
}

const DEFAULT_LONG_TASK_THRESHOLD_MS = 120; // Relaxed to 120ms for renders
const DEFAULT_ASYNC_THRESHOLD_MS = 600; // Relaxed to 600ms for cloud network queries
const MAX_METRIC_BUFFER_SIZE = 100;

function sanitizeMeta(meta?: Record<string, any>): Record<string, any> | undefined {
  if (!meta) return undefined;
  const piiKeys = ['name', 'fullName', 'partnerName', 'email', 'phone', 'phoneNumber', 'budget', 'budgetEnvelope', 'notes', 'vision', 'contact', 'credentials', 'password', 'user'];
  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(meta)) {
    if (piiKeys.some((k) => key.toLowerCase().includes(k.toLowerCase()))) {
      sanitized[key] = '[REDACTED_PII]';
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeMeta(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

class PerformanceMonitorService {
  private metrics: PerformanceMetric[] = [];
  private listeners: ((metric: PerformanceMetric) => void)[] = [];

  /**
   * Log metric and keep bounded circular buffer (Sanitizing any PII)
   */
  record(metric: Omit<PerformanceMetric, 'id' | 'timestamp' | 'isBottleneck'> & { thresholdMs?: number }): PerformanceMetric {
    const defaultThreshold = metric.type === 'async-task' ? DEFAULT_ASYNC_THRESHOLD_MS : DEFAULT_LONG_TASK_THRESHOLD_MS;
    const threshold = metric.thresholdMs ?? defaultThreshold;
    const isBottleneck = metric.durationMs >= threshold;

    const fullMetric: PerformanceMetric = {
      id: `perf-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      type: metric.type,
      name: metric.name,
      durationMs: Math.round(metric.durationMs * 100) / 100,
      isBottleneck,
      context: metric.context,
      meta: sanitizeMeta(metric.meta),
    };

    this.metrics.push(fullMetric);
    if (this.metrics.length > MAX_METRIC_BUFFER_SIZE) {
      this.metrics.shift();
    }

    if (isBottleneck) {
      console.warn(
        `%c[PerfMonitor: Bottleneck Detected] %c${metric.name} took %c${fullMetric.durationMs}ms%c (Threshold: ${threshold}ms)`,
        'color: #C6A66B; font-weight: bold;',
        'color: #171717; font-weight: normal;',
        'color: #BA1A1A; font-weight: bold;',
        'color: #77736D;'
      );
    }

    this.listeners.forEach((fn) => fn(fullMetric));
    return fullMetric;
  }

  /**
   * Measure execution duration of asynchronous tasks (e.g. Firestore queries, data loads)
   */
  async measureAsync<T>(
    name: string,
    asyncFn: () => Promise<T>,
    options?: { thresholdMs?: number; context?: string; meta?: Record<string, any> }
  ): Promise<T> {
    const start = performance.now();
    try {
      return await asyncFn();
    } finally {
      const durationMs = performance.now() - start;
      this.record({
        type: 'async-task',
        name,
        durationMs,
        thresholdMs: options?.thresholdMs ?? DEFAULT_ASYNC_THRESHOLD_MS,
        context: options?.context,
        meta: options?.meta,
      });
    }
  }

  /**
   * Retrieve all recorded metrics
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Calculate summary statistics across recorded metrics
   */
  getSummary(): PerformanceSummary {
    if (this.metrics.length === 0) {
      return {
        totalMetrics: 0,
        longTasksCount: 0,
        averageDurationMs: 0,
        maxDurationMs: 0,
        slowestTask: null,
        recentBottlenecks: [],
      };
    }

    let totalDuration = 0;
    let maxDuration = 0;
    let slowest: PerformanceMetric | null = null;
    const bottlenecks: PerformanceMetric[] = [];

    for (const m of this.metrics) {
      totalDuration += m.durationMs;
      if (m.durationMs > maxDuration) {
        maxDuration = m.durationMs;
        slowest = m;
      }
      if (m.isBottleneck) {
        bottlenecks.push(m);
      }
    }

    return {
      totalMetrics: this.metrics.length,
      longTasksCount: bottlenecks.length,
      averageDurationMs: Math.round((totalDuration / this.metrics.length) * 100) / 100,
      maxDurationMs: Math.round(maxDuration * 100) / 100,
      slowestTask: slowest,
      recentBottlenecks: bottlenecks.slice(-10).reverse(),
    };
  }

  /**
   * Clear recorded telemetry buffer
   */
  clear(): void {
    this.metrics = [];
  }

  /**
   * Subscribe to new performance metrics
   */
  subscribe(callback: (metric: PerformanceMetric) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }
}

export const PerformanceMonitor = new PerformanceMonitorService();

/**
   * React hook to profile component render and commit times
   */
export function useRenderProfiler(
  componentName: string,
  options?: { thresholdMs?: number; context?: string }
) {
  const renderStartTime = useRef(performance.now());
  renderStartTime.current = performance.now();

  useEffect(() => {
    const durationMs = performance.now() - renderStartTime.current;
    
    // Defer metric recording to avoid interrupting paint
    const handle = requestAnimationFrame(() => {
      PerformanceMonitor.record({
        type: 'render',
        name: `${componentName} Render`,
        durationMs,
        thresholdMs: options?.thresholdMs ?? 120, // Relaxed to 120ms
        context: options?.context,
      });
    });

    return () => {
      cancelAnimationFrame(handle);
    };
  });
}
