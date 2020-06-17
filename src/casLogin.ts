/**
 * @author
 * casLogin
 */
// import { Notification } from 'element-ui';

function GetXmlHttpObject() {
  let xhr;
  if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest();
  } else {
    xhr = new window.ActiveXObject('Microsoft.XMLHTTP');
  }
  return xhr;
}

function getQueryString(name) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return r[2];
  return '';
}

function getDeviceId() {
  const s = [];
  const hexDigits = 'abcdef';
  for (let i = 0; i < 10; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 6), 1);
  }
  const uuid = s.join('') + new Date().getTime();
  return uuid;
}

function funcUrlDel(name: string) {
  let url = '';
  const { origin, pathname, search } = window.location;
  const baseUrl = `${origin}${pathname}?`;
  const query = search.substr(1);
  if (query.indexOf(name) > -1) {
    const obj = {};
    const arr = query.split('&');
    for (let i = 0; i < arr.length; i++) {
      arr[i] = arr[i].split('=');

      obj[arr[i][0]] = arr[i][1]; // eslint-disable-line
    }
    delete obj[name];
    url =
      baseUrl +
      JSON.stringify(obj)
        .replace(/[\"\{\}]/g, '') // eslint-disable-line
        .replace(/\:/g, '=') // eslint-disable-line
        .replace(/\,/g, '&'); // eslint-disable-line
  }
  return url;
}

const isOutside = (() => {
  return /wfop/gi.test(window.location.host);
})();

class CAS {
  constructor(options = {}) {
    const {
      url = '',
      appKey = 'FOP-KACS-CORE',
      appSecret = 'FOP-KACS-CORE',
      ENV = 'SIT',
      callback = null,
      casloginURL = 'http://cas.sit.sf-express.com/cas/login',
      caslogoutURL = 'http://cas.sit.sf-express.com/cas/logout',
    } = options;
    Object.assign(this, {
      url,
      appKey,
      appSecret,
      ENV,
      callback,
      casloginURL,
      caslogoutURL,
    });
  }

  casURL() {
    if (this.ENV === 'SIT') {
      this.casloginURL = isOutside
        ? 'http://wcas.sit.sf-express.com/cas/login'
        : 'http://cas.sit.sf-express.com/cas/login';
      this.caslogoutURL = isOutside
        ? 'http://wcas.sit.sf-express.com/cas/logout'
        : 'http://cas.sit.sf-express.com/cas/logout';
    } else if (this.ENV === 'PRD') {
      this.casloginURL = isOutside
        ? 'https://wcas.sf-express.com/cas/login'
        : 'https://cas.sf-express.com/cas/login';
      this.caslogoutURL = isOutside
        ? 'https://wcas.sf-express.com/cas/logout'
        : 'https://cas.sf-express.com/cas/logout';
    } else {
      // Notification.error({
      //   title: '异常',
      //   message: 'ENV环境参数值只能为SIT或PRD!',
      // });
    }
  }

  isTicket() {
    if (!sessionStorage.ticket) {
      window.location.href = `${this.casloginURL}?service=${sessionStorage.url}`;
    } else {
      if (!localStorage.deviceId) {
        localStorage.deviceId = getDeviceId();
      }
      const that = this;
      const xhr = GetXmlHttpObject();
      let params = {
        ticket: sessionStorage.ticket,
        service: sessionStorage.url,
        appKey: that.appKey,
        appSecret: that.appSecret,
        deviceId: localStorage.deviceId,
      };
      params = JSON.stringify(params);
      const ticketUrl = `${that.url}/user/cas/knock`;
      xhr.open('POST', ticketUrl, true);
      xhr.setRequestHeader('content-type', 'application/json');
      xhr.send(params);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          //   const result = xhr.response;
          if (xhr.status === 200) {
            if (JSON.parse(xhr.response).success === true) {
              // 注入cookie
              window.location.href = funcUrlDel('ticket');
              // that.checkToken()
            } else if (JSON.parse(xhr.response).success === false) {
              // Notification.error({
              //   title: '异常',
              //   message: JSON.parse(xhr.response).errorMessage,
              // });
            } else {
              // Notification.error({
              //   title: '异常',
              //   message: '网关' + that.url + '/knock接口访问错误！',
              // });
            }
          } else if (xhr.status === 430 || xhr.status === 401) {
            sessionStorage.removeItem('ticket');
            // 失败,跳转到cas
            window.location.href = `${that.casloginURL}?service=${sessionStorage.url}`;
          } else {
            //   Notification.error({
            //     title: '异常',
            //     message: '网关' + that.url + '/knock接口访问错误！',
            //   });
          }
        }
      };
    }
  }

  checkToken() {
    const xhr = GetXmlHttpObject();
    const that = this;
    const checkTokenUrl = `${that.url}/gateway/check_token`;
    xhr.open('GET', checkTokenUrl, true);
    xhr.send();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        // let result = xhr.response;
        if (xhr.status === 200) {
          if (JSON.parse(xhr.response).success === true) {
            sessionStorage.userid = JSON.parse(xhr.response).obj.userid;
            sessionStorage.username = JSON.parse(xhr.response).obj.username;
            if (typeof that.callback === 'function' && that.callback) {
              that.callback();
            }
          } else if (JSON.parse(xhr.response).success === false) {
            //   Notification.error({
            //     title: '异常',
            //     message: JSON.parse(xhr.response).errorMessage,
            //   });
          } else {
            //   Notification.error({
            //     title: '异常',
            //     message: '网关' + that.url + '/check_token接口访问错误！',
            //   });
          }
        } else if (xhr.status === 401) {
          that.isTicket();
        } else {
          // Notification.error({
          //   title: '异常',
          //   message: '网关' + that.url + '/check_token接口访问错误！',
          // });
        }
      }
    };
  }

  logout() {
    const that = this;
    const logoutXHR = GetXmlHttpObject();
    logoutXHR.timeout = 3000;
    const logoutUrl = `${that.url}/user/auth/logout`;
    logoutXHR.open('GET', logoutUrl, true);
    logoutXHR.send();
    logoutXHR.onreadystatechange = () => {
      if (logoutXHR.readyState === 4) {
        const service = sessionStorage.url;
        sessionStorage.clear();
        if (
          (logoutXHR.status === 200 &&
            JSON.parse(logoutXHR.response).success === true) ||
          logoutXHR.status === 401
        ) {
          window.location.href = `${that.caslogoutURL}?service=${service}`;
        } else {
          window.location.href = `${that.caslogoutURL}?service=${service}`;
        }
      }
    };
  }

  login(directLogin?:boolean) {
    const that = this;
    this.casURL();
    const [url] = window.location.href.split('?');
    sessionStorage.url = url;
    sessionStorage.ticket = getQueryString('ticket');

    if(directLogin){
      sessionStorage.removeItem('ticket');
              window.location.href = `${that.casloginURL}?service=${sessionStorage.url}`;
    }
    // 原来的open方法
    const rawOpen = XMLHttpRequest.prototype.open;
    // 重写open方法
    XMLHttpRequest.prototype.open = function newXMLOpen() {
      rawOpen.apply(this, arguments); // eslint-disable-line

      // 自定义请求头（需要在open方法后调用）
      try {
        this.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        this.setRequestHeader('Cache-Control', 'no-cache');
      } catch (e) {
        //
      }

      // // 允许跨域携带cookie
      this.withCredentials = true;
      this.addEventListener(
        'load',
        () => {
          if (
            this.responseURL.indexOf('/user/cas/knock') === -1 &&
            this.responseURL.indexOf('/gateway/check_token') === -1 &&
            this.responseURL.indexOf('/user/auth/logout') === -1
          ) {
            if (this.status === 401) {
              sessionStorage.removeItem('ticket');
              window.location.href = `${that.casloginURL}?service=${sessionStorage.url}`;
            }
          }
        },
        false,
      );
    };
    this.checkToken();
  }
}

const cas = new CAS({
  appKey: process.env.APP_KEY,
  appSecret: process.env.APP_SECRET,
  ENV:
    process.env.DEPLOY_ENV === 'dev' || process.env.DEPLOY_ENV === 'sit'
      ? 'SIT'
      : 'PRD',
})

export default cas;
