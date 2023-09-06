import { viVN_component } from './component';
import { viVN_globalTips } from './global/tips';
import { viVN_avatorDropMenu } from './user/avatorDropMenu';
import { viVN_tagsViewDropMenu } from './user/tagsViewDropMenu';
import { viVN_title } from './user/title';

const vi_VN = {
    ...viVN_avatorDropMenu,
    ...viVN_tagsViewDropMenu,
    ...viVN_title,
    ...viVN_globalTips,
    ...viVN_component,
};

export default vi_VN;
