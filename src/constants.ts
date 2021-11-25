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
      end: 1628830800000,
    },
    '5': {
      start: 1628830801000,
      end: 1633496400000,
    },
    '6': {
      start: 1633496401000,
      end: 1641016800000, // Dummy date for 'Jan 01 2022 06:00:00' as no end time yet...
    },
  };

export const MODE_KEYS: Record<string, string> = {
  br_brsolo: 'BR Solos',
  br_brz_brsolo: 'BR Solos',
  br_brduos: 'BR Duos',
  br_brz_brduos: 'BR Duos',
  br_brtrios: 'BR Trios',
  br_brz_brtrios: 'BR Trios',
  br_brquads: 'BR Quads',
  br_brz_brquads: 'BR Quads',
  br_dbd_dbd: 'Iron Trial Trios',
  br_dbd_iron_trials_solos: 'Iron Trials Solos',
  br_dmz_plnbld: 'Blood Money',
  br_dmz_plunquad: 'Blood Money',
  br_reveal_dov: 'Event',
  br_rebirth_rbrthquad: 'Rebirth Quads',
  br_rebirth_rbrthtrios: 'Rebirth Trios',
  br_mini_rebirth_mini_royale_duos: 'Rebirth Mini',
  br_kingslayer_kingsltrios: 'Kingslayer Trios',
  br_kingslayer_rebirth_king_slayer: 'Kingslayer Rebirth',
  br_mini_miniroyale: 'Mini Royale',
  'br_rumble_lua_menu_mp/clash': 'Clash',
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
  'br_dbd_dbd',
  'br_dbd_iron_trials_solos',
  'br_rebirth_rbrthquad',
  'br_mini_rebirth_mini_royale_duos',
  'br_mini_miniroyale',
];

export const NON_SOLO_TROPHY_MODES = [
  'br_brduos',
  'br_brz_brduos',
  'br_brtrios',
  'br_brz_brtrios',
  'br_brquads',
  'br_brz_brquads',
  'br_dbd_dbd',
  'br_dbd_iron_trials_solos',
];

export const SOLO_TROPHY_MODES = ['br_brsolo', 'br_brz_brsolo'];

export const TROPHY_MODES = [...SOLO_TROPHY_MODES, ...NON_SOLO_TROPHY_MODES];
