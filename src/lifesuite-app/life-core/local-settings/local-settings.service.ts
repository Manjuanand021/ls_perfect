import { Injectable } from '@angular/core';
import { ILocalStorage, LocalStorage } from 'life-core/storage/local-storage';
import { Session } from 'life-core/session';
import { ObjectUtil, IDefaultConstructor } from 'life-core/util/lang';

export interface ILocalSettingsService {
    getSiteSetting<T>(settingName: string): T;
    setSiteSetting(settingName: string, data: any): void;
    removeSiteSetting(settingName: string): void;
    getUserSetting<T>(settingName: string): T;
    setUserSetting(settingName: string, data: any): void;
    removeUserSetting(settingName: string): void;
    removeAllSettings(): void;
    getAllUserSettings<T>(userLocalSettingsType: IDefaultConstructor<T>): T;
    setAllUserSettings<T>(userLocalSettingsType: T): void;
}

@Injectable()
export class LocalSettingsService implements ILocalSettingsService {
    private _userId: string;
    private _localStorage: ILocalStorage;

    constructor(session: Session, localStorage: LocalStorage) {
        this._userId = session.userId;
        this._localStorage = localStorage;
    }

    public getSiteSetting<T>(settingName: string): T {
        return this._localStorage.getItem(settingName);
    }

    public setSiteSetting(settingName: string, data: any): void {
        this._localStorage.setItem(settingName, data);
    }

    public removeSiteSetting(settingName: string): void {
        this._localStorage.removeItem(settingName);
    }

    public getUserSetting<T>(settingName: string): T {
        const key = this.getUserSettingKey(settingName);
        return this._localStorage.getItem(key);
    }

    public setUserSetting(settingName: string, data: any): void {
        const key = this.getUserSettingKey(settingName);
        this._localStorage.setItem(key, data);
    }

    public removeUserSetting(settingName: string): void {
        const key = this.getUserSettingKey(settingName);
        this._localStorage.removeItem(key);
    }

    public removeAllSettings(): void {
        this._localStorage.clear();
    }

    private getUserSettingKey(settingName: string): string {
        return `${this._userId}_${settingName}`;
    }

    public getAllUserSettings<T>(userLocalSettingsType: IDefaultConstructor<T>): T {
        const userSettings = ObjectUtil.createObjectOfType({}, userLocalSettingsType) as T;
        Object.keys(userSettings).forEach(property => {
            const value = this.getUserSetting<typeof property>(property);
            if (value != null) {
                userSettings[property] = value;
            }
        });
        return userSettings;
    }

    public setAllUserSettings<T>(userLocalSettingsType: T): void {
        Object.keys(userLocalSettingsType).forEach(property => {
            this.setUserSetting(property, userLocalSettingsType[property]);
        });
    }
}
