---
title: 介绍2
order: 9
---


```tsx | inline
import React from 'react';
import GitHubButton from 'react-github-btn';

export default () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <h1
      style={{
        marginBottom: 16,
      }}
    >
      @ant-design/pro-table
    </h1>
    <div
      align="center"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
      }}
    >
      <GitHubButton
        href="https://github.com/ant-design/pro-table"
        data-size="large"
        data-show-count
        aria-label="Star ant-design/pro-table on GitHub"
      >
        Star
      </GitHubButton>
      <div
        style={{
          margin: '0 8px',
        }}
      />
      <GitHubButton
        href="https://github.com/ant-design/pro-table/issues"
        data-color-scheme="no-preference: light; light: light; dark: light;"
        data-size="large"
        data-show-count="true"
        aria-label="Issue ant-design/pro-table on GitHub"
      >
        Issue
      </GitHubButton>
    </div>
    <div align="center">🏆 Use Ant Design Table like a Pro!</div>
  </div>
);
```

## Usage

```bash
npm install @ant-design/pro-table
# or
yarn add @ant-design/pro-table
```

## Demo

<code src="./demo/demo2.tsx" />
