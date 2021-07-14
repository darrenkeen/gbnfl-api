const axios = require('axios');
const setCookie = require('set-cookie-parser');

const userAgent = 'a4b471be-4ad2-47e2-ba0e-e1f2aa04bff9';
let baseCookie = 'new_SiteId=cod;';
let ssoCookie;
let loggedIn = false;
let debug = 0;

let apiAxios = axios.create({
  headers: {
    common: {
      'content-type': 'application/json',
      Cookie: baseCookie,
      userAgent: userAgent,
      'x-requested-with': userAgent,
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      Connection: 'keep-alive',
    },
  },
});

let loginAxios = apiAxios;
let defaultBaseURL = 'https://my.callofduty.com/api/papi-client/';
let loginURL = 'https://profile.callofduty.com/cod/mapp/';
let defaultProfileURL = 'https://profile.callofduty.com/';

class helpers {
  buildUri(str) {
    return `${defaultBaseURL}${str}`;
  }

  buildProfileUri(str) {
    return `${defaultProfileURL}${str}`;
  }

  cleanClientName(gamertag) {
    return encodeURIComponent(gamertag);
  }

  sendRequestUserInfoOnly(url) {
    return new Promise((resolve, reject) => {
      if (!loggedIn) reject('Not Logged In.');
      apiAxios
        .get(url)
        .then((body) => {
          if (body.status == 403) reject('Forbidden. You may be IP banned.');
          if (debug === 1) {
            console.log(`[DEBUG]`, `Build URI: ${url}`);
            console.log(
              `[DEBUG]`,
              `Round trip took: ${body.headers['request-duration']}ms.`
            );
            console.log(
              `[DEBUG]`,
              `Response Size: ${JSON.stringify(body.data).length} bytes.`
            );
          }
          resolve(
            JSON.parse(body.data.replace(/^userInfo\(/, '').replace(/\);$/, ''))
          );
        })
        .catch((err) => reject(err));
    });
  }

  sendRequest(url) {
    return new Promise((resolve, reject) => {
      if (!loggedIn) reject('Not Logged In.');
      apiAxios
        .get(url)
        .then((response) => {
          if (debug === 1) {
            console.log(`[DEBUG]`, `Build URI: ${url}`);
            console.log(
              `[DEBUG]`,
              `Round trip took: ${response.headers['request-duration']}ms.`
            );
            console.log(
              `[DEBUG]`,
              `Response Size: ${
                JSON.stringify(response.data.data).length
              } bytes.`
            );
          }

          if (
            response.data.status !== undefined &&
            response.data.status === 'success'
          ) {
            resolve(response.data.data);
          } else {
            reject(this.apiErrorHandling({ response: response }));
          }
        })
        .catch((error) => {
          reject(this.apiErrorHandling(error));
        });
    });
  }

  sendPostRequest(url, data) {
    return new Promise((resolve, reject) => {
      if (!loggedIn) reject('Not Logged In.');
      apiAxios
        .post(url, JSON.stringify(data))
        .then((response) => {
          if (debug === 1) {
            console.log(`[DEBUG]`, `Build URI: ${url}`);
            console.log(
              `[DEBUG]`,
              `Round trip took: ${response.headers['request-duration']}ms.`
            );
            console.log(
              `[DEBUG]`,
              `Response Size: ${
                JSON.stringify(response.data.data).length
              } bytes.`
            );
          }

          if (
            response.data.status !== undefined &&
            response.data.status === 'success'
          ) {
            resolve(response.data.data);
          } else {
            reject(this.apiErrorHandling({ response: response }));
          }
        })
        .catch((error) => {
          reject(this.apiErrorHandling(error));
        });
    });
  }

  postReq(url, data, headers = null) {
    return new Promise((resolve, reject) => {
      loginAxios
        .post(url, data, headers)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(this.apiErrorHandling(error));
        });
    });
  }

  apiErrorHandling(error) {
    if (!!error) {
      let response = error.response;
      if (!!response) {
        switch (response.status) {
          case 200:
            const apiErrorMessage =
              response.data !== undefined &&
              response.data.data !== undefined &&
              response.data.data.message !== undefined
                ? response.data.data.message
                : response.message !== undefined
                ? response.message
                : 'No error returned from API.';
            switch (apiErrorMessage) {
              case 'Not permitted: user not found':
                return '404 - Not found. Incorrect username or platform? Misconfigured privacy settings?';
              case 'Not permitted: rate limit exceeded':
                return '429 - Too many requests. Try again in a few minutes.';
              case 'Error from datastore':
                return '500 - Internal server error. Request failed, try again.';
              default:
                return apiErrorMessage;
            }
            break;
          case 401:
            return '401 - Unauthorized. Incorrect username or password.';
          case 403:
            return '403 - Forbidden. You may have been IP banned. Try again in a few minutes.';
          case 500:
            return '500 - Internal server error. Request failed, try again.';
          case 502:
            return '502 - Bad gateway. Request failed, try again.';
          default:
            return `We Could not get a valid reason for a failure. Status: ${response.status}`;
        }
      } else {
        return `We Could not get a valid reason for a failure. Status: ${error}`;
      }
    } else {
      return `We Could not get a valid reason for a failure.`;
    }
  }
}

