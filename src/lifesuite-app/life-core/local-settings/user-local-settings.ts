export class UserLocalSettings {
    public autoCollapseLeftNav: QueryLocalSetting<boolean> = new QueryLocalSetting(true); // since system autocollapses by default
}

export class QueryLocalSetting<T> {
    constructor(value: T) {
        this.value = value;
    }
    public isQueried: boolean = false;
    public value: T;
}
