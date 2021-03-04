
export default class Config {
    private static getNumber(value: string, defaultValue: number): number {
        const parsedValue = parseInt(value, 10);

        return isNaN(parsedValue) ? defaultValue : parsedValue;
    }

    public static readonly MAX_CHILDREN = Config.getNumber(process.env.NEXT_PUBLIC_MAX_CHILDREN, 3);

    public static readonly MAX_ADULTS = Config.getNumber(process.env.NEXT_PUBLIC_MAX_ADULTS, 2);

    public static readonly HOMEPAGE = process.env.NEXT_PUBLIC_HOMEPAGE || '#';

    public static readonly HOMEPAGE_LEGAL = process.env.NEXT_PUBLIC_HOMEPAGE_LEGAL || '/data-protection';

    public static readonly HOMEPAGE_PRIVACY = process.env.NEXT_PUBLIC_HOMEPAGE_PRIVACY || '#';

    public static readonly CONTACT_MAIL = process.env.NEXT_PUBLIC_CONTACT_MAIL || 'mail@localhost';

    public static readonly VENDOR_NAME = process.env.NEXT_PUBLIC_VENDOR_NAME || 'DRK Ortsverein Musterstadt e.V.';
}