import { fade } from '@material-ui/core';
import palette from './palette';

// ----------------------------------------------------------------------

const BASE_LIGHT = palette.light.grey[500];
const BASE_DARK = '#000000';

const PRIMARY = `0 8px 16px 0 ${fade(palette.light.primary.main, 0.24)}`;
const INFO = `0 8px 16px 0 ${fade(palette.light.info.main, 0.24)}`;
const SUCCESS = `0 8px 16px 0 ${fade(palette.light.success.main, 0.24)}`;
const WARNING = `0 8px 16px 0 ${fade(palette.light.warning.main, 0.24)}`;
const ERROR = `0 8px 16px 0 ${fade(palette.light.error.main, 0.24)}`;

const onLight1 = fade(BASE_LIGHT, 0.2);
const onLight2 = fade(BASE_LIGHT, 0.14);
const onLight3 = fade(BASE_LIGHT, 0.12);

const onDark1 = fade(BASE_DARK, 0.2);
const onDark2 = fade(BASE_DARK, 0.14);
const onDark3 = fade(BASE_DARK, 0.12);

const Shadows = {
  light: [
    'none',
    `0px 2px 1px -1px ${onLight1},0px 1px 1px 0px ${onLight2},0px 1px 3px 0px ${onLight3}`,
    `0px 3px 1px -2px ${onLight1},0px 2px 2px 0px ${onLight2},0px 1px 5px 0px ${onLight3}`,
    `0px 3px 3px -2px ${onLight1},0px 3px 4px 0px ${onLight2},0px 1px 8px 0px ${onLight3}`,
    `0px 2px 4px -1px ${onLight1},0px 4px 5px 0px ${onLight2},0px 1px 10px 0px ${onLight3}`,
    `0px 3px 5px -1px ${onLight1},0px 5px 8px 0px ${onLight2},0px 1px 14px 0px ${onLight3}`,
    `0px 3px 5px -1px ${onLight1},0px 6px 10px 0px ${onLight2},0px 1px 18px 0px ${onLight3}`,
    `0px 4px 5px -2px ${onLight1},0px 7px 10px 1px ${onLight2},0px 2px 16px 1px ${onLight3}`,
    `0px 5px 5px -3px ${onLight1},0px 8px 10px 1px ${onLight2},0px 3px 14px 2px ${onLight3}`,
    `0px 5px 6px -3px ${onLight1},0px 9px 12px 1px ${onLight2},0px 3px 16px 2px ${onLight3}`,
    `0px 6px 6px -3px ${onLight1},0px 10px 14px 1px ${onLight2},0px 4px 18px 3px ${onLight3}`,
    `0px 6px 7px -4px ${onLight1},0px 11px 15px 1px ${onLight2},0px 4px 20px 3px ${onLight3}`,
    `0px 7px 8px -4px ${onLight1},0px 12px 17px 2px ${onLight2},0px 5px 22px 4px ${onLight3}`,
    `0px 7px 8px -4px ${onLight1},0px 13px 19px 2px ${onLight2},0px 5px 24px 4px ${onLight3}`,
    `0px 7px 9px -4px ${onLight1},0px 14px 21px 2px ${onLight2},0px 5px 26px 4px ${onLight3}`,
    `0px 8px 9px -5px ${onLight1},0px 15px 22px 2px ${onLight2},0px 6px 28px 5px ${onLight3}`,
    `0px 8px 10px -5px ${onLight1},0px 16px 24px 2px ${onLight2},0px 6px 30px 5px ${onLight3}`,
    `0px 8px 11px -5px ${onLight1},0px 17px 26px 2px ${onLight2},0px 6px 32px 5px ${onLight3}`,
    `0px 9px 11px -5px ${onLight1},0px 18px 28px 2px ${onLight2},0px 7px 34px 6px ${onLight3}`,
    `0px 9px 12px -6px ${onLight1},0px 19px 29px 2px ${onLight2},0px 7px 36px 6px ${onLight3}`,
    `0px 10px 13px -6px ${onLight1},0px 20px 31px 3px ${onLight2},0px 8px 38px 7px ${onLight3}`,
    `0px 10px 13px -6px ${onLight1},0px 21px 33px 3px ${onLight2},0px 8px 40px 7px ${onLight3}`,
    `0px 10px 14px -6px ${onLight1},0px 22px 35px 3px ${onLight2},0px 8px 42px 7px ${onLight3}`,
    `0px 11px 14px -7px ${onLight1},0px 23px 36px 3px ${onLight2},0px 9px 44px 8px ${onLight3}`,
    `0px 11px 15px -7px ${onLight1},0px 24px 38px 3px ${onLight2},0px 9px 46px 8px ${onLight3}`,
    // Custom
    {
      z1: `0 1px 2px 0 ${fade(BASE_LIGHT, 0.24)}`,
      z8: `0 8px 16px 0 ${fade(BASE_LIGHT, 0.24)}`,
      z12: `0 0 2px 0 ${fade(BASE_LIGHT, 0.24)}, 0 12px 24px 0 ${fade(
        BASE_LIGHT,
        0.24
      )}`,
      z16: `0 0 2px 0 ${fade(BASE_LIGHT, 0.24)}, 0 16px 32px -4px ${fade(
        BASE_LIGHT,
        0.24
      )}`,
      z20: `0 0 2px 0 ${fade(BASE_LIGHT, 0.24)}, 0 20px 40px -4px ${fade(
        BASE_LIGHT,
        0.24
      )}`,
      z24: `0 0 4px 0 ${fade(BASE_LIGHT, 0.24)}, 0 24px 48px 0 ${fade(
        BASE_LIGHT,
        0.24
      )}`,
      primary: PRIMARY,
      info: INFO,
      success: SUCCESS,
      warning: WARNING,
      error: ERROR
    }
  ],
  dark: [
    'none',
    `0px 2px 1px -1px ${onDark1},0px 1px 1px 0px ${onDark2},0px 1px 3px 0px ${onDark3}`,
    `0px 3px 1px -2px ${onDark1},0px 2px 2px 0px ${onDark2},0px 1px 5px 0px ${onDark3}`,
    `0px 3px 3px -2px ${onDark1},0px 3px 4px 0px ${onDark2},0px 1px 8px 0px ${onDark3}`,
    `0px 2px 4px -1px ${onDark1},0px 4px 5px 0px ${onDark2},0px 1px 10px 0px ${onDark3}`,
    `0px 3px 5px -1px ${onDark1},0px 5px 8px 0px ${onDark2},0px 1px 14px 0px ${onDark3}`,
    `0px 3px 5px -1px ${onDark1},0px 6px 10px 0px ${onDark2},0px 1px 18px 0px ${onDark3}`,
    `0px 4px 5px -2px ${onDark1},0px 7px 10px 1px ${onDark2},0px 2px 16px 1px ${onDark3}`,
    `0px 5px 5px -3px ${onDark1},0px 8px 10px 1px ${onDark2},0px 3px 14px 2px ${onDark3}`,
    `0px 5px 6px -3px ${onDark1},0px 9px 12px 1px ${onDark2},0px 3px 16px 2px ${onDark3}`,
    `0px 6px 6px -3px ${onDark1},0px 10px 14px 1px ${onDark2},0px 4px 18px 3px ${onDark3}`,
    `0px 6px 7px -4px ${onDark1},0px 11px 15px 1px ${onDark2},0px 4px 20px 3px ${onDark3}`,
    `0px 7px 8px -4px ${onDark1},0px 12px 17px 2px ${onDark2},0px 5px 22px 4px ${onDark3}`,
    `0px 7px 8px -4px ${onDark1},0px 13px 19px 2px ${onDark2},0px 5px 24px 4px ${onDark3}`,
    `0px 7px 9px -4px ${onDark1},0px 14px 21px 2px ${onDark2},0px 5px 26px 4px ${onDark3}`,
    `0px 8px 9px -5px ${onDark1},0px 15px 22px 2px ${onDark2},0px 6px 28px 5px ${onDark3}`,
    `0px 8px 10px -5px ${onDark1},0px 16px 24px 2px ${onDark2},0px 6px 30px 5px ${onDark3}`,
    `0px 8px 11px -5px ${onDark1},0px 17px 26px 2px ${onDark2},0px 6px 32px 5px ${onDark3}`,
    `0px 9px 11px -5px ${onDark1},0px 18px 28px 2px ${onDark2},0px 7px 34px 6px ${onDark3}`,
    `0px 9px 12px -6px ${onDark1},0px 19px 29px 2px ${onDark2},0px 7px 36px 6px ${onDark3}`,
    `0px 10px 13px -6px ${onDark1},0px 20px 31px 3px ${onDark2},0px 8px 38px 7px ${onDark3}`,
    `0px 10px 13px -6px ${onDark1},0px 21px 33px 3px ${onDark2},0px 8px 40px 7px ${onDark3}`,
    `0px 10px 14px -6px ${onDark1},0px 22px 35px 3px ${onDark2},0px 8px 42px 7px ${onDark3}`,
    `0px 11px 14px -7px ${onDark1},0px 23px 36px 3px ${onDark2},0px 9px 44px 8px ${onDark3}`,
    `0px 11px 15px -7px ${onDark1},0px 24px 38px 3px ${onDark2},0px 9px 46px 8px ${onDark3}`,
    // Custums
    {
      z1: `0 1px 2px 0 ${fade(BASE_DARK, 0.24)}`,
      z8: `0 8px 16px 0 ${fade(BASE_DARK, 0.24)}`,
      z12: `0 0 2px 0 ${fade(BASE_DARK, 0.24)}, 0 12px 24px 0 ${fade(
        BASE_DARK,
        0.24
      )}`,
      z16: `0 0 2px 0 ${fade(BASE_DARK, 0.24)}, 0 16px 32px -4px ${fade(
        BASE_DARK,
        0.24
      )}`,
      z20: `0 0 2px 0 ${fade(BASE_DARK, 0.24)}, 0 20px 40px -4px ${fade(
        BASE_DARK,
        0.24
      )}`,
      z24: `0 0 4px 0 ${fade(BASE_DARK, 0.24)}, 0 24px 48px 0 ${fade(
        BASE_DARK,
        0.24
      )}`,
      primary: PRIMARY,
      info: INFO,
      success: SUCCESS,
      warning: WARNING,
      error: ERROR
    }
  ]
};

export default Shadows;
