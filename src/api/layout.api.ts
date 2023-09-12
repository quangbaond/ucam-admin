import type { MenuModules } from '../interface/layout/menu.interface';
import type { AxiosRequestConfig } from 'axios';

import { settings } from './const';
import { request } from './request';

export const getMenuList = (config: AxiosRequestConfig = {}) =>
    request<MenuModules>('post', `${settings.API_URL}/menus/find`, {}, config);
