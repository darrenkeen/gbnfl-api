export const __prod__ = process.env.NODE_ENV !== 'production';
export const COOKIE_NAME = 'GBNFL_AUTH';

export const SEASON_START_END: Record<string, { start: number; end: number }> =
  {
    '2': {
      start: 1614297600000,
      end: 1619064000000,
    },
    '3': {
      start: 1619064001000,
      end: 1623902400000,
    },
    '4': {
      start: 1623902401000,
      end: 1630454400000, // Dummy date for 'Sep 01 2021 01:00:00' as no end time yet...
    },
  };

export const MODE_KEYS = {
  all: 'All',
  br_brsolo: 'Solos',
  br_brz_brsolo: 'Solos',
  br_brduos: 'Duos',
  br_brz_brduos: 'Duos',
  br_brtrios: 'Trios',
  br_brz_brtrios: 'Trios',
  br_brquads: 'Quads',
  br_brz_brquads: 'Quads',
  br_dmz_plnbld: 'Blood Money',
  br_dmz_plunquad: 'Blood Money',
  br_reveal_dov: 'Event',
  br_rebirth_rbrthquad: 'Rebirth',
  br_mini_rebirth_mini_royale_duos: 'Rebirth Mini',
  br_kingslayer_kingsltrios: 'Kingslayer Trios',
  br_mini_miniroyale: 'Mini Royale',
};

export const WITH_RANK_SOLO_MODE = ['br_brsolo', 'br_brz_brsolo'];

export const WITH_RANK_MODE = [
  ...WITH_RANK_SOLO_MODE,
  'br_brduos',
  'br_brz_brduos',
  'br_brtrios',
  'br_brz_brtrios',
  'br_brquads',
  'br_brz_brquads',
  'br_rebirth_rbrthquad',
  'br_mini_rebirth_mini_royale_duos',
  'br_mini_miniroyale',
];

export const TROPHY_MODES = [
  'br_brsolo',
  'br_brz_brsolo',
  'br_brduos',
  'br_brz_brduos',
  'br_brtrios',
  'br_brz_brtrios',
  'br_brquads',
  'br_brz_brquads',
];
