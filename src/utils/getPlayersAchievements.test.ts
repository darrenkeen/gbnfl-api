import {
  AchievementModifierType,
  AchievementScope,
  AchievementType,
} from '../entities/Achievement';
import { getPlayersAchievements } from './getPlayersAchievements';

const mockAchievements: any = [
  {
    id: '1',
    createdAt: '2021-07-06T15:17:02.971Z',
    updatedAt: '2021-07-06T15:17:02.971Z',
    type: AchievementType.Kills,
    value: 10,
    modifier: 1,
    modifierType: AchievementModifierType.Achieve,
    scope: null,
    special: [],
  },
  {
    id: '2',
    createdAt: '2021-07-06T15:17:02.971Z',
    updatedAt: '2021-07-06T15:17:02.971Z',
    type: AchievementType.Killer,
    value: 1,
    modifier: 1,
    modifierType: AchievementModifierType.Achieve,
    scope: AchievementScope.Team,
    special: [],
  },
  {
    id: '3',
    createdAt: '2021-07-06T15:17:02.971Z',
    updatedAt: '2021-07-06T15:17:02.971Z',
    type: AchievementType.Gulag,
    value: 1,
    modifier: 1,
    modifierType: AchievementModifierType.Achieve,
    scope: AchievementScope.Team,
    special: [],
  },
  {
    id: '4',
    createdAt: '2021-07-06T15:17:02.971Z',
    updatedAt: '2021-07-06T15:17:02.971Z',
    type: AchievementType.Win,
    value: 1,
    modifier: 1,
    modifierType: AchievementModifierType.Achieve,
    scope: AchievementScope.Team,
    special: [],
  },
  {
    id: '5',
    createdAt: '2021-07-06T15:17:02.971Z',
    updatedAt: '2021-07-06T15:17:02.971Z',
    type: AchievementType.TopTen,
    value: 1,
    modifier: 1,
    modifierType: AchievementModifierType.Achieve,
    scope: AchievementScope.Team,
    special: [],
  },
  {
    id: '6',
    createdAt: '2021-07-06T15:17:02.971Z',
    updatedAt: '2021-07-06T15:17:02.971Z',
    type: AchievementType.Kills,
    value: 5,
    modifier: 5,
    modifierType: AchievementModifierType.Row,
    scope: null,
    special: [],
  },
  {
    id: '7',
    createdAt: '2021-07-06T15:17:02.971Z',
    updatedAt: '2021-07-06T15:17:02.971Z',
    type: AchievementType.Killer,
    value: 1,
    modifier: 5,
    modifierType: AchievementModifierType.Row,
    scope: null,
    special: [],
  },
  {
    id: '8',
    createdAt: '2021-07-06T15:17:02.971Z',
    updatedAt: '2021-07-06T15:17:02.971Z',
    type: AchievementType.Gulag,
    value: 1,
    modifier: 5,
    modifierType: AchievementModifierType.Row,
    scope: null,
    special: [],
  },
  {
    id: '9',
    createdAt: '2021-07-06T15:17:02.971Z',
    updatedAt: '2021-07-06T15:17:02.971Z',
    type: AchievementType.TopTen,
    value: 1,
    modifier: 5,
    modifierType: AchievementModifierType.Row,
    scope: null,
    special: [],
  },
  {
    id: '10',
    createdAt: '2021-07-06T15:17:02.971Z',
    updatedAt: '2021-07-06T15:17:02.971Z',
    type: AchievementType.Win,
    value: 1,
    modifier: 5,
    modifierType: AchievementModifierType.Row,
    scope: null,
    special: [],
  },
  {
    id: '11',
    createdAt: '2021-07-06T15:17:02.971Z',
    updatedAt: '2021-07-06T15:17:02.971Z',
    type: AchievementType.Kills,
    value: 50,
    modifier: 6,
    modifierType: AchievementModifierType.Last,
    scope: null,
    special: [],
  },
  {
    id: '12',
    createdAt: '2021-07-06T15:17:02.971Z',
    updatedAt: '2021-07-06T15:17:02.971Z',
    type: AchievementType.Killer,
    value: 5,
    modifier: 6,
    modifierType: AchievementModifierType.Last,
    scope: null,
    special: [],
  },
  {
    id: '13',
    createdAt: '2021-07-06T15:17:02.971Z',
    updatedAt: '2021-07-06T15:17:02.971Z',
    type: AchievementType.Gulag,
    value: 5,
    modifier: 6,
    modifierType: AchievementModifierType.Last,
    scope: null,
    special: [],
  },
  {
    id: '14',
    createdAt: '2021-07-06T15:17:02.971Z',
    updatedAt: '2021-07-06T15:17:02.971Z',
    type: AchievementType.TopTen,
    value: 5,
    modifier: 6,
    modifierType: AchievementModifierType.Last,
    scope: null,
    special: [],
  },
  {
    id: '15',
    createdAt: '2021-07-06T15:17:02.971Z',
    updatedAt: '2021-07-06T15:17:02.971Z',
    type: AchievementType.Win,
    value: 5,
    modifier: 6,
    modifierType: AchievementModifierType.Last,
    scope: null,
    special: [],
  },
];

