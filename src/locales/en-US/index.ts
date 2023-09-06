import { enUS_component } from './component';
import { enUS_globalTips } from './global/tips';
import { enUS_avatorDropMenu } from './user/avatorDropMenu';
import { enUS_tagsViewDropMenu } from './user/tagsViewDropMenu';
import { enUS_title } from './user/title';

const en_US = {
    ...enUS_avatorDropMenu,
    ...enUS_tagsViewDropMenu,
    ...enUS_title,
    ...enUS_globalTips,
    ...enUS_component,
};

export default en_US;
