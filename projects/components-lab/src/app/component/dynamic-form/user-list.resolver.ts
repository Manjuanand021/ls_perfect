import { Injectable } from '@angular/core';

import { DirectDataResolverClass } from 'life-core/component/shared';

@Injectable()
export class UserListResolver implements DirectDataResolverClass<any[]> {
    context: any;
    public directResolve(): Promise<any[]> {
        const userList = [
            { label: 'User 1', value: '1' },
            { label: 'User 2', value: '2' },
            { label: 'User 3', value: '3' }
        ];
        return Promise.resolve(userList);
    }
}
