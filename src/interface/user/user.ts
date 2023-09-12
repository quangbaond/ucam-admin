import type { USER_MODULE } from '..';
import type { MenuList } from '../layout/menu.interface';
import type { Device } from '@/interface/layout/index.interface';

export type Locale = 'en_US';

export interface UserState {
    username: string;

    /** menu list for init tagsView */
    menuList: MenuList;

    /** login status */
    logged: boolean;

    /** user's device */
    device: Device;

    /** menu collapsed status */
    collapsed: boolean;

    /** notification count */

    /** user's language */
    locale: Locale;

    /** Is first time to view the site ? */
    newUser: boolean;

    modules: USER_MODULE[];
}
