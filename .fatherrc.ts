export default {
    // entry: ['components/index.tsx'],
    overridesByEntry: {
      'index.tsx': {
        file: 'index1',
      },
     
    },
    esm: {
      type: 'babel',
      importLibToEs: true,
    },
    cjs: 'babel',
    extraBabelPlugins: [['import', { libraryName: 'antd', style: true }]],
  };