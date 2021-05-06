declare module "otp-generator" {
    interface OTPGenerationProps {
        digits?: boolean;
        alphabets?: boolean;
        upperCase?: boolean;
        specialChars?: boolean;
    }

    function generate(length: number, options: OTPGenerationProps): string;

    // eslint-disable-next-line import/prefer-default-export
    export { generate };
}
