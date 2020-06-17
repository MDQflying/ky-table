// @ts-nocheck
import { ApplyPluginsType } from '/Users/01211115/Desktop/workspace/ky-table/node_modules/@umijs/runtime';
import { plugin } from './plugin';

const routes = [
  {
    "path": "/_demos/demo2",
    "component": require('../../../docs/demo/demo2.tsx').default,
    "exact": true
  },
  {
    "path": "/_demos/index",
    "component": require('../../../docs/demo/index.tsx').default,
    "exact": true
  },
  {
    "path": "/",
    "component": (props) => require('react').createElement(require('../../../node_modules/@umijs/preset-dumi/lib/themes/default/layout.js').default, {
      ...{"menus":{"*":{"/demo2":[{"path":"/demo2","title":"介绍2","meta":{"order":9}}],"*":[{"path":"/","title":"介绍","meta":{"order":10}}],"/kytable":[{"path":"/kytable","title":"KYTable","meta":{"order":8}}]}},"locales":[],"navs":{"*":[{"path":"/demo2","title":"Demo2"},{"path":"/kytable","title":"Kytable"},{"title":"GitHub","path":"https://github.com/ant-design/pro-table"}]},"title":"快运CMS业务组件库","logo":"http://kapp.sf-express.com/v1/AUTH_prd-FOP-PBS-CORE/k123/e0c15b25-55c2-489c-adeb-4c4400e2cc0a.svg?temp_url_sig=2dd54b0b4e2edcc0c497fb335091f1c974d93f03&temp_url_expires=3731895645","mode":"site","repoUrl":"https://github.com/ago008/ky-table"},
      ...props,
    }),
    "routes": [
      {
        "path": "/demo2",
        "component": require('../../../docs/demo2.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/demo2.md",
          "updatedTime": 1592184609000,
          "title": "介绍2",
          "order": 9,
          "slugs": [
            {
              "depth": 2,
              "value": "Usage",
              "heading": "usage"
            },
            {
              "depth": 2,
              "value": "Demo",
              "heading": "demo"
            }
          ],
          "nav": {
            "path": "/demo2",
            "title": "Demo2"
          }
        },
        "title": "介绍2"
      },
      {
        "path": "/",
        "component": require('../../../docs/index.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/index.md",
          "updatedTime": 1592184609000,
          "title": "介绍",
          "order": 10,
          "slugs": [
            {
              "depth": 2,
              "value": "Usage",
              "heading": "usage"
            },
            {
              "depth": 2,
              "value": "Demo",
              "heading": "demo"
            }
          ]
        },
        "title": "介绍"
      },
      {
        "path": "/kytable",
        "component": require('../../../docs/kytable.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/kytable.md",
          "updatedTime": 1592184609000,
          "title": "KYTable",
          "order": 8,
          "slugs": [
            {
              "depth": 2,
              "value": "Usage",
              "heading": "usage"
            },
            {
              "depth": 2,
              "value": "Demo",
              "heading": "demo"
            }
          ],
          "nav": {
            "path": "/kytable",
            "title": "Kytable"
          }
        },
        "title": "KYTable"
      }
    ],
    "title": "快运CMS业务组件库"
  }
];

// allow user to extend routes
plugin.applyPlugins({
  key: 'patchRoutes',
  type: ApplyPluginsType.event,
  args: { routes },
});

export { routes };