module.exports.login = (username, password) => {
  _helpers = new helpers();

  loginAxios.interceptors.request.use((resp) => {
    resp.headers['request-startTime'] = process.hrtime();
    return resp;
  });
  loginAxios.interceptors.response.use((response) => {
    const start = response.config.headers['request-startTime'];
    const end = process.hrtime(start);
    const milliseconds = Math.round(end[0] * 1000 + end[1] / 1000000);
    response.headers['request-duration'] = milliseconds;
    return response;
  });

  return new Promise(async (resolve, reject) => {
    let data = new URLSearchParams({ email: encodeURIComponent(username) });
    console.log(data);
    const b =
      'OptanonConsent=consentId=cb32cea2-2697-4afb-93fd-3d3fb51b18bc&datestamp=Wed+Jul+14+2021+12%3A37%3A31+GMT%2B0100+(British+Summer+Time)&version=6.13.0&interactionCount=1; ';
    loginAxios.defaults.headers.common['userAgent'] =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:90.0) Gecko/20100101 Firefox/90.0';

    let response = await loginAxios.get(
      'https://profile.callofduty.com/cod/login'
    );

    const tempCookies = setCookie.parse(response, {
      decodeValues: true,
      map: true,
    });

    const req = ['XSRF-TOKEN', 'bm_sz'];

    if (!tempCookies[req[0]] || !tempCookies[req[1]]) {
      throw new Error('missing cookie');
    }
    console.log(tempCookies[req[1]].value);
    tempCookies['XSRF-TOKEN'].value =
      'icUwm-EwMNgSFlbkgVuHi5tBZcfZ0zAosVAFD_nwBiRsN8bonUDIsuQrh6lGL6nS';

    loginAxios.defaults.headers.common['content-type'] =
      'application/x-www-form-urlencoded';

    // loginAxios.defaults.headers.common[
    //   'Cookie'
    // ] = `XSRF-TOKEN=${tempCookies['XSRF-TOKEN'].value}; bm_sz=91256A2F6B96D4EC30DE78462111711A~YAAQLFfdWLFlZJt6AQAA8KI5pQx19179pv5pUQqj3zcn+QQrF9kBA4MKS9YLrrIoltZcbSIhKVzOjrF5OeB5xq5gCZbBQhVMX5CEHuHmAuEY8q5wMRKcoGkCwazggpY9v2TKcJMGhnUymKHAd0u62JgFFY4lyzkA2hA8Z/70BiKbvuTkuhh9UuMvCljXtIfNKZZSCmyGeFaQt02BSHU7u/GzDcBNWYnkiIjSs2K/+RyRtd4B56iKMNr1krQHIpYDBW/lBILT1J4pnOMKp+S7NETL7whrd2558mxkh9zhUgpPhM+PKbab~3163460~3552823; new_SiteId=cod; ACT_SSO_LOCALE=en_US; gtm.custom.bot.flag=human; comid=cod;`;
    console.log(loginAxios.defaults.headers.common['Cookie']);
    data = new URLSearchParams({
      username: encodeURIComponent(username),
      password,
      remember_me: true,
      _csrf: tempCookies['XSRF-TOKEN'].value,
    });
    data = decodeURIComponent(data);
    console.log(data);
    resolve();
    // ISSUE WITH XSRF TOKEN IN COOKIES AND _csrf. Replacing with browser values works so need to find where they are coming from.
    // await loginAxios
    //   .post(
    //     'https://profile.callofduty.com/do_login',

    //     data
    //   )
    //   .then((re) => {
    //     console.log('DONE');
    //     console.log(re);
    //     apiAxios.defaults.headers.common.Cookie = `${baseCookie}${re.headers[
    //       'set-cookie'
    //     ].join(';')}`;
    //     resolve();
    //   })
    //   .catch((e) => console.log(e));
  });
};
