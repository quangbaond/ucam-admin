// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import type { RouteObject } from 'react-router';

import React, { lazy } from 'react';
import { Navigate } from 'react-router';
import { useRoutes } from 'react-router-dom';

import AnnouncementsList from '@/modules/announcement/pages/list';
import MentorIntroduceList from '@/modules/banners/pages';
import Categories from '@/modules/categories/pages';
import ConfigForm from '@/modules/config/pages';
import CourseCreateForm from '@/modules/courses/pages/create';
import CourseListForm from '@/modules/courses/pages/list';
import Education from '@/modules/educations/pages/';
import Exam from '@/modules/exams/pages';
import MajorList from '@/modules/majors/pages/list';
import MentorForm from '@/modules/mentor/page';
import Pedagogy from '@/modules/pedagogy/pages';
import Question from '@/modules/questions/pages/';
import SubjectList from '@/modules/subjects/pages/list';
import UserList from '@/modules/users/pages';
import UserFormUpdate from '@/modules/users/pages/edit';
import WithDraw from '@/modules/withdraw/pages';
import LayoutPage from '@/pages/layout';
import LoginPage from '@/pages/login';

import { ConfigEnum, getStoreItem, storageKey } from '../const';
import WrapperRouteComponent from './config';

const NotFound = lazy(() => import(/* webpackChunkName: "404'"*/ '@/pages/404'));
//  variable isLoggedIn is used to check if user is logged in or not
const isLoggedIn = getStoreItem(storageKey.USER_INFO) ? true : false;

const routeList: RouteObject[] = [
    {
        path: '/login',
        element: !isLoggedIn ? (
            <WrapperRouteComponent element={<LoginPage />} titleId="title.login" />
        ) : (
            <Navigate to="/" />
        ),
    },
    {
        path: '/',
        element: isLoggedIn ? <WrapperRouteComponent element={<LayoutPage />} titleId="" /> : <Navigate to="/login" />,
        children: [
            {
                path: '',
                element: <Navigate to="users" />,
            },
            {
                path: 'users',
                element: <WrapperRouteComponent element={<UserList />} titleId="title.users" />,
            },
            {
                path: 'withdraws',
                element: <WrapperRouteComponent element={<WithDraw />} titleId="title.withdraw" />,
            },
            {
                path: 'users/:id',
                element: <WrapperRouteComponent element={<UserFormUpdate />} titleId="title.users" />,
            },
            {
                path: 'edu/educations',
                element: <WrapperRouteComponent element={<Education />} titleId="title.edu" />,
            },
            {
                path: 'courses',
                element: <WrapperRouteComponent element={<CourseListForm />} titleId="title.course" />,
            },
            {
                path: 'courses/:id',
                element: <WrapperRouteComponent element={<CourseCreateForm />} titleId="title.create_course" />,
            },

            {
                path: 'exams',
                element: <WrapperRouteComponent element={<Exam />} titleId="title.exams" />,
            },
            {
                path: 'questions',
                element: <WrapperRouteComponent element={<Question />} titleId="title.question" />,
            },

            {
                path: 'questions/:id',
                element: <WrapperRouteComponent element={<Question />} titleId="title.question" />,
            },
            {
                path: 'edu/subjects',
                element: <WrapperRouteComponent element={<SubjectList />} titleId="title.subject" />,
            },
            {
                path: 'edu/majors',
                element: <WrapperRouteComponent element={<MajorList />} titleId="title.major" />,
            },
            {
                path: 'edu/categories',
                element: <WrapperRouteComponent element={<Categories />} titleId="title.category" />,
            },
            {
                path: 'announcements',
                element: <WrapperRouteComponent element={<AnnouncementsList />} titleId="title.announcement" />,
            },
            {
                path: 'settings/mentor-introduce',
                element: <WrapperRouteComponent element={<MentorIntroduceList />} titleId="title.banner" />,
            },
            // {
            //     path: 'pedagogy',
            //     element: <WrapperRouteComponent element={<Pedagogy />} titleId="title.pedagogy" />,
            // },
            {
                path: 'mentor',
                element: <WrapperRouteComponent element={<MentorForm />} titleId="title.mentor" />,
            },
            {
                path: 'config-contact',
                element: (
                    <WrapperRouteComponent
                        element={<ConfigForm type={ConfigEnum.CONTACT} />}
                        titleId="title.config_contact"
                    />
                ),
            },
            {
                path: 'config-partner',
                element: (
                    <WrapperRouteComponent
                        element={<ConfigForm type={ConfigEnum.PARTNER} />}
                        titleId="title.config_partner"
                    />
                ),
            },
            {
                path: 'config-system',
                element: (
                    <WrapperRouteComponent
                        element={<ConfigForm type={ConfigEnum.SYSTEM} />}
                        titleId="title.config_system"
                    />
                ),
            },
            {
                path: '*',
                element: <WrapperRouteComponent element={<NotFound />} titleId="title.notFount" />,
            },
        ],
    },
];

const RenderRouter: React.FC = () => {
    const element: React.ReactElement | null = useRoutes(routeList);

    return element;
};

export default RenderRouter;
