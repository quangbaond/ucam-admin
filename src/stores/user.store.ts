import type { Locale, UserState } from '@/interface/user/user';
import type { Role } from '@/modules/users/dto/login';
import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

import { getGlobalState } from '@/utils/getGloabal';

const initialState: UserState = {
    ...getGlobalState(),
    locale: (localStorage.getItem('locale')! || 'en_US') as Locale,
    newUser: JSON.parse(localStorage.getItem('newUser')!) ?? true,
    logged: localStorage.getItem('t') ? true : false,
    menuList: [],
    username: localStorage.getItem('username') || '',
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserItem(state, action: PayloadAction<Partial<UserState>>) {
            const { username } = action.payload;

            if (username !== state.username) {
                localStorage.setItem('username', action.payload.username || '');
            }

            Object.assign(state, action.payload);
        },
    },
});

export const { setUserItem } = userSlice.actions;

export default userSlice.reducer;
