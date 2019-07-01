import { NgModule } from '@angular/core';

import { OpenPolicyDelegate } from 'business/shared/open-policy';
import { ApplicantListHelper, ActiveApplicantHelper, ApplicationCountersHelper } from 'business/policy/shared';
import { PerformanceMonitorService } from 'ls-core/service/performance-monitor.service';
import { LogPerformanceDelegate } from 'business/policy/shared/log-performance/log-performance.delegate';
import { CanCapturePerformanceMetricsDelegate } from 'business/policy/shared/log-performance/can-capture-performance-metrics.delegate';
import { BasePolicyDataResolver, PolicyRootObjectTracker } from 'business/policy/shared';

@NgModule({
    providers: [
        OpenPolicyDelegate,
        ApplicantListHelper,
        ActiveApplicantHelper,
        ApplicationCountersHelper,
        PerformanceMonitorService,
        LogPerformanceDelegate,
        CanCapturePerformanceMetricsDelegate,
        // BasePolicyDataResolver and PolicyRootObjectTracker need to be provided
        // globally because they are injected in several lazy-loaded modules.
        BasePolicyDataResolver,
        PolicyRootObjectTracker
    ]
})
export class PolicyHelpersModule {}
