import type { FC } from 'react';

import { LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons';
import { Dropdown, Layout, theme as antTheme, Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Avator from '@/assets/header/avator.jpeg';
import logo from '@/assets/logo/logo.svg';
import { getStoreItem, storageKey } from '@/const';
import { LocaleFormatter, useLocale } from '@/locales';

import { logoutAsync } from '../../stores/user.action';

const { Header } = Layout;

interface HeaderProps {
    collapsed: boolean;
    toggle: () => void;
}

type Action = 'userInfo' | 'userSetting' | 'logout';

const HeaderComponent: FC<HeaderProps> = ({ collapsed, toggle }) => {
    const { device } = useSelector((state) => state.user);

    const user = getStoreItem(storageKey.USER_INFO);

    const { theme } = useSelector((state) => state.global);
    const navigate = useNavigate();
    const token = antTheme.useToken();
    const dispatch = useDispatch();
    const { formatMessage } = useLocale();

    const onActionClick = async (action: Action) => {
        switch (action) {
            case 'userInfo':
                return;
            case 'userSetting':
                return;
            case 'logout':
                const res = Boolean(await dispatch(logoutAsync()));

                res && window.location.reload();

                return;
        }
    };

    // const onChangeTheme = () => {
    //     const newTheme = theme === 'dark' ? 'light' : 'dark';
    //
    //     localStorage.setItem('theme', newTheme);
    //     dispatch(
    //         setGlobalState({
    //             theme: newTheme,
    //         }),
    //     );
    // };

    return (
        <Header className="layout-page-header bg-2" style={{ backgroundColor: token.token.colorBgContainer }}>
            {device !== 'MOBILE' && (
                <div className="logo" style={{ width: collapsed ? 200 : 200 }}>
                    <img src={logo} alt="" style={{ marginRight: collapsed ? '2px' : '20px' }} />
                </div>
            )}
            <div className="layout-page-header-main">
                <div onClick={toggle}>
                    <span id="sidebar-trigger">{collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}</span>
                </div>
                <div className="actions">
                    <Tooltip
                        title={formatMessage({
                            id: theme === 'dark' ? 'gloabal.tips.theme.lightTooltip' : 'gloabal.tips.theme.darkTooltip',
                        })}
                    >
                        {/*<span>*/}
                        {/*    {createElement(theme === 'dark' ? SunSvg : MoonSvg, {*/}
                        {/*        onClick: onChangeTheme,*/}
                        {/*    })}*/}
                        {/*</span>*/}
                    </Tooltip>

                    {user ? (
                        <Dropdown
                            menu={{
                                items: [
                                    {
                                        key: '1',
                                        icon: <UserOutlined />,
                                        label: (
                                            <span onClick={() => navigate('/dashboard')}>
                                                <LocaleFormatter id="header.avator.account" />
                                            </span>
                                        ),
                                    },
                                    {
                                        key: '2',
                                        icon: <LogoutOutlined />,
                                        label: (
                                            <span onClick={() => onActionClick('logout')}>
                                                <LocaleFormatter id="header.avator.logout" />
                                            </span>
                                        ),
                                    },
                                ],
                            }}
                        >
                            <span className="user-action">
                                <img src={user.avatarUrl || Avator} className="user-avator" alt="avator" />
                            </span>
                        </Dropdown>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </Header>
    );
};

export default HeaderComponent;
