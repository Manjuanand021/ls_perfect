import { DirectDataResolverClass } from 'life-core/component/shared';

export abstract class BaseDynamicFieldDataResolver<T> implements DirectDataResolverClass<T> {
    protected value: T;

    constructor() {}

    public directResolve(): Promise<T> {
        return this.resolveData();
    }

    private resolveData(): Promise<T> {
        return this.resolveValue().then(value => (this.value = value));
    }

    protected abstract resolveValue(): Promise<T>;
}