const mockPlayer: any = {
  id: 'HFt-UbRRiu',
  createdAt: new Date('2021-03-28T02:29:47.994Z'),
  updatedAt: new Date('2021-07-04T22:01:58.752Z'),
  name: 'jaytee882',
  sbmmUrl: 'https://sbmmwarzone.com/profile/jaytee882/platform/psn',
  platformId: 'jaytee882',
  uno: '16110194213510557660',
  platformType: 'psn',
};

describe('getPlayersAchievements', () => {
  describe('Achieve', () => {
    let mockMatches: any = null;
    let matchPlayer: any = null;
    let matchPlayer2: any = null;
    beforeEach(() => {
      matchPlayer = {
        id: 'OVEIbwQJfq',
        username: 'jaytee882',
        uno: '16110194213510557660',
        clanTag: '1',
        missionsComplete: 1,
        missionStats: ['scavenger-1'],
        headshots: 0,
        assists: 1,
        scorePerMinute: 69.61077844311377,
        kills: 10,
        score: 1550,
        medalXp: 0,
        matchXp: 11110,
        scoreXp: 2750,
        wallBangs: 0,
        totalXp: 14165,
        challengeXp: 0,
        distanceTraveled: 490003.66,
        teamSurvivalTime: 1249824,
        deaths: 5,
        kdRatio: 0.4,
        objectiveBrMissionPickupTablet: 4,
        bonusXp: 0,
        gulagDeaths: 3,
        timePlayed: 1336,
        executions: 0,
        gulagKills: 1,
        nearmisses: 0,
        objectiveBrCacheOpen: 4,
        percentTimeMoving: 63.981045,
        miscXp: 0,
        longestStreak: 1,
        damageDone: 612,
        damageTaken: 1117,
      };
      matchPlayer2 = {
        id: 'OVEIbwQJfq',
        username: 'jaytee882',
        uno: '16110194213510557660',
        clanTag: '1',
        missionsComplete: 1,
        missionStats: ['scavenger-1'],
        headshots: 0,
        assists: 1,
        scorePerMinute: 69.61077844311377,
        kills: 10,
        score: 1550,
        medalXp: 0,
        matchXp: 11110,
        scoreXp: 2750,
        wallBangs: 0,
        totalXp: 14165,
        challengeXp: 0,
        distanceTraveled: 490003.66,
        teamSurvivalTime: 1249824,
        deaths: 5,
        kdRatio: 0.4,
        objectiveBrMissionPickupTablet: 4,
        bonusXp: 0,
        gulagDeaths: 3,
        timePlayed: 1336,
        executions: 0,
        gulagKills: 1,
        nearmisses: 0,
        objectiveBrCacheOpen: 4,
        percentTimeMoving: 63.981045,
        miscXp: 0,
        longestStreak: 1,
        damageDone: 612,
        damageTaken: 1117,
      };
      mockMatches = [
        {
          id: '1',
          inGameMatchId: '13737099335206809307',
          mode: 'br_brduos',
          utcStartSeconds: 1625738773,
          utcEndSeconds: 1625740465,
          teams: [
            {
              id: '332342',
              teamPlacement: 15,
              players: [
                {
                  id: 'asdasdada',
                  username: 'fdsfsfsd',
                  uno: '34243242',
                  clanTag: '',
                  missionsComplete: 1,
                  missionStats: ['scavenger-1'],
                  headshots: 2,
                  assists: 2,
                  scorePerMinute: 460.31183557760454,
                  kills: 3,
                  score: 10825,
                  medalXp: 30,
                  matchXp: 11110,
                  scoreXp: 12025,
                  wallBangs: 0,
                  totalXp: 23404,
                  challengeXp: 0,
                  distanceTraveled: 578920.56,
                  teamSurvivalTime: 1249824,
                  deaths: 2,
                  kdRatio: 1.5,
                  objectiveBrMissionPickupTablet: 4,
                  bonusXp: 0,
                  gulagDeaths: 0,
                  timePlayed: 1411,
                  executions: 0,
                  gulagKills: 1,
                  nearmisses: 0,
                  objectiveBrCacheOpen: 14,
                  percentTimeMoving: 82.40119,
                  miscXp: 0,
                  longestStreak: 3,
                  damageDone: 1390,
                  damageTaken: 318,
                },
                {
                  id: 't433fefe',
                  username: 'dayyyebbe',
                  uno: '4444334',
                  clanTag: '1',
                  missionsComplete: 1,
                  missionStats: ['scavenger-1'],
                  headshots: 0,
                  assists: 1,
                  scorePerMinute: 69.61077844311377,
                  kills: 2,
                  score: 1550,
                  medalXp: 0,
                  matchXp: 11110,
                  scoreXp: 2750,
                  wallBangs: 0,
                  totalXp: 14165,
                  challengeXp: 0,
                  distanceTraveled: 490003.66,
                  teamSurvivalTime: 1249824,
                  deaths: 5,
                  kdRatio: 0.4,
                  objectiveBrMissionPickupTablet: 4,
                  bonusXp: 0,
                  gulagDeaths: 3,
                  timePlayed: 1336,
                  executions: 0,
                  gulagKills: 1,
                  nearmisses: 0,
                  objectiveBrCacheOpen: 4,
                  percentTimeMoving: 63.981045,
                  miscXp: 0,
                  longestStreak: 1,
                  damageDone: 612,
                  damageTaken: 1117,
                } as any,
              ],
            },
            {
              id: 'fyr617MQyl',
              teamPlacement: 20,
              players: [
                matchPlayer,
                {
                  id: '0QcUzWI4E9',
                  username: 'craiggillies9',
                  uno: '10203572140187089105',
                  clanTag: '',
                  missionsComplete: 1,
                  missionStats: ['scavenger-1'],
                  headshots: 2,
                  assists: 2,
                  scorePerMinute: 460.31183557760454,
                  kills: 3,
                  score: 10825,
                  medalXp: 30,
                  matchXp: 11110,
                  scoreXp: 12025,
                  wallBangs: 0,
                  totalXp: 23404,
                  challengeXp: 0,
                  distanceTraveled: 578920.56,
                  teamSurvivalTime: 1249824,
                  deaths: 2,
                  kdRatio: 1.5,
                  objectiveBrMissionPickupTablet: 4,
                  bonusXp: 0,
                  gulagDeaths: 0,
                  timePlayed: 1411,
                  executions: 0,
                  gulagKills: 1,
                  nearmisses: 0,
                  objectiveBrCacheOpen: 14,
                  percentTimeMoving: 82.40119,
                  miscXp: 0,
                  longestStreak: 3,
                  damageDone: 1390,
                  damageTaken: 318,
                },
              ],
            },
          ],
        },
        {
          id: '2',
          inGameMatchId: '13737099335206809307',
          mode: 'br_brduos',
          utcStartSeconds: 1625738773,
          utcEndSeconds: 1625740465,
          teams: [
            {
              id: '1',
              teamPlacement: 15,
              players: [
                {
                  id: '1',
                  username: 'fdsfsfsd',
                  uno: '34243242',
                  clanTag: '',
                  missionsComplete: 1,
                  missionStats: ['scavenger-1'],
                  headshots: 2,
                  assists: 2,
                  scorePerMinute: 460.31183557760454,
                  kills: 3,
                  score: 10825,
                  medalXp: 30,
                  matchXp: 11110,
                  scoreXp: 12025,
                  wallBangs: 0,
                  totalXp: 23404,
                  challengeXp: 0,
                  distanceTraveled: 578920.56,
                  teamSurvivalTime: 1249824,
                  deaths: 2,
                  kdRatio: 1.5,
                  objectiveBrMissionPickupTablet: 4,
                  bonusXp: 0,
                  gulagDeaths: 0,
                  timePlayed: 1411,
                  executions: 0,
                  gulagKills: 1,
                  nearmisses: 0,
                  objectiveBrCacheOpen: 14,
                  percentTimeMoving: 82.40119,
                  miscXp: 0,
                  longestStreak: 3,
                  damageDone: 1390,
                  damageTaken: 318,
                },
                {
                  id: '2',
                  username: 'dayyyebbe',
                  uno: '4444334',
                  clanTag: '1',
                  missionsComplete: 1,
                  missionStats: ['scavenger-1'],
                  headshots: 0,
                  assists: 1,
                  scorePerMinute: 69.61077844311377,
                  kills: 2,
                  score: 1550,
                  medalXp: 0,
                  matchXp: 11110,
                  scoreXp: 2750,
                  wallBangs: 0,
                  totalXp: 14165,
                  challengeXp: 0,
                  distanceTraveled: 490003.66,
                  teamSurvivalTime: 1249824,
                  deaths: 5,
                  kdRatio: 0.4,
                  objectiveBrMissionPickupTablet: 4,
                  bonusXp: 0,
                  gulagDeaths: 3,
                  timePlayed: 1336,
                  executions: 0,
                  gulagKills: 1,
                  nearmisses: 0,
                  objectiveBrCacheOpen: 4,
                  percentTimeMoving: 63.981045,
                  miscXp: 0,
                  longestStreak: 1,
                  damageDone: 612,
                  damageTaken: 1117,
                } as any,
              ],
            },
            {
              id: '2',
              teamPlacement: 20,
              players: [
                matchPlayer2,
                {
                  id: '2',
                  username: 'craiggillies9',
                  uno: '10203572140187089105',
                  clanTag: '',
                  missionsComplete: 1,
                  missionStats: ['scavenger-1'],
                  headshots: 2,
                  assists: 2,
                  scorePerMinute: 460.31183557760454,
                  kills: 3,
                  score: 10825,
                  medalXp: 30,
                  matchXp: 11110,
                  scoreXp: 12025,
                  wallBangs: 0,
                  totalXp: 23404,
                  challengeXp: 0,
                  distanceTraveled: 578920.56,
                  teamSurvivalTime: 1249824,
                  deaths: 2,
                  kdRatio: 1.5,
                  objectiveBrMissionPickupTablet: 4,
                  bonusXp: 0,
                  gulagDeaths: 0,
                  timePlayed: 1411,
                  executions: 0,
                  gulagKills: 1,
                  nearmisses: 0,
                  objectiveBrCacheOpen: 14,
                  percentTimeMoving: 82.40119,
                  miscXp: 0,
                  longestStreak: 3,
                  damageDone: 1390,
                  damageTaken: 318,
                },
              ],
            },
          ],
        },
      ];
    });
    describe(`Achieve kills value 10`, () => {
      it('should return true', () => {
        matchPlayer.kills = 9;
        matchPlayer2.kills = 10;
        expect(
          getPlayersAchievements(
            mockAchievements[0],
            { withSolos: mockMatches, withoutSolos: mockMatches },
            mockPlayer
          )
        ).toEqual(true);
      });
      it('should return false', () => {
        matchPlayer.kills = 1;
        matchPlayer2.kills = 1;
        expect(
          getPlayersAchievements(
            mockAchievements[0],
            { withSolos: mockMatches, withoutSolos: mockMatches },
            mockPlayer
          )
        ).toEqual(false);
      });
    });
    describe(`Achieve highest killer in team`, () => {
      it('should return true when highest', () => {
        matchPlayer.kills = 10;
        expect(
          getPlayersAchievements(
            mockAchievements[1],
            { withSolos: mockMatches, withoutSolos: mockMatches },
            mockPlayer
          )
        ).toEqual(true);
      });
      it('should return false when not highest', () => {
        matchPlayer.kills = 1;
        matchPlayer2.kills = 1;
        expect(
          getPlayersAchievements(
            mockAchievements[0],
            { withSolos: mockMatches, withoutSolos: mockMatches },
            mockPlayer
          )
        ).toEqual(false);
      });
      it('should return false when joint highest', () => {
        matchPlayer.kills = 3;
        matchPlayer2.kills = 3;
        expect(
          getPlayersAchievements(
            mockAchievements[0],
            { withSolos: mockMatches, withoutSolos: mockMatches },
            mockPlayer
          )
        ).toEqual(false);
      });
    });
    describe(`Achieve gulag win`, () => {
      it('should return true when won', () => {
        matchPlayer.gulagKills = 0;
        matchPlayer2.gulagKills = 1;
        expect(
          getPlayersAchievements(
            mockAchievements[2],
            { withSolos: mockMatches, withoutSolos: mockMatches },
            mockPlayer
          )
        ).toEqual(true);
      });
      it('should return false when not won', () => {
        matchPlayer.gulagKills = 0;
        matchPlayer2.gulagKills = 0;
        expect(
          getPlayersAchievements(
            mockAchievements[2],
            { withSolos: mockMatches, withoutSolos: mockMatches },
            mockPlayer
          )
        ).toEqual(false);
      });
    });
    describe(`Achieve win`, () => {
      it('should return true when won', () => {
        mockMatches[0].teams[1].teamPlacement = 2;
        mockMatches[1].teams[1].teamPlacement = 1;
        expect(
          getPlayersAchievements(
            mockAchievements[3],
            { withSolos: mockMatches, withoutSolos: mockMatches },
            mockPlayer
          )
        ).toEqual(true);
      });
      it('should return false when not won', () => {
        mockMatches[0].teams[1].teamPlacement = 2;
        mockMatches[1].teams[1].teamPlacement = 2;
        expect(
          getPlayersAchievements(
            mockAchievements[3],
            { withSolos: mockMatches, withoutSolos: mockMatches },
            mockPlayer
          )
        ).toEqual(false);
      });
    });
    describe(`Achieve top 10`, () => {
      it('should return true when in top 10', () => {
        mockMatches[0].teams[1].teamPlacement = 10;
        mockMatches[1].teams[1].teamPlacement = 11;
        expect(
          getPlayersAchievements(
            mockAchievements[4],
            { withSolos: mockMatches, withoutSolos: mockMatches },
            mockPlayer
          )
        ).toEqual(true);
        mockMatches[0].teams[1].teamPlacement = 9;
        expect(
          getPlayersAchievements(
            mockAchievements[4],
            { withSolos: mockMatches, withoutSolos: mockMatches },
            mockPlayer
          )
        ).toEqual(true);
        mockMatches[0].teams[1].teamPlacement = 1;
        expect(
          getPlayersAchievements(
            mockAchievements[4],
            { withSolos: mockMatches, withoutSolos: mockMatches },
            mockPlayer
          )
        ).toEqual(true);
      });
      it('should return false when not in top 10', () => {
        mockMatches[0].teams[1].teamPlacement = 11;
        expect(
          getPlayersAchievements(
            mockAchievements[4],
            { withSolos: mockMatches, withoutSolos: mockMatches },
            mockPlayer
          )
        ).toEqual(false);
      });
    });
  });
  describe('Row', () => {
    let mockMatches: any = null;

    beforeEach(() => {
      mockMatches = [
        {
          teams: [
            {
              teamPlacement: 20,
              players: [
                {
                  uno: 12,
                  kills: 99,
                },
                {
                  uno: 14,
                  kills: 99,
                },
              ],
            },
            {
              teamPlacement: 10,
              players: [
                {
                  uno: 1,
                  kills: 99,
                },
                {
                  uno: '16110194213510557660',
                  kills: 10,
                },
              ],
            },
          ],
        },
        {
          teams: [
            {
              teamPlacement: 20,
              players: [
                {
                  uno: 12,
                  kills: 99,
                },
                {
                  uno: 14,
                  kills: 99,
                },
              ],
            },
            {
              teamPlacement: 10,
              players: [
                {
                  uno: 1,
                  kills: 99,
                },
                {
                  uno: '16110194213510557660',
                  kills: 10,
                },
              ],
            },
          ],
        },
        {
          teams: [
            {
              teamPlacement: 20,
              players: [
                {
                  uno: 12,
                  kills: 99,
                },
                {
                  uno: 14,
                  kills: 99,
                },
              ],
            },
            {
              teamPlacement: 10,
              players: [
                {
                  uno: 1,
                  kills: 99,
                },
                {
                  uno: '16110194213510557660',
                  kills: 10,
                },
              ],
            },
          ],
        },
        {
          teams: [
            {
              teamPlacement: 20,
              players: [
                {
                  uno: 12,
                  kills: 99,
                },
                {
                  uno: 14,
                  kills: 99,
                },
              ],
            },
            {
              teamPlacement: 10,
              players: [
                {
                  uno: 1,
                  kills: 99,
                },
                {
                  uno: '16110194213510557660',
                  kills: 10,
                },
              ],
            },
          ],
        },
        {
          teams: [
            {
              teamPlacement: 20,
              players: [
                {
                  uno: 12,
                  kills: 99,
                },
                {
                  uno: 14,
                  kills: 99,
                },
              ],
            },
            {
              teamPlacement: 10,
              players: [
                {
                  uno: 1,
                  kills: 99,
                },
                {
                  uno: '16110194213510557660',
                  kills: 10,
                },
              ],
            },
          ],
        },
      ];
    });
    describe(`5 in a Row kills value 5`, () => {
      it('should return true when in achieved', () => {
        expect(
          getPlayersAchievements(
            mockAchievements[5],
            { withSolos: mockMatches, withoutSolos: mockMatches },
            mockPlayer
          )
        ).toEqual(true);
      });

      it('should return true when in achieved', () => {
        mockMatches[0].teams[1].players[1].kills = 5;
        expect(
          getPlayersAchievements(
            mockAchievements[5],
            { withSolos: mockMatches, withoutSolos: mockMatches },
            mockPlayer
          )
        ).toEqual(true);
      });
      it('should return false when not achieved', () => {
        mockMatches[0].teams[1].players[1].kills = 4;
        expect(
          getPlayersAchievements(
            mockAchievements[5],
            { withSolos: mockMatches, withoutSolos: mockMatches },
            mockPlayer
          )
        ).toEqual(false);
      });
    });
    describe(`5 in a Row top killer`, () => {
      it('should return true when in achieved', () => {
        mockMatches[0].teams[1].players[1].kills = 100;
        mockMatches[1].teams[1].players[1].kills = 100;
        mockMatches[2].teams[1].players[1].kills = 100;
        mockMatches[3].teams[1].players[1].kills = 100;
        mockMatches[4].teams[1].players[1].kills = 100;
        expect(
          getPlayersAchievements(
            mockAchievements[6],
            { withSolos: mockMatches, withoutSolos: mockMatches },
            mockPlayer
          )
        ).toEqual(true);
      });
      it('should return false when not achieved', () => {
        expect(
          getPlayersAchievements(
            mockAchievements[6],
            { withSolos: mockMatches, withoutSolos: mockMatches },
            mockPlayer
          )
        ).toEqual(false);
      });
      it('should ignore matches with teams under 2 players', () => {
        mockMatches[0].teams[1].players[1].kills = 100;
        mockMatches[1].teams[1].players[1].kills = 100;
        mockMatches[1].teams[1].players = [mockMatches[1].teams[1].players[1]];
        mockMatches[2].teams[1].players[1].kills = 100;
        mockMatches[3].teams[1].players[1].kills = 100;
        mockMatches[4].teams[1].players[1].kills = 100;
        mockMatches[5] = mockMatches[1];
        expect(
          getPlayersAchievements(
            mockAchievements[6],
            { withSolos: mockMatches, withoutSolos: mockMatches },
            mockPlayer
          )
        ).toEqual(false);
      });
    });
    describe(`5 in a Row gulag wins`, () => {
      it('should return true when in achieved', () => {
        mockMatches[0].teams[1].players[1].gulagKills = 1;
        mockMatches[1].teams[1].players[1].gulagKills = 1;
        mockMatches[2].teams[1].players[1].gulagKills = 1;
        mockMatches[3].teams[1].players[1].gulagKills = 1;
        mockMatches[4].teams[1].players[1].gulagKills = 1;
        expect(
          getPlayersAchievements(
            mockAchievements[7],
            { withSolos: mockMatches, withoutSolos: mockMatches },
            mockPlayer
          )
        ).toEqual(true);
      });
      it('should return false when not achieved', () => {
        mockMatches[0].teams[1].players[1].gulagKills = 0;
        mockMatches[0].teams[1].players[1].gulagKills = 1;
        mockMatches[0].teams[1].players[1].gulagKills = 1;
        mockMatches[0].teams[1].players[1].gulagKills = 1;
        mockMatches[1].teams[1].players[1].gulagKills = 1;
        expect(
          getPlayersAchievements(
            mockAchievements[7],
            { withSolos: mockMatches, withoutSolos: mockMatches },
            mockPlayer
          )
        ).toEqual(false);
      });
    });
    describe(`5 in a Row top ten`, () => {
      it('should return true when in achieved', () => {
        mockMatches[0].teams[1].teamPlacement = 10;
        mockMatches[1].teams[1].teamPlacement = 10;
        mockMatches[2].teams[1].teamPlacement = 10;
        mockMatches[3].teams[1].teamPlacement = 10;
        mockMatches[4].teams[1].teamPlacement = 10;
        expect(
          getPlayersAchievements(
            mockAchievements[8],
            { withSolos: mockMatches, withoutSolos: mockMatches },
            mockPlayer
          )
        ).toEqual(true);
      });
      it('should return false when not achieved', () => {
        mockMatches[0].teams[1].teamPlacement = 11;
        mockMatches[1].teams[1].teamPlacement = 11;
        mockMatches[2].teams[1].teamPlacement = 11;
        mockMatches[3].teams[1].teamPlacement = 11;
        mockMatches[4].teams[1].teamPlacement = 11;
        expect(
          getPlayersAchievements(
            mockAchievements[8],
            { withSolos: mockMatches, withoutSolos: mockMatches },
            mockPlayer
          )
        ).toEqual(false);
      });
    });
    describe(`5 in a Row wins`, () => {
      it('should return true when in achieved', () => {
        mockMatches[0].teams[1].teamPlacement = 1;
        mockMatches[1].teams[1].teamPlacement = 1;
        mockMatches[2].teams[1].teamPlacement = 1;
        mockMatches[3].teams[1].teamPlacement = 1;
        mockMatches[4].teams[1].teamPlacement = 1;
        expect(
          getPlayersAchievements(
            mockAchievements[9],
            { withSolos: mockMatches, withoutSolos: mockMatches },
            mockPlayer
          )
        ).toEqual(true);
      });
      it('should return false when not achieved', () => {
        mockMatches[0].teams[1].teamPlacement = 11;
        mockMatches[1].teams[1].teamPlacement = 11;
        mockMatches[2].teams[1].teamPlacement = 11;
        mockMatches[3].teams[1].teamPlacement = 11;
        mockMatches[4].teams[1].teamPlacement = 11;
        expect(
          getPlayersAchievements(
            mockAchievements[9],
            { withSolos: mockMatches, withoutSolos: mockMatches },
            mockPlayer
          )
        ).toEqual(false);
      });
    });
  });
  describe('Last', () => {
    let mockMatches: any = null;

    beforeEach(() => {
      mockMatches = [
        {
          teams: [
            {
              teamPlacement: 20,
              players: [
                {
                  uno: 12,
                  kills: 99,
                },
                {
                  uno: 14,
                  kills: 99,
                },
              ],
            },
            {
              teamPlacement: 10,
              players: [
                {
                  uno: 1,
                  kills: 99,
                },
                {
                  uno: '16110194213510557660',
                  kills: 10,
                },
              ],
            },
          ],
        },
        {
          teams: [
            {
              teamPlacement: 20,
              players: [
                {
                  uno: 12,
                  kills: 99,
                },
                {
                  uno: 14,
                  kills: 99,
                },
              ],
            },
            {
              teamPlacement: 10,
              players: [
                {
                  uno: 1,
                  kills: 99,
                },
                {
                  uno: '16110194213510557660',
                  kills: 10,
                },
              ],
            },
          ],
        },
        {
          teams: [
            {
              teamPlacement: 20,
              players: [
                {
                  uno: 12,
                  kills: 99,
                },
                {
                  uno: 14,
                  kills: 99,
                },
              ],
            },
            {
              teamPlacement: 10,
              players: [
                {
                  uno: 1,
                  kills: 99,
                },
                {
                  uno: '16110194213510557660',
                  kills: 10,
                },
              ],
            },
          ],
        },
        {
          teams: [
            {
              teamPlacement: 20,
              players: [
                {
                  uno: 12,
                  kills: 99,
                },
                {
                  uno: 14,
                  kills: 99,
                },
              ],
            },
            {
              teamPlacement: 10,
              players: [
                {
                  uno: 1,
                  kills: 99,
                },
                {
                  uno: '16110194213510557660',
                  kills: 10,
                },
              ],
            },
          ],
        },
        {
          teams: [
            {
              teamPlacement: 55,
              players: [
                {
                  uno: 12,
                  kills: 99,
                },
                {
                  uno: 14,
                  kills: 99,
                },
              ],
            },
            {
              teamPlacement: 66,
              players: [
                {
                  uno: 1,
                  kills: 99,
                },
                {
                  uno: '16110194213510557660',
                  kills: 4,
                },
              ],
            },
          ],
        },
        {
          teams: [
            {
              teamPlacement: 77,
              players: [
                {
                  uno: 12,
                  kills: 99,
                },
                {
                  uno: 14,
                  kills: 99,
                },
              ],
            },
            {
              teamPlacement: 88,
              players: [
                {
                  uno: 1,
                  kills: 99,
                },
                {
                  uno: '16110194213510557660',
                  kills: 3,
                },
              ],
            },
          ],
        },
      ];
    });
    describe(`50 kills in the last 6`, () => {
      it('should return true when in achieved', () => {
        mockMatches[0].teams[1].players[1].kills = 10;
        mockMatches[1].teams[1].players[1].kills = 10;
        mockMatches[2].teams[1].players[1].kills = 10;
        mockMatches[3].teams[1].players[1].kills = 10;
        mockMatches[4].teams[1].players[1].kills = 10;
        expect(
          getPlayersAchievements(
            mockAchievements[10],
            { withSolos: mockMatches, withoutSolos: mockMatches },
            mockPlayer
          )
        ).toEqual(true);
        mockMatches[0].teams[1].players[1].kills = 0;
        mockMatches[1].teams[1].players[1].kills = 0;
        mockMatches[2].teams[1].players[1].kills = 0;
        mockMatches[3].teams[1].players[1].kills = 25;
        mockMatches[4].teams[1].players[1].kills = 0;
        mockMatches[5].teams[1].players[1].kills = 25;
        expect(
          getPlayersAchievements(
            mockAchievements[10],
            { withSolos: mockMatches, withoutSolos: mockMatches },
            mockPlayer
          )
        ).toEqual(true);
      });
      it('should return false when not achieved', () => {
        mockMatches[0].teams[1].players[1].kills = 9;
        expect(
          getPlayersAchievements(
            mockAchievements[10],
            { withSolos: mockMatches, withoutSolos: mockMatches },
            mockPlayer
          )
        ).toEqual(false);
      });
    });
    describe(`5 top killer in the last 6`, () => {
      it('should return true when in achieved', () => {
        mockMatches[0].teams[1].players[1].kills = 100;
        mockMatches[1].teams[1].players[1].kills = 100;
        mockMatches[2].teams[1].players[1].kills = 100;
        mockMatches[3].teams[1].players[1].kills = 100;
        mockMatches[4].teams[1].players[1].kills = 100;
        expect(
          getPlayersAchievements(
            mockAchievements[11],
            { withSolos: mockMatches, withoutSolos: mockMatches },
            mockPlayer
          )
        ).toEqual(true);
        mockMatches[3].teams[1].players[1].kills = 10;
        mockMatches[5].teams[1].players[1].kills = 100;
        expect(
          getPlayersAchievements(
            mockAchievements[11],
            { withSolos: mockMatches, withoutSolos: mockMatches },
            mockPlayer
          )
        ).toEqual(true);
      });
      it('should return false when not achieved', () => {
        expect(
          getPlayersAchievements(
            mockAchievements[11],
            { withSolos: mockMatches, withoutSolos: mockMatches },
            mockPlayer
          )
        ).toEqual(false);
      });
    });
    describe(`5 gulag wins in the last 6`, () => {
      it('should return true when in achieved', () => {
        mockMatches[0].teams[1].players[1].gulagKills = 1;
        mockMatches[1].teams[1].players[1].gulagKills = 1;
        mockMatches[2].teams[1].players[1].gulagKills = 1;
        mockMatches[3].teams[1].players[1].gulagKills = 1;
        mockMatches[4].teams[1].players[1].gulagKills = 1;
        expect(
          getPlayersAchievements(
            mockAchievements[12],
            { withSolos: mockMatches, withoutSolos: mockMatches },
            mockPlayer
          )
        ).toEqual(true);
        mockMatches[2].teams[1].players[1].gulagKills = 0;
        mockMatches[5].teams[1].players[1].gulagKills = 1;
        expect(
          getPlayersAchievements(
            mockAchievements[12],
            { withSolos: mockMatches, withoutSolos: mockMatches },
            mockPlayer
          )
        ).toEqual(true);
      });
      it('should return false when not achieved', () => {
        mockMatches[0].teams[1].players[1].gulagKills = 0;
        mockMatches[1].teams[1].players[1].gulagKills = 0;
        mockMatches[2].teams[1].players[1].gulagKills = 1;
        mockMatches[3].teams[1].players[1].gulagKills = 1;
        mockMatches[4].teams[1].players[1].gulagKills = 1;
        mockMatches[5].teams[1].players[1].gulagKills = 1;
        expect(
          getPlayersAchievements(
            mockAchievements[12],
            { withSolos: mockMatches, withoutSolos: mockMatches },
            mockPlayer
          )
        ).toEqual(false);
      });
    });
    describe(`5 top tens in the last 6`, () => {
      it('should return true when in achieved', () => {
        mockMatches[0].teams[1].teamPlacement = 10;
        mockMatches[1].teams[1].teamPlacement = 10;
        mockMatches[2].teams[1].teamPlacement = 10;
        mockMatches[3].teams[1].teamPlacement = 10;
        mockMatches[4].teams[1].teamPlacement = 10;
        expect(
          getPlayersAchievements(
            mockAchievements[13],
            { withSolos: mockMatches, withoutSolos: mockMatches },
            mockPlayer
          )
        ).toEqual(true);
        mockMatches[3].teams[1].teamPlacement = 11;
        mockMatches[5].teams[1].teamPlacement = 10;
        expect(
          getPlayersAchievements(
            mockAchievements[13],
            { withSolos: mockMatches, withoutSolos: mockMatches },
            mockPlayer
          )
        ).toEqual(true);
      });
      it('should return false when not achieved', () => {
        mockMatches[0].teams[1].teamPlacement = 11;
        mockMatches[1].teams[1].teamPlacement = 11;
        mockMatches[2].teams[1].teamPlacement = 11;
        mockMatches[3].teams[1].teamPlacement = 11;
        mockMatches[4].teams[1].teamPlacement = 11;
        expect(
          getPlayersAchievements(
            mockAchievements[13],
            { withSolos: mockMatches, withoutSolos: mockMatches },
            mockPlayer
          )
        ).toEqual(false);
      });
    });
    describe(`5 wins in the last 6`, () => {
      it('should return true when in achieved', () => {
        mockMatches[0].teams[1].teamPlacement = 1;
        mockMatches[1].teams[1].teamPlacement = 1;
        mockMatches[2].teams[1].teamPlacement = 1;
        mockMatches[3].teams[1].teamPlacement = 1;
        mockMatches[4].teams[1].teamPlacement = 1;
        expect(
          getPlayersAchievements(
            mockAchievements[14],
            { withSolos: mockMatches, withoutSolos: mockMatches },
            mockPlayer
          )
        ).toEqual(true);
        mockMatches[3].teams[1].teamPlacement = 10;
        mockMatches[5].teams[1].teamPlacement = 1;
        expect(
          getPlayersAchievements(
            mockAchievements[14],
            { withSolos: mockMatches, withoutSolos: mockMatches },
            mockPlayer
          )
        ).toEqual(true);
      });
      it('should return false when not achieved', () => {
        mockMatches[0].teams[1].teamPlacement = 11;
        mockMatches[0].teams[1].teamPlacement = 11;
        mockMatches[0].teams[1].teamPlacement = 11;
        mockMatches[0].teams[1].teamPlacement = 11;
        mockMatches[1].teams[1].teamPlacement = 11;
        expect(
          getPlayersAchievements(
            mockAchievements[14],
            { withSolos: mockMatches, withoutSolos: mockMatches },
            mockPlayer
          )
        ).toEqual(false);
      });
    });
  });
});
