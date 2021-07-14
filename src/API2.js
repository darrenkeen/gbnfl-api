const axios = require('axios'),
  rateLimit = require('axios-rate-limit'),
  { login: loginMeth } = require('./login'),
  userAgent = 'a4b471be-4ad2-47e2-ba0e-e1f2aa04bff9';
let ssoCookie,
  baseCookie =
    'new_SiteId=cod; ACT_SSO_LOCALE=en_US;country=US;XSRF-TOKEN=68e8b62e-1d9d-4ce1-b93f-cbe5ff31a041;API_CSRF_TOKEN=68e8b62e-1d9d-4ce1-b93f-cbe5ff31a041;',
  loggedIn = !1,
  debug = 0,
  apiAxios = axios.create({
    headers: {
      common: {
        'content-type': 'application/json',
        Cookie: baseCookie,
        userAgent: userAgent,
        'x-requested-with': userAgent,
        Accept: 'application/json, text/javascript, */*; q=0.01',
        Connection: 'keep-alive',
      },
    },
  }),
  loginAxios = apiAxios,
  defaultBaseURL = 'https://my.callofduty.com/api/papi-client/',
  defaultProfileURL = 'https://profile.callofduty.com/';

apiAxios.defaults.headers.common.Cookie =
  'XSRF-TOKEN=t6Z2XamchrSUdqpVeY5qWPvzvCf6j5Ck3XBjxtXK6_uea-ZsPCvGH9sFR71gEZCy; comid=cod; redirectUrl="http://profile.callofduty.com/cod/announcement2FA"; _abck=A305BFD4858D1F5D9D05A9845FEA25F0~0~YAAQLFfdWNhyZJt6AQAAFzZDpQYuQNCMBcF+tg78FWygeSp3wq8Wp+UdEdLmfyMmMBs+IN+zBTzXRXPuBIdXhFEVXZg1HyWWDqnPkF3+7pokihOsVG6jH9+MV0+ncN0RWb0Sgv5LXAGe+LDG7g9yr5GxD38cHoqSncLyC84Oz0nGUMKK2RUnTpGkaweeWFyXRxy0O5LSr2gP5n6m6r079A4/3n7ipBYSRlFd7ikSkj/ENoX0iD95fRjvnFHA0A6yqvKYV1v3HcDSlnFrpMsv0gHWjKuY3Cu5FwKcydnxGlRo51xLnL4PI22n6WNPgP6LHS4cuB90kzaApAsAeKTFJDS+0g1kVLq3vrBXJYeRLm2V+UHIRhTTo0rFRLC6si//LA909LlhRGybj22blZBZTXZdMOczvb7tM4CLNHc=~-1~-1~-1; bm_sz=3A0020AA12F8AC027F8F1A3C43BB38AE~YAAQLFfdWJZxZJt6AQAA4rxBpQwpkl+QKvoJZ4F0JwTt3LgEBHewpJzPkkF2WuZ5bPIDDjt3LtyXs5DgtC1hzuCin7Bv0C0Bj7VrzSJOn+8QYezkfLQs2DaGYdjE8ywEDLVtlcXQMQWczcSnX9+iF0jOW069NQQsXEcIZlZOVTj8lVbuM0CZ97G7O4O4UnLEYr++C7cgNQCsl4TH/bxN4i7NGWmDjGxufTMxssZTZfMOTcTU7zjJDdlHPi94yVNQmjrN+yB9sX+v/GyurLQPjm2t4tG4atEoUNRfguVeFkqTGlOhF0Xz~4273464~3355203; _gcl_au=1.1.983682866.1626270189; AMCVS_0FB367C2524450B90A490D4C%40AdobeOrg=1; gtm.custom.bot.flag=human; new_SiteId=cod; ACT_SSO_LOCALE=en_US; ACT_SSO_COOKIE=ODQ1NzgxNjM2NjQ4MDk1MjkxMzoxNjI3NDc5ODgyOTE5OjYyNDI0ZDIxNTg5NmRkNjVjYTViNjZiNmU1ZDExZjJj; ACT_SSO_COOKIE_EXPIRY=1627479882919; atkn=eyJhbGciOiAiQTEyOEtXIiwgImVuYyI6ICJBMTI4R0NNIiwgImtpZCI6ICJ1bm9fcHJvZF9sYXNfMSJ9.Br54cz6xWaXWfdgWyYH6a1S6hr22p8ujfwiFstH3sik2KJiRvXWo1w.Gk_Smc61p2bG3PMB.3XgjQ-JImr-bvV47KEPVCGhFgIPc2zEbhf7AsRG7Vgimg79Ym0Dh-akhCVyb8CAgaQXJue7QqIzf7naFTYB7ts4BFDLwNYMOBBHQOfzWlF20Ry63HPVGde-kDbwPeRtkuhVYT8EaQZg-1HyEsgDD_XbYq_YKUFEFQttjKOfzAGgBokwDfFDJzqpxO63NOPsAXwwRJQqc_onP63hxX_bC4PInRW5IOBgPpPQvlBvto_qmJX25inAJtG4EQ-wUHS7ABuxmgXSvrrAfIevQ2Q4ytTZq11c10M-sD0LJ_V3aT-1YCqOvO32A_I9vcuMqWViGB_LjhUclfp87WTFT2ZXOEKF9vDrJooutYqAFo4UnsD85v3Pu0KrtQhdsVvQZdSplRMENz2qDZN7dPtCFVxiKcKFCGIggmFGfwbjZvbo_WkM_kTYPbv0urKtMRduJ6MQozhAXj1FFQZK3B6xlaC4P9pu-Hkw.52b0bDiSYAY42s9vKqvkRA; ACT_SSO_REMEMBER_ME=ODQ1NzgxNjM2NjQ4MDk1MjkxMzokMmEkMTAkL0I1d0FRejRsVU1iNlZTTS5BdzFKT3VkSjJwOE9HaFhQNjdNbExiMnA5dXUwb3lmbXRWQzY; ACT_SSO_EVENT="LOGIN_SUCCESS:1626270282995"; pgacct=battle; CRM_BLOB=eyJ2ZXIiOjEsInBsYXQiOnsicCI6eyJ2IjowLCJ0Ijp7ImJvNCI6eyJtcCI6bnVsbCwieiI6bnVsbCwicHJlcyI6MC4wLCJzcCI6MC4wLCJsZXYiOjAuMH19fX19; tfa_enrollment_seen=true; AMCV_0FB367C2524450B90A490D4C%40AdobeOrg=-637568504%7CMCIDTS%7C18823%7CMCMID%7C73902666679626411140055443744510781612%7CMCAAMLH-1626875086%7C6%7CMCAAMB-1626875086%7C6G1ynYcLPuiQxYZrsz_pkqfLG9yMXBpb2zX5dvJdYQJzPXImdj0y%7CMCOPTOUT-1626277486s%7CNONE%7CMCAID%7CNONE%7CMCSYNCSOP%7C411-18830%7CvVersion%7C5.1.1%7CMCCIDH%7C-1685902251; adobeujs-optin=%7B%22aam%22%3Afalse%2C%22adcloud%22%3Afalse%2C%22aa%22%3Afalse%2C%22campaign%22%3Afalse%2C%22ecid%22%3Afalse%2C%22livefyre%22%3Afalse%2C%22target%22%3Afalse%2C%22mediaaa%22%3Afalse%7D; ssoDevId=4a092bc37e524682a574fd9a1560e8c3; atvi_dob=""; country=GB; umbrellaId=11577823795426053470; at_flavor=""; OptanonConsent=isIABGlobal=false&datestamp=Wed+Jul+14+2021+14%3A44%3A50+GMT%2B0100+(British+Summer+Time)&version=6.13.0&hosts=&consentId=b1b7a752-81c4-41e5-8e71-c7796cea0316&interactionCount=1&landingPath=NotLandingPage&groups=1%3A1%2C2%3A0%2C3%3A0%2C4%3A0&AwaitingReconsent=false';
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
      apiAxios
        .get(url)
        .then((body) => {
          403 == body.status && reject('Forbidden. You may be IP banned.'),
            1 === debug &&
              (console.log('[DEBUG]', `Build URI: ${url}`),
              console.log(
                '[DEBUG]',
                `Round trip took: ${body.headers['request-duration']}ms.`
              ),
              console.log(
                '[DEBUG]',
                `Response Size: ${JSON.stringify(body.data).length} bytes.`
              )),
            resolve(
              JSON.parse(
                body.data.replace(/^userInfo\(/, '').replace(/\);$/, '')
              )
            );
        })
        .catch((err) => reject(err));
    });
  }
  sendRequest(url) {
    console.log('here');
    return new Promise((resolve, reject) => {
      console.log('post');
      apiAxios
        .get(url)
        .then((response) => {
          1 === debug &&
            (console.log('[DEBUG]', `Build URI: ${url}`),
            console.log(
              '[DEBUG]',
              `Round trip took: ${response.headers['request-duration']}ms.`
            ),
            console.log(
              '[DEBUG]',
              `Response Size: ${
                JSON.stringify(response.data.data).length
              } bytes.`
            )),
            void 0 !== response.data.status &&
            'success' === response.data.status
              ? resolve(response.data.data)
              : reject(this.apiErrorHandling({ response: response }));
        })
        .catch((error) => {
          reject(this.apiErrorHandling(error));
        });
    });
  }
  sendPostRequest(url, data) {
    return new Promise((resolve, reject) => {
      console.log('post');
      // loggedIn || reject('Not Logged In.'),
      apiAxios
        .post(url, JSON.stringify(data))
        .then((response) => {
          1 === debug &&
            (console.log('[DEBUG]', `Build URI: ${url}`),
            console.log(
              '[DEBUG]',
              `Round trip took: ${response.headers['request-duration']}ms.`
            ),
            console.log(
              '[DEBUG]',
              `Response Size: ${
                JSON.stringify(response.data.data).length
              } bytes.`
            )),
            void 0 !== response.data.status &&
            'success' === response.data.status
              ? resolve(response.data.data)
              : reject(this.apiErrorHandling({ response: response }));
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
    if (!error) return 'We Could not get a valid reason for a failure.';
    {
      let response = error.response;
      if (!response)
        return `We Could not get a valid reason for a failure. Status: ${error}`;
      switch (response.status) {
        case 200:
          const apiErrorMessage =
            void 0 !== response.data &&
            void 0 !== response.data.data &&
            void 0 !== response.data.data.message
              ? response.data.data.message
              : void 0 !== response.message
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
    }
  }
}
module.exports = function (config = {}) {
  var module = {};
  null == config.platform && (config.platform = 'psn'),
    1 === config.debug &&
      ((debug = 1),
      apiAxios.interceptors.request.use(
        (resp) => ((resp.headers['request-startTime'] = process.hrtime()), resp)
      ),
      apiAxios.interceptors.response.use((response) => {
        const start = response.config.headers['request-startTime'],
          end = process.hrtime(start),
          milliseconds = Math.round(1e3 * end[0] + end[1] / 1e6);
        return (response.headers['request-duration'] = milliseconds), response;
      }));
  try {
    'object' == typeof config.ratelimit &&
      (apiAxios = rateLimit(apiAxios, config.ratelimit));
  } catch (Err) {
    console.warn('Could not parse ratelimit object. ignoring.');
  }
  return (
    (_helpers = new helpers()),
    (module.platforms = {
      battle: 'battle',
      steam: 'steam',
      psn: 'psn',
      xbl: 'xbl',
      acti: 'acti',
      uno: 'uno',
      all: 'all',
    }),
    (module.login = loginMeth),
    (module.BO4Stats = function (gamertag, platform = config.platform) {
      return new Promise((resolve, reject) => {
        'steam' === platform &&
          reject("Steam Doesn't exist for BO4. Try `battle` instead."),
          'battle' === platform &&
            (gamertag = _helpers.cleanClientName(gamertag));
        let urlInput = _helpers.buildUri(
          `crm/cod/v2/title/bo4/platform/${platform}/gamer/${gamertag}/profile/type/mp`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.BO4zm = function (gamertag, platform = config.platform) {
      return new Promise((resolve, reject) => {
        'steam' === platform &&
          reject("Steam Doesn't exist for BO4. Try `battle` instead."),
          'battle' === platform &&
            (gamertag = _helpers.cleanClientName(gamertag));
        let urlInput = _helpers.buildUri(
          `crm/cod/v2/title/bo4/platform/${platform}/gamer/${gamertag}/profile/type/zm`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.BO4mp = function (gamertag, platform = config.platform) {
      return new Promise((resolve, reject) => {
        'steam' === platform &&
          reject("Steam Doesn't exist for BO4. Try `battle` instead."),
          'battle' === platform &&
            (gamertag = _helpers.cleanClientName(gamertag));
        let urlInput = _helpers.buildUri(
          `crm/cod/v2/title/bo4/platform/${platform}/gamer/${gamertag}/profile/type/mp`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.BO4blackout = function (gamertag, platform = config.platform) {
      return new Promise((resolve, reject) => {
        'steam' === platform &&
          reject("Steam Doesn't exist for BO4. Try `battle` instead."),
          'battle' === platform &&
            (gamertag = _helpers.cleanClientName(gamertag));
        let urlInput = _helpers.buildUri(
          `crm/cod/v2/title/bo4/platform/${platform}/gamer/${gamertag}/profile/type/wz`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.BO4friends = function (gamertag, platform = config.platform) {
      return new Promise((resolve, reject) => {
        'steam' === platform &&
          reject("Steam Doesn't exist for BO4. Try `battle` instead."),
          'battle' === platform &&
            reject('Battlenet does not support Friends.');
        let urlInput = _helpers.buildUri(
          `leaderboards/v2/title/bo4/platform/${platform}/time/alltime/type/core/mode/career/gamer/${gamertag}/friends`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.BO4combatmp = function (gamertag, platform = config.platform) {
      return new Promise((resolve, reject) => {
        'steam' === platform &&
          reject("Steam Doesn't exist for BO4. Try `battle` instead."),
          'battle' === platform &&
            (gamertag = _helpers.cleanClientName(gamertag));
        let urlInput = _helpers.buildUri(
          `crm/cod/v2/title/bo4/platform/${platform}/gamer/${gamertag}/matches/mp/start/0/end/0/details`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.BO4combatmpdate = function (
      gamertag,
      start = 0,
      end = 0,
      platform = config.platform
    ) {
      return new Promise((resolve, reject) => {
        'steam' === platform &&
          reject("Steam Doesn't exist for BO4. Try `battle` instead."),
          'battle' === platform &&
            (gamertag = _helpers.cleanClientName(gamertag));
        let urlInput = _helpers.buildUri(
          `crm/cod/v2/title/bo4/platform/${platform}/gamer/${gamertag}/matches/mp/start/${start}/end/${end}/details`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.BO4combatzm = function (gamertag, platform = config.platform) {
      return new Promise((resolve, reject) => {
        'steam' === platform &&
          reject("Steam Doesn't exist for BO4. Try `battle` instead."),
          'battle' === platform &&
            (gamertag = _helpers.cleanClientName(gamertag));
        let urlInput = _helpers.buildUri(
          `crm/cod/v2/title/bo4/platform/${platform}/gamer/${gamertag}/matches/zombies/start/0/end/0/details`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.BO4combatzmdate = function (
      gamertag,
      start = 0,
      end = 0,
      platform = config.platform
    ) {
      return new Promise((resolve, reject) => {
        'steam' === platform &&
          reject("Steam Doesn't exist for BO4. Try `battle` instead."),
          'battle' === platform &&
            (gamertag = _helpers.cleanClientName(gamertag));
        let urlInput = _helpers.buildUri(
          `crm/cod/v2/title/bo4/platform/${platform}/gamer/${gamertag}/matches/zombies/start/${start}/end/${end}/details`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.BO4combatbo = function (gamertag, platform = config.platform) {
      return new Promise((resolve, reject) => {
        'steam' === platform &&
          reject("Steam Doesn't exist for BO4. Try `battle` instead."),
          'battle' === platform &&
            (gamertag = _helpers.cleanClientName(gamertag));
        let urlInput = _helpers.buildUri(
          `crm/cod/v2/title/bo4/platform/${platform}/gamer/${gamertag}/matches/warzone/start/0/end/0/details`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.BO4combatbodate = function (
      gamertag,
      start = 0,
      end = 0,
      platform = config.platform
    ) {
      return new Promise((resolve, reject) => {
        'steam' === platform &&
          reject("Steam Doesn't exist for BO4. Try `battle` instead."),
          'battle' === platform &&
            (gamertag = _helpers.cleanClientName(gamertag));
        let urlInput = _helpers.buildUri(
          `crm/cod/v2/title/bo4/platform/${platform}/gamer/${gamertag}/matches/warzone/start/${start}/end/${end}/details`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.BO4leaderboard = function (page, platform = config.platform) {
      return new Promise((resolve, reject) => {
        'steam' === platform &&
          reject("Steam Doesn't exist for BO4. Try `battle` instead.");
        let urlInput = _helpers.buildUri(
          `leaderboards/v2/title/bo4/platform/${platform}/time/alltime/type/core/mode/career/page/${page}`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.MWleaderboard = function (page, platform = config.platform) {
      return new Promise((resolve, reject) => {
        'steam' === platform &&
          reject("Steam Doesn't exist for MW. Try `battle` instead.");
        let urlInput = _helpers.buildUri(
          `leaderboards/v2/title/mw/platform/${platform}/time/alltime/type/core/mode/career/page/${page}`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.MWcombatmp = function (gamertag, platform = config.platform) {
      return new Promise((resolve, reject) => {
        'steam' === platform &&
          reject("Steam Doesn't exist for MW. Try `battle` instead."),
          (gamertag = _helpers.cleanClientName(gamertag));
        let lookupType = 'gamer';
        'uno' === platform && (lookupType = 'id'),
          ('uno' !== platform && 'acti' !== platform) ||
            (platform = this.platforms.uno);
        let urlInput = _helpers.buildUri(
          `crm/cod/v2/title/mw/platform/${platform}/${lookupType}/${gamertag}/matches/mp/start/0/end/0/details`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.MWcombatmpdate = function (
      gamertag,
      start = 0,
      end = 0,
      platform = config.platform
    ) {
      return new Promise((resolve, reject) => {
        'steam' === platform &&
          reject("Steam Doesn't exist for MW. Try `battle` instead."),
          (gamertag = _helpers.cleanClientName(gamertag));
        let lookupType = 'gamer';
        'uno' === platform && (lookupType = 'id'),
          ('uno' !== platform && 'acti' !== platform) ||
            (platform = this.platforms.uno);
        let urlInput = _helpers.buildUri(
          `crm/cod/v2/title/mw/platform/${platform}/${lookupType}/${gamertag}/matches/mp/start/${start}/end/${end}/details`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.MWcombatwz = function (gamertag, platform = config.platform) {
      console.log('CALLING');
      return new Promise((resolve, reject) => {
        console.log('In Promise');
        'steam' === platform &&
          reject("Steam Doesn't exist for MW. Try `battle` instead."),
          (gamertag = _helpers.cleanClientName(gamertag));
        let lookupType = 'gamer';
        'uno' === platform && (lookupType = 'id'),
          ('uno' !== platform && 'acti' !== platform) ||
            (platform = this.platforms.uno);
        let urlInput = _helpers.buildUri(
          `crm/cod/v2/title/mw/platform/${platform}/${lookupType}/${gamertag}/matches/wz/start/0/end/0/details`
        );
        console.log(urlInput);
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.MWcombatwzdate = function (
      gamertag,
      start = 0,
      end = 0,
      platform = config.platform
    ) {
      return new Promise((resolve, reject) => {
        'steam' === platform &&
          reject("Steam Doesn't exist for MW. Try `battle` instead."),
          (gamertag = _helpers.cleanClientName(gamertag));
        let lookupType = 'gamer';
        'uno' === platform && (lookupType = 'id'),
          ('uno' !== platform && 'acti' !== platform) ||
            (platform = this.platforms.uno);
        let urlInput = _helpers.buildUri(
          `crm/cod/v2/title/mw/platform/${platform}/${lookupType}/${gamertag}/matches/wz/start/${start}/end/${end}/details`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.MWfullcombatmp = function (gamertag, platform = config.platform) {
      return new Promise((resolve, reject) => {
        'steam' === platform &&
          reject("Steam Doesn't exist for MW. Try `battle` instead."),
          (gamertag = _helpers.cleanClientName(gamertag));
        let lookupType = 'gamer';
        'uno' === platform && (lookupType = 'id'),
          ('uno' !== platform && 'acti' !== platform) ||
            (platform = this.platforms.uno);
        let urlInput = _helpers.buildUri(
          `crm/cod/v2/title/mw/platform/${platform}/${lookupType}/${gamertag}/matches/mp/start/0/end/0`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.MWfullcombatmpdate = function (
      gamertag,
      start = 0,
      end = 0,
      platform = config.platform
    ) {
      return new Promise((resolve, reject) => {
        'steam' === platform &&
          reject("Steam Doesn't exist for MW. Try `battle` instead."),
          (gamertag = _helpers.cleanClientName(gamertag));
        let lookupType = 'gamer';
        'uno' === platform && (lookupType = 'id'),
          ('uno' !== platform && 'acti' !== platform) ||
            (platform = this.platforms.uno);
        let urlInput = _helpers.buildUri(
          `crm/cod/v2/title/mw/platform/${platform}/${lookupType}/${gamertag}/matches/mp/start/${start}/end/${end}`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.MWfullcombatwz = function (gamertag, platform = config.platform) {
      return new Promise((resolve, reject) => {
        'steam' === platform &&
          reject("Steam Doesn't exist for MW. Try `battle` instead."),
          (gamertag = _helpers.cleanClientName(gamertag));
        let lookupType = 'gamer';
        'uno' === platform && (lookupType = 'id'),
          ('uno' !== platform && 'acti' !== platform) ||
            (platform = this.platforms.uno);
        let urlInput = _helpers.buildUri(
          `crm/cod/v2/title/mw/platform/${platform}/${lookupType}/${gamertag}/matches/wz/start/0/end/0`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.MWfullcombatwzdate = function (
      gamertag,
      start = 0,
      end = 0,
      platform = config.platform
    ) {
      return new Promise((resolve, reject) => {
        'steam' === platform &&
          reject("Steam Doesn't exist for MW. Try `battle` instead."),
          (gamertag = _helpers.cleanClientName(gamertag));
        let lookupType = 'gamer';
        'uno' === platform && (lookupType = 'id'),
          ('uno' !== platform && 'acti' !== platform) ||
            (platform = this.platforms.uno);
        let urlInput = _helpers.buildUri(
          `crm/cod/v2/title/mw/platform/${platform}/${lookupType}/${gamertag}/matches/wz/start/${start}/end/${end}`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.MWmp = function (gamertag, platform = config.platform) {
      return new Promise((resolve, reject) => {
        'steam' === platform &&
          reject("Steam Doesn't exist for MW. Try `battle` instead."),
          (gamertag = _helpers.cleanClientName(gamertag));
        let lookupType = 'gamer';
        'uno' === platform && (lookupType = 'id'),
          ('uno' !== platform && 'acti' !== platform) ||
            (platform = this.platforms.uno);
        let urlInput = _helpers.buildUri(
          `stats/cod/v1/title/mw/platform/${platform}/${lookupType}/${gamertag}/profile/type/mp`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.MWwz = function (gamertag, platform = config.platform) {
      return new Promise((resolve, reject) => {
        'steam' === platform &&
          reject("Steam Doesn't exist for MW. Try `battle` instead."),
          (gamertag = _helpers.cleanClientName(gamertag));
        let lookupType = 'gamer';
        'uno' === platform && (lookupType = 'id'),
          ('uno' !== platform && 'acti' !== platform) ||
            (platform = this.platforms.uno);
        let urlInput = _helpers.buildUri(
          `stats/cod/v1/title/mw/platform/${platform}/${lookupType}/${gamertag}/profile/type/wz`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.MWBattleData = function (gamertag, platform = config.platform) {
      return new Promise((resolve, reject) => {
        (brDetails = {}),
          this.MWwz(gamertag, platform)
            .then((data) => {
              let lifetime = data.lifetime;
              if (void 0 !== lifetime) {
                let filtered = Object.keys(lifetime.mode)
                  .filter((x) => x.startsWith('br'))
                  .reduce(
                    (obj, key) => ((obj[key] = lifetime.mode[key]), obj),
                    {}
                  );
                void 0 !== filtered.br &&
                  ((filtered.br.properties.title = 'br'),
                  (brDetails.br = filtered.br.properties)),
                  void 0 !== filtered.br_dmz &&
                    ((filtered.br_dmz.properties.title = 'br_dmz'),
                    (brDetails.br_dmz = filtered.br_dmz.properties)),
                  void 0 !== filtered.br_all &&
                    ((filtered.br_all.properties.title = 'br_all'),
                    (brDetails.br_all = filtered.br_all.properties));
              }
              resolve(brDetails);
            })
            .catch((e) => reject(e));
      });
    }),
    (module.MWfriends = function (gamertag, platform = config.platform) {
      return new Promise((resolve, reject) => {
        'steam' === platform &&
          reject("Steam Doesn't exist for MW. Try `battle` instead."),
          'battle' === platform &&
            reject(
              'Battlenet friends are not supported. Try a different platform.'
            ),
          'uno' === platform && (gamertag = _helpers.cleanClientName(gamertag));
        let lookupType = 'gamer';
        'uno' === platform && (lookupType = 'id'),
          ('uno' !== platform && 'acti' !== platform) ||
            (platform = this.platforms.uno);
        let urlInput = _helpers.buildUri(
          `stats/cod/v1/title/mw/platform/${platform}/${lookupType}/${gamertag}/profile/friends/type/mp`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.MWWzfriends = function (gamertag, platform = config.platform) {
      return new Promise((resolve, reject) => {
        'steam' === platform &&
          reject("Steam Doesn't exist for MW. Try `battle` instead."),
          'battle' === platform &&
            reject(
              'Battlenet friends are not supported. Try a different platform.'
            ),
          'uno' === platform && (gamertag = _helpers.cleanClientName(gamertag));
        let lookupType = 'gamer';
        'uno' === platform && (lookupType = 'id'),
          ('uno' !== platform && 'acti' !== platform) ||
            (platform = this.platforms.uno);
        let urlInput = _helpers.buildUri(
          `stats/cod/v1/title/mw/platform/${platform}/${lookupType}/${gamertag}/profile/friends/type/wz`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.MWstats = function (gamertag, platform = config.platform) {
      return new Promise((resolve, reject) => {
        'steam' === platform &&
          reject("Steam Doesn't exist for MW. Try `battle` instead."),
          (gamertag = _helpers.cleanClientName(gamertag));
        let lookupType = 'gamer';
        'uno' === platform && (lookupType = 'id'),
          ('uno' !== platform && 'acti' !== platform) ||
            (platform = this.platforms.uno);
        let urlInput = _helpers.buildUri(
          `stats/cod/v1/title/mw/platform/${platform}/${lookupType}/${gamertag}/profile/type/mp`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.MWwzstats = function (gamertag, platform = config.platform) {
      return new Promise((resolve, reject) => {
        'steam' === platform &&
          reject("Steam Doesn't exist for MW. Try `battle` instead."),
          (gamertag = _helpers.cleanClientName(gamertag));
        let lookupType = 'gamer';
        'uno' === platform && (lookupType = 'id'),
          ('uno' !== platform && 'acti' !== platform) ||
            (platform = this.platforms.uno);
        let urlInput = _helpers.buildUri(
          `stats/cod/v1/title/mw/platform/${platform}/${lookupType}/${gamertag}/profile/type/wz`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.MWweeklystats = function (gamertag, platform = config.platform) {
      return new Promise((resolve, reject) => {
        (weeklyStats = {}),
          this.MWstats(gamertag, platform)
            .then((data) => {
              void 0 !== data.weekly && (weeklyStats.mp = data.weekly),
                this.MWwzstats(gamertag, platform)
                  .then((data) => {
                    void 0 !== data.weekly && (weeklyStats.wz = data.weekly),
                      resolve(weeklyStats);
                  })
                  .catch((e) => reject(e));
            })
            .catch((e) => reject(e));
      });
    }),
    (module.MWloot = function (gamertag, platform = config.platform) {
      return new Promise((resolve, reject) => {
        'steam' === platform &&
          reject("Steam Doesn't exist for MW. Try `battle` instead."),
          (gamertag = _helpers.cleanClientName(gamertag));
        let lookupType = 'gamer';
        'uno' === platform && (lookupType = 'id'),
          ('uno' !== platform && 'acti' !== platform) ||
            (platform = this.platforms.uno);
        let urlInput = _helpers.buildUri(
          `loot/title/mw/platform/${platform}/${lookupType}/${gamertag}/status/en`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.MWAnalysis = function (gamertag, platform = config.platform) {
      return new Promise((resolve, reject) => {
        'steam' === platform &&
          reject("Steam Doesn't exist for MW. Try `battle` instead."),
          (gamertag = _helpers.cleanClientName(gamertag)),
          ('uno' !== platform && 'acti' !== platform) ||
            (platform = this.platforms.uno);
        let urlInput = _helpers.buildUri(
          `ce/v2/title/mw/platform/${platform}/gametype/all/gamer/${gamertag}/summary/match_analysis/contentType/full/end/0/matchAnalysis/mobile/en`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.MWMapList = function (platform = config.platform) {
      return new Promise((resolve, reject) => {
        ('uno' !== platform && 'acti' !== platform) ||
          (platform = this.platforms.uno);
        let urlInput = _helpers.buildUri(
          `ce/v1/title/mw/platform/${platform}/gameType/mp/communityMapData/availability`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.MWFullMatchInfomp = function (matchId, platform = config.platform) {
      return new Promise((resolve, reject) => {
        ('uno' !== platform && 'acti' !== platform) ||
          (platform = this.platforms.uno);
        let urlInput = _helpers.buildUri(
          `crm/cod/v2/title/mw/platform/${platform}/fullMatch/mp/${matchId}/en`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.MWFullMatchInfowz = function (matchId, platform = config.platform) {
      return new Promise((resolve, reject) => {
        ('uno' !== platform && 'acti' !== platform) ||
          (platform = this.platforms.uno);
        let urlInput = _helpers.buildUri(
          `crm/cod/v2/title/mw/platform/${platform}/fullMatch/wz/${matchId}/en`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.CWmp = function (gamertag, platform = config.platform) {
      return new Promise((resolve, reject) => {
        'steam' === platform &&
          reject("Steam Doesn't exist for CW. Try `battle` instead."),
          (gamertag = _helpers.cleanClientName(gamertag));
        let lookupType = 'gamer';
        'uno' === platform && (lookupType = 'id'),
          ('uno' !== platform && 'acti' !== platform) ||
            (platform = this.platforms.uno);
        let urlInput = _helpers.buildUri(
          `stats/cod/v1/title/cw/platform/${platform}/${lookupType}/${gamertag}/profile/type/mp`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.CWloot = function (gamertag, platform = config.platform) {
      return new Promise((resolve, reject) => {
        'steam' === platform &&
          reject("Steam Doesn't exist for MW. Try `battle` instead."),
          (gamertag = _helpers.cleanClientName(gamertag));
        let lookupType = 'gamer';
        'uno' === platform && (lookupType = 'id'),
          ('uno' !== platform && 'acti' !== platform) ||
            (platform = this.platforms.uno);
        let urlInput = _helpers.buildUri(
          `loot/title/cw/platform/${platform}/${lookupType}/${gamertag}/status/en`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.CWAnalysis = function (gamertag, platform = config.platform) {
      return new Promise((resolve, reject) => {
        'steam' === platform &&
          reject("Steam Doesn't exist for MW. Try `battle` instead."),
          (gamertag = _helpers.cleanClientName(gamertag)),
          ('uno' !== platform && 'acti' !== platform) ||
            (platform = this.platforms.uno);
        let urlInput = _helpers.buildUri(
          `ce/v2/title/cw/platform/${platform}/gametype/all/gamer/${gamertag}/summary/match_analysis/contentType/full/end/0/matchAnalysis/mobile/en`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.CWMapList = function (platform = config.platform) {
      return new Promise((resolve, reject) => {
        ('uno' !== platform && 'acti' !== platform) ||
          (platform = this.platforms.uno);
        let urlInput = _helpers.buildUri(
          `ce/v1/title/cw/platform/${platform}/gameType/mp/communityMapData/availability`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.CWcombatmp = function (gamertag, platform = config.platform) {
      return new Promise((resolve, reject) => {
        'steam' === platform &&
          reject("Steam Doesn't exist for CW. Try `battle` instead."),
          (gamertag = _helpers.cleanClientName(gamertag));
        let lookupType = 'gamer';
        'uno' === platform && (lookupType = 'id'),
          ('uno' !== platform && 'acti' !== platform) ||
            (platform = this.platforms.uno);
        let urlInput = _helpers.buildUri(
          `crm/cod/v2/title/cw/platform/${platform}/${lookupType}/${gamertag}/matches/mp/start/0/end/0/details`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.CWcombatdate = function (
      gamertag,
      start = 0,
      end = 0,
      platform = config.platform
    ) {
      return new Promise((resolve, reject) => {
        'steam' === platform &&
          reject("Steam Doesn't exist for CW. Try `battle` instead."),
          (gamertag = _helpers.cleanClientName(gamertag));
        let lookupType = 'gamer';
        'uno' === platform && (lookupType = 'id'),
          ('uno' !== platform && 'acti' !== platform) ||
            (platform = this.platforms.uno);
        let urlInput = _helpers.buildUri(
          `crm/cod/v2/title/cw/platform/${platform}/${lookupType}/${gamertag}/matches/mp/start/${start}/end/${end}/details`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.CWFullMatchInfo = function (matchId, platform = config.platform) {
      return new Promise((resolve, reject) => {
        ('uno' !== platform && 'acti' !== platform) ||
          (platform = this.platforms.uno);
        let urlInput = _helpers.buildUri(
          `crm/cod/v2/title/cw/platform/${platform}/fullMatch/mp/${matchId}/en`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.GetPurchasablePublic = function () {
      return new Promise((resolve, reject) => {
        let urlInput = _helpers.buildUri(
          'inventory/v1/title/cw/platform/psn/purchasable/public/en'
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.getBundleInformation = function (title, bundleId) {
      return new Promise((resolve, reject) => {
        let urlInput = _helpers.buildUri(
          `inventory/v1/title/${title}/bundle/${bundleId}/en`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.friendFeed = function (gamertag, platform = config.platform) {
      return new Promise((resolve, reject) => {
        (gamertag = _helpers.cleanClientName(gamertag)),
          ('uno' !== platform && 'acti' !== platform) ||
            (platform = this.platforms.uno);
        let urlInput = _helpers.buildUri(
          `userfeed/v1/friendFeed/platform/${platform}/gamer/${gamertag}/friendFeedEvents/en`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.getEventFeed = function () {
      return new Promise((resolve, reject) => {
        let urlInput = _helpers.buildUri(
          `userfeed/v1/friendFeed/rendered/en/${ssoCookie}`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.getLoggedInIdentities = function () {
      return new Promise((resolve, reject) => {
        let urlInput = _helpers.buildUri(`crm/cod/v2/identities/${ssoCookie}`);
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.getLoggedInUserInfo = function () {
      return new Promise((resolve, reject) => {
        let urlInput = _helpers.buildProfileUri(`cod/userInfo/${ssoCookie}`);
        _helpers
          .sendRequestUserInfoOnly(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.FuzzySearch = function (query, platform = config.platform) {
      return new Promise((resolve, reject) => {
        ('battle' !== platform && 'uno' != platform && 'all' != platform) ||
          (query = _helpers.cleanClientName(query)),
          ('uno' !== platform && 'acti' !== platform) ||
            (platform = this.platforms.uno);
        let urlInput = _helpers.buildUri(
          `crm/cod/v2/platform/${platform}/username/${query}/search`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.getBattlePassInfo = function (
      gamertag,
      platform = config.platform
    ) {
      return new Promise((resolve, reject) => {
        ('battle' !== platform && 'uno' != platform && 'acti' !== platform) ||
          (gamertag = _helpers.cleanClientName(gamertag));
        let lookupType = 'gamer';
        'uno' === platform && (lookupType = 'id'),
          ('uno' !== platform && 'acti' !== platform) ||
            (platform = this.platforms.uno);
        let urlInput = _helpers.buildUri(
          `loot/title/mw/platform/${platform}/${lookupType}/${gamertag}/status/en`
        );
        console.log(urlInput),
          _helpers
            .sendRequest(urlInput)
            .then((data) => resolve(data))
            .catch((e) => reject(e));
      });
    }),
    (module.getCodPoints = function (gamertag, platform = config.platform) {
      return new Promise((resolve, reject) => {
        ('uno' !== platform && 'acti' !== platform) ||
          (platform = this.platforms.uno),
          (gamertag = _helpers.cleanClientName(gamertag));
        let urlInput = _helpers.buildUri(
          `inventory/v1/title/mw/platform/${platform}/gamer/${gamertag}/currency`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.getBattlePassLoot = function (season, platform = config.platform) {
      return new Promise((resolve, reject) => {
        ('uno' !== platform && 'acti' !== platform) ||
          (platform = this.platforms.uno);
        let urlInput = _helpers.buildUri(
          `loot/title/mw/platform/${platform}/list/loot_season_${season}/en`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.getPurchasable = function (platform = config.platform) {
      return new Promise((resolve, reject) => {
        ('uno' !== platform && 'acti' !== platform) ||
          (platform = this.platforms.uno);
        let urlInput = _helpers.buildUri(
          `inventory/v1/title/mw/platform/${platform}/purchasable`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.purchaseItem = function (
      gamertag,
      item = 'battle_pass_upgrade_bundle_4',
      platform = config.platform
    ) {
      return new Promise((resolve, reject) => {
        ('uno' !== platform && 'acti' !== platform) ||
          (platform = this.platforms.uno),
          (gamertag = _helpers.cleanClientName(gamertag));
        let urlInput = _helpers.buildUri(
          `inventory/v1/title/mw/platform/${platform}/gamer/${gamertag}/item/${item}/purchaseWith/CODPoints`
        );
        _helpers
          .sendPostRequest(urlInput, {})
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.getGiftableFriends = function (unoId, itemSku = '432000') {
      return new Promise((resolve, reject) => {
        let urlInput = _helpers.buildUri(
          `gifting/v1/title/mw/platform/uno/${unoId}/sku/${itemSku}/giftableFriends`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.sendGift = function (
      gamertag,
      recipientUnoId,
      senderUnoId,
      itemSku = '432000',
      sendingPlatform = config.platform,
      platform = config.platform
    ) {
      return new Promise((resolve, reject) => {
        let data = {
          recipientUnoId: recipientUnoId,
          senderUnoId: senderUnoId,
          sendingPlatform: sendingPlatform,
          sku: Number(itemSku),
        };
        gamertag = _helpers.cleanClientName(gamertag);
        let urlInput = _helpers.buildUri(
          `gifting/v1/title/mw/platform/${platform}/gamer/${gamertag}`
        );
        _helpers
          .sendPostRequest(urlInput, data)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.ConnectedAccounts = function (
      gamertag,
      platform = config.platform
    ) {
      return new Promise((resolve, reject) => {
        gamertag = _helpers.cleanClientName(gamertag);
        let lookupType = 'gamer';
        'uno' === platform && (lookupType = 'id'),
          ('uno' !== platform && 'acti' !== platform) ||
            (platform = this.platforms.uno);
        let urlInput = _helpers.buildUri(
          `crm/cod/v2/accounts/platform/${platform}/${lookupType}/${gamertag}`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.Presence = function (gamertag, platform = config.platform) {
      return new Promise((resolve, reject) => {
        gamertag = _helpers.cleanClientName(gamertag);
        let urlInput = _helpers.buildUri(
          `crm/cod/v2/friends/platform/${platform}/gamer/${gamertag}/presence/1/${ssoCookie}`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.Settings = function (gamertag, platform = config.platform) {
      return new Promise((resolve, reject) => {
        gamertag = _helpers.cleanClientName(gamertag);
        let urlInput = _helpers.buildUri(
          `preferences/v1/platform/${platform}/gamer/${gamertag}/list`
        );
        _helpers
          .sendRequest(urlInput)
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      });
    }),
    (module.isLoggedIn = function () {
      return true;
    }),
    (module.apiAxios = apiAxios),
    module
  );
};
