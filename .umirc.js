export default {
  title: '快运CMS业务组件库',
  logo:
    'http://kapp.sf-express.com/v1/AUTH_prd-FOP-PBS-CORE/k123/e0c15b25-55c2-489c-adeb-4c4400e2cc0a.svg?temp_url_sig=2dd54b0b4e2edcc0c497fb335091f1c974d93f03&temp_url_expires=3731895645',
  mode: 'site',
  "proxy": {
    "/dev-basp-system": {
      "target": "https://10.202.161.57",
      "changeOrigin": true,
      secure: false,
      // "pathRewrite": { "^/api" : "" }
    },
    "/gateway": {
      "target": "https://10.202.161.57",
      "changeOrigin": true,
      secure: false,
      // "pathRewrite": { "^/api" : "" }
    },
    "/user": {
      "target": "https://10.202.161.57",
      "changeOrigin": true,
      secure: false,
      // "pathRewrite": { "^/api" : "" }
    }

  },
  "define": {
    'process.env.DEPLOY_ENV': process.env.DEPLOY_ENV,
    'process.env.APP_KEY': process.env.APP_KEY,
    'process.env.APP_SECRET': process.env.APP_SECRET,
    'process.env.SYSTEM_KEY': process.env.SYSTEM_KEY,
  },
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: 'css',
      },
    ],
  ],

  navs: [
    null,
    {
      title: 'GitHub',
      path: 'https://github.com/ant-design/pro-table',
    },
  ],
  // plugins: [['umi-plugin-githubpages', {}]],
  hash: true,
};
