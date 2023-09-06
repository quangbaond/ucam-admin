// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import './styles/index.less';

// import 'antd/dist/antd.variable.min.css';
// import './mock';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './App';
import store from './stores';

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'),
);
