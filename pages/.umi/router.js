import React from 'react';
import {
  Router as DefaultRouter,
  Route,
  Switch,
  StaticRouter,
} from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/lib/renderRoutes';
import history from '@@/history';

const Router = DefaultRouter;

const routes = [
  {
    path: '/',
    component: props =>
      React.createElement(
        require('/Users/01211115/Desktop/workspace/ky-table/node_modules/umi-plugin-father-doc/lib/themes/default/layout.js')
          .default,
        {
          ...{
            menus: {
              '*': {
                '*': [
                  {
                    path: '/',
                    title: '介绍',
                    meta: {
                      title: '介绍',
                      order: 10,
                      slugs: [
                        { depth: 1, value: 'Usage', heading: 'usage' },
                        { depth: 1, value: 'Demo', heading: 'demo' },
                      ],
                    },
                  },
                  {
                    path: '/index2',
                    title: '介绍2',
                    meta: {
                      title: '介绍2',
                      order: 9,
                      slugs: [
                        { depth: 1, value: 'Usage', heading: 'usage' },
                        { depth: 1, value: 'Demo', heading: 'demo' },
                      ],
                    },
                  },
                  {
                    path: '/kytable',
                    title: 'KYTable',
                    meta: {
                      title: 'KYTable',
                      order: 8,
                      slugs: [
                        { depth: 1, value: 'Usage', heading: 'usage' },
                        { depth: 1, value: 'Demo', heading: 'demo' },
                      ],
                    },
                  },
                ],
              },
            },
            locales: [],
            navs: {},
            title: '快运CMS业务组件库',
            logo:
              'http://kapp.sf-express.com/v1/AUTH_prd-FOP-PBS-CORE/k123/e0c15b25-55c2-489c-adeb-4c4400e2cc0a.svg?temp_url_sig=2dd54b0b4e2edcc0c497fb335091f1c974d93f03&temp_url_expires=3731895645',
            mode: 'doc',
            repoUrl: 'https://github.com/ago008/ky-table',
          },
          ...props,
        },
      ),
    routes: [
      {
        path: '/',
        component: require('../../docs/index.md').default,
        exact: true,
        meta: {
          title: '介绍',
          order: 10,
          slugs: [
            {
              depth: 1,
              value: 'Usage',
              heading: 'usage',
            },
            {
              depth: 1,
              value: 'Demo',
              heading: 'demo',
            },
          ],
        },
        title: '介绍',
        Routes: [require('./TitleWrapper.jsx').default],
        _title: '快运CMS业务组件库 - 介绍',
        _title_default: '快运CMS业务组件库',
      },
      {
        path: '/index2',
        component: require('../../docs/index2.md').default,
        exact: true,
        meta: {
          title: '介绍2',
          order: 9,
          slugs: [
            {
              depth: 1,
              value: 'Usage',
              heading: 'usage',
            },
            {
              depth: 1,
              value: 'Demo',
              heading: 'demo',
            },
          ],
        },
        title: '介绍2',
        Routes: [require('./TitleWrapper.jsx').default],
        _title: '快运CMS业务组件库 - 介绍2',
        _title_default: '快运CMS业务组件库',
      },
      {
        path: '/kytable',
        component: require('../../docs/kytable.md').default,
        exact: true,
        meta: {
          title: 'KYTable',
          order: 8,
          slugs: [
            {
              depth: 1,
              value: 'Usage',
              heading: 'usage',
            },
            {
              depth: 1,
              value: 'Demo',
              heading: 'demo',
            },
          ],
        },
        title: 'KYTable',
        Routes: [require('./TitleWrapper.jsx').default],
        _title: '快运CMS业务组件库 - KYTable',
        _title_default: '快运CMS业务组件库',
      },
      {
        component: () =>
          React.createElement(
            require('/Users/01211115/Desktop/workspace/ky-table/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'pages', hasRoutesInConfig: false },
          ),
        _title: '快运CMS业务组件库',
        _title_default: '快运CMS业务组件库',
      },
    ],
    title: '快运CMS业务组件库',
    _title: '快运CMS业务组件库',
    _title_default: '快运CMS业务组件库',
  },
];
window.g_routes = routes;
const plugins = require('umi/_runtimePlugin');
plugins.applyForEach('patchRoutes', { initialValue: routes });

export { routes };

export default class RouterWrapper extends React.Component {
  unListen() {}

  constructor(props) {
    super(props);

    // route change handler
    function routeChangeHandler(location, action) {
      plugins.applyForEach('onRouteChange', {
        initialValue: {
          routes,
          location,
          action,
        },
      });
    }
    this.unListen = history.listen(routeChangeHandler);
    // dva 中 history.listen 会初始执行一次
    // 这里排除掉 dva 的场景，可以避免 onRouteChange 在启用 dva 后的初始加载时被多执行一次
    const isDva =
      history.listen
        .toString()
        .indexOf('callback(history.location, history.action)') > -1;
    if (!isDva) {
      routeChangeHandler(history.location);
    }
  }

  componentWillUnmount() {
    this.unListen();
  }

  render() {
    const props = this.props || {};
    return <Router history={history}>{renderRoutes(routes, props)}</Router>;
  }
}
