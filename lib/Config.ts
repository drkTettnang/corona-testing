
export default class Config {
    private static getNumber(value: string, defaultValue: number): number {
        const parsedValue = parseInt(value, 10);

        return isNaN(parsedValue) ? defaultValue : parsedValue;
    }

    public static readonly MAX_CHILDREN = Config.getNumber(process.env.NEXT_PUBLIC_MAX_CHILDREN, 3);

    public static readonly MAX_ADULTS = Config.getNumber(process.env.NEXT_PUBLIC_MAX_ADULTS, 2);

    public static readonly MAX_GROUP = Config.getNumber(process.env.NEXT_PUBLIC_MAX_GROUP, 100);

    public static readonly MAX_DATES = Config.getNumber(process.env.NEXT_PUBLIC_MAX_DATES, -1);

    public static readonly MAX_DATES_PER_WEEK = Config.getNumber(process.env.NEXT_PUBLIC_MAX_DATES_PER_WEEK, -1);

    public static readonly MIN_AGE = Config.getNumber(process.env.NEXT_PUBLIC_MIN_AGE, 0);

    public static readonly MIN_PUBLIC_ID = Config.getNumber(process.env.NEXT_PUBLIC_MIN_PUBLIC_ID, 10000);

    public static readonly LEGACY_MIN_PUBLIC_ID = Config.getNumber(process.env.NEXT_PUBLIC_LEGACY_MIN_PUBLIC_ID || process.env.NEXT_PUBLIC_MIN_PUBLIC_ID, 10000);

    public static readonly HOMEPAGE = process.env.NEXT_PUBLIC_HOMEPAGE || '#';

    public static readonly HOMEPAGE_LEGAL = process.env.NEXT_PUBLIC_HOMEPAGE_LEGAL || '#';

    public static readonly HOMEPAGE_PRIVACY = process.env.NEXT_PUBLIC_HOMEPAGE_PRIVACY || '/data-protection';

    public static readonly CONTACT_MAIL = process.env.NEXT_PUBLIC_CONTACT_MAIL || 'mail@localhost';

    public static readonly VENDOR_NAME = process.env.NEXT_PUBLIC_VENDOR_NAME || 'DRK Ortsverein Musterstadt e.V.';

    public static readonly VENDOR_ADDRESS = (process.env.NEXT_PUBLIC_VENDOR_ADDRESS || '').split('\\n');

    public static readonly CAR = (process.env.NEXT_CAR || 'no') === 'yes';

    public static readonly MAINTENANCE_MESSAGE = process.env.NEXT_PUBLIC_MAINTENANCE_MESSAGE || '';

    public static readonly MAX_DAYS = Config.getNumber(process.env.NEXT_PUBLIC_MAX_DAYS, 7);

    public static readonly LOGO = process.env.NEXT_PUBLIC_LOGO;

    public static readonly LOGO_BW = process.env.NEXT_PUBLIC_LOGO_BW;

    public static readonly LOGO_EMAIL = process.env.NEXT_PUBLIC_LOGO_EMAIL;

    public static readonly SLOT_PREVIEW = (process.env.NEXT_PUBLIC_SLOT_PREVIEW || 'no') === 'yes';

    public static readonly CWA = (process.env.NEXT_PUBLIC_CWA || 'no') === 'yes';

    public static readonly CWA_CENTER_ID = process.env.NEXT_PUBLIC_CWA_CENTER_ID;

    public static readonly CERTIFICATE_VERIFICATION = (process.env.NEXT_PUBLIC_CERTIFICATE_VERIFICATION || 'yes') === 'yes';

    public static readonly RETENTION_DAYS = Config.getNumber(process.env.NEXT_PUBLIC_RETENTION_DAYS || process.env.RETENTION_DAYS, 14);
}
