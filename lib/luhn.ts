
export default class Luhn {
    public static checksum(input: string | number) {
        const string = input.toString();
        let sum = 0;
        let parity = 2;

        for (let i = string.length - 1; i >= 0; i--) {
            const digit = Math.max(parity, 1) * parseInt(string[i], 10);

            sum += digit > 9 ? digit.toString().split('').map(Number).reduce((a, b) => a + b, 0) : digit;
            parity *= -1;
        }

        sum %= 10;

        return sum > 0 ? 10 - sum : 0;
    }

    public static generate(input: string | number) {
        let string = input.toString();

        return string + this.checksum(string);
    }

    public static validate(input: string | number) {
        return this.checksum(input.toString().slice(0, -1)) === parseInt(input.toString().slice(-1), 10);
    }
}