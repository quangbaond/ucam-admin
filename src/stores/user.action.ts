// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import type { IGetUsersParams, LoginParams, User } from '../modules/users/dto/login';
import type { Dispatch } from '@reduxjs/toolkit';

import { removeStoreItem, setStoreItem, storageKey } from '../const';
import { apiLogin } from '../modules/users/api';
import { createAsyncAction } from './utils';

// typed wrapper async thunk function demo, no extra feature, just for powerful typings
export const loginAsync = createAsyncAction<LoginParams, boolean>(payload => {
    return async () => {
        const { result, status } = await apiLogin(payload);

        if (status) {
            setStoreItem(storageKey.USER_INFO, result);

            return true;
        }

        return false;
    };
});

export const logoutAsync = () => {
    return async (dispatch: Dispatch) => {
        // const { status } = await apiLogout({ accessToken: getStoreItem(storageKey.USER_INFO)?.accessToken });

        // if (status) {
        //   localStorage.clear();
        //   dispatch(
        //     setUserItem({
        //       logged: false,
        //     }),
        //   );

        //   return true;
        // }

        // return false;
        removeStoreItem(storageKey.USER_INFO);

        return true;
    };
};
