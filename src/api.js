const axios = require('axios'),
  rateLimit = require('axios-rate-limit'),
  userAgent = 'a4b471be-4ad2-47e2-ba0e-e1f2aa04bff9';
let ssoCookie,
  baseCookie =
    'XSRF-TOKEN=xT5Z2wSsbrQWGyUNNFFBzwI2d85WAf6R9W60euXxaAUNPL6imSc_9nBqDvDeYPj4; comid=cod; bm_sz=4E2CAFF4D0BDE0D82A56FE35469E975E~YAAQV1fdWOwnlxl6AQAACjf7pgxK0MmVU2Nj4wwb499LzwiNDymhOHVPeCsPuHAgHNKGXaf3cOAcLsJxSjNnyFNSGSfuAPUllDOXV/Y72CXE5M4PMHFfUS5CeujSuiCQyMSblsSf6snrb6PRmqyN7vu7ypaDDrVU4DCSkEfmBgjLcmPW5KRGRQXanTRPmI7IbwMK7AuCLzSRi3w81FYlqYvIGcjn91QPNfDjMmA+HaA4iZb5Ov9uv24JrcAa57/BQmx/Vs3vBOaMdAbB9G8ezsk1QLKVGv0J+RyAeI8b9aeuheCqwJYI~3224627~3748149; new_SiteId=cod; ACT_SSO_LOCALE=en_US; ACT_SSO_COOKIE=ODQ1NzgxNjM2NjQ4MDk1MjkxMzoxNjI3NTA4NzM0MzM4OjVjYzI0MzI5MmMyNDljMDY4NWIwY2EyZWY2OGM1MjNj; ACT_SSO_COOKIE_EXPIRY=1627508734338; atkn=eyJhbGciOiAiQTEyOEtXIiwgImVuYyI6ICJBMTI4R0NNIiwgImtpZCI6ICJ1bm9fcHJvZF9sYXNfMSJ9.AogpVebBtQAzKvFBoGF8072GG0ufN5lXDmZOfOr1JH_7zQZSYhhViw.FvipqdCaxrC8DFyv.p9e66s4a8HSxLBHF3_PwteqPL3TGwTDekxIXpTYr0iR_45Kh86aJbE835WYTX_exEfmI00spo6m62VLqfT7NiPLctvqboU4FmzrpH4cfqIF2vlLGp8rFs4wvGsh29v2GPig3oBMOP_ElnPIy_n7iA5bJU9O4wH6baRFc-DPK-Sdd7XfiVPhm6y0txfnB9vf3VEFPtqii5Qn8gZ8YuxIxstQ2b_HHiqm_zn4MpuIR5xHGFi78VDykvmYg7irv93ZbkoqGlfZrQIBne93T_j5eL269CJmPOnDIAwsnbLW-80zoWf39PYzyTjhiZw8S6eNj5IYx-maAcFGNlFyfsLxzosofh1MOgIJ2MaEzLc41cMEpDnhLsMYSsv1v5zTmFoSjfLKjvGX5gdNKVZS934QuxHPA25-1Tg8-l8T_jIXOB1QHMPHS1OcT3fiQypQ3cfD41hUXJCANyNopsBbHu3nv-hIfmrU.MbOpHGz0-ApGZ9c-pUi15g; ACT_SSO_REMEMBER_ME=ODQ1NzgxNjM2NjQ4MDk1MjkxMzokMmEkMTAkbVMxQjFFZFpScGttS09WSkx1QmVzdUVOSGxGcHlhTEhrcFN6THR6WFZFZmJkTlh6WXRKU3k; ACT_SSO_EVENT="LOGIN_SUCCESS:1626299134415"',
  loggedIn = true,
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
  loginURL = 'https://profile.callofduty.com/cod/mapp/',
  defaultProfileURL = 'https://profile.callofduty.com/';
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
      loggedIn || reject('Not Logged In.'),
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
    return new Promise((resolve, reject) => {
      loggedIn || reject('Not Logged In.'),
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
                : reject(this.apiErrorHandling(response));
          })
          .catch((error) => {
            reject(this.apiErrorHandling(error.response));
          });
    });
  }
  sendPostRequest(url, data) {
    return new Promise((resolve, reject) => {
      loggedIn || reject('Not Logged In.'),
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
                : reject(this.apiErrorHandling(response));
          })
          .catch((error) => {
            reject(this.apiErrorHandling(error.response));
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
          reject(this.apiErrorHandling(error.response));
        });
    });
  }
  apiErrorHandling(response) {
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
    console.log('Could not parse ratelimit object. ignoring.');
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
      unoid: 'uno',
      all: 'all',
    }),
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
      return new Promise((resolve, reject) => {
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
      return loggedIn;
    }),
    (module.apiAxios = apiAxios),
    module
  );
};
