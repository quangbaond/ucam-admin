import type { FC } from 'react';

import { ReactComponent as AccountSvg } from '@/assets/menu/account.svg';
import { ReactComponent as CourseSvg } from '@/assets/menu/course.svg';
import { ReactComponent as DashboardSvg } from '@/assets/menu/dashboard.svg';
import { ReactComponent as DocumentationSvg } from '@/assets/menu/documentation.svg';
import { ReactComponent as ExamSvg } from '@/assets/menu/exam.svg';
import { ReactComponent as GuideSvg } from '@/assets/menu/guide.svg';
import { ReactComponent as MentorSvg } from '@/assets/menu/mentor.svg';
import { ReactComponent as MoneySvg } from '@/assets/menu/money.svg';
import { ReactComponent as NotificationSvg } from '@/assets/menu/notification.svg';
import { ReactComponent as QuestionSvg } from '@/assets/menu/question.svg';
import { ReactComponent as SchoolSvg } from '@/assets/menu/school.svg';
import { ReactComponent as SettingSvg } from '@/assets/menu/setting.svg';

interface CustomIconProps {
    type: string;
}

export const CustomIcon: FC<CustomIconProps> = (props) => {
    const { type } = props;
    let com = <GuideSvg />;

    if (type === 'guide') {
        com = <GuideSvg />;
    } else if (type === 'dashboard') {
        com = <DashboardSvg />;
    } else if (type === 'account') {
        com = <AccountSvg />;
    } else if (type === 'documentation') {
        com = <DocumentationSvg />;
    } else if (type === 'school') {
        com = <SchoolSvg />;
    } else if (type === 'course') {
        com = <CourseSvg />;
    } else if (type === 'exam') {
        com = <ExamSvg />;
    } else if (type === 'question') {
        com = <QuestionSvg />;
    } else if (type === 'notification') {
        com = <NotificationSvg />;
    } else if (type === 'setting') {
        com = <SettingSvg />;
    } else if (type === 'mentor') {
        com = <MentorSvg />;
    } else if (type === 'money') {
        com = <MoneySvg />;
    } else {
        com = <GuideSvg />;
    }

    return <span className="anticon">{com}</span>;
};
