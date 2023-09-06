import 'dayjs/locale/zh-cn';

import { ConfigProvider, Spin, theme as a } from 'antd';
import enUS from 'antd/es/locale/en_US';
import zhCN from 'antd/es/locale/zh_CN';
import dayjs from 'dayjs';
import React, { Suspense, useEffect } from 'react';
import { IntlProvider } from 'react-intl';
import { useSelector } from 'react-redux';

import { history, HistoryRouter } from '@/routes/history';

import { localeConfig, LocaleFormatter } from './locales';
import RenderRouter from './routes';

const App: React.FC = () => {
    const { locale } = useSelector(state => state.user);
    const { loading } = useSelector(state => state.global);

    // set the locale for the user
    // more languages options can be added here
    useEffect(() => {
        if (locale === 'en_US') {
            dayjs.locale('en');
        } else if (locale === 'zh_CN') {
            dayjs.locale('zh-cn');
        }
    }, [locale]);

    /**
     * handler function that passes locale
     * information to ConfigProvider for
     * setting language across text components
     */
    const getAntdLocale = () => {
        if (locale === 'en_US') {
            return enUS;
        } else if (locale === 'zh_CN') {
            return zhCN;
        }
    };

    return (
        <ConfigProvider
            locale={getAntdLocale()}
            componentSize="middle"
            theme={{
                token: { colorPrimary: '#13c2c2' },
                // algorithm: theme === 'dark' ? a.darkAlgorithm : a.defaultAlgorithm,
                algorithm: a.defaultAlgorithm,
            }}
        >
            <IntlProvider locale={locale.split('_')[0]} messages={localeConfig[locale]}>
                <HistoryRouter history={history}>
                    <Suspense fallback={null}>
                        <Spin
                            spinning={loading}
                            className="app-loading-wrapper"
                            tip={<LocaleFormatter id="gloabal.tips.loading" />}
                        ></Spin>
                        <RenderRouter />
                    </Suspense>
                </HistoryRouter>
            </IntlProvider>
        </ConfigProvider>
    );
};

export default App;
