import { Injectable } from '@angular/core';

import { PerformanceMonitorService } from 'ls-core/service/performance-monitor.service';
import { CanCapturePerformanceMetricsDelegate } from 'business/policy/shared/log-performance/can-capture-performance-metrics.delegate';

@Injectable()
export class LogPerformanceDelegate {
    private _performanceMonitorService: PerformanceMonitorService;
    private _canCapturePerformanceMetrics: CanCapturePerformanceMetricsDelegate;

    constructor(
        performanceMonitorService: PerformanceMonitorService,
        canCapturePerformanceMetrics: CanCapturePerformanceMetricsDelegate
    ) {
        this._performanceMonitorService = performanceMonitorService;
        this._canCapturePerformanceMetrics = canCapturePerformanceMetrics;
    }

    public log(isInitialData: boolean, policyNumber: string, action: string): void {
        if (this._canCapturePerformanceMetrics.isAllowed()) {
            this._performanceMonitorService.load(isInitialData, policyNumber, action);
        }
    }
}
