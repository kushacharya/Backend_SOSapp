import { body } from 'express-validator';
import validator from 'validator';

// eslint-disable-next-line no-undef
export const PhoneValidatorRules = [
    body('phonenumber').isMobilePhone('en-IN').withMessage('Invalid Phone number for logout')
];

export const OTPValidationRules = [
    body('otp').isNumeric().withMessage('OTP field is empty').isLength({ min: 6, max: 6 }).withMessage('Invalid length!!')
];

export const SignUpValidator = [
    body('name').not().isEmpty().withMessage('Name is requred!'),
    body('phonenumber').isMobilePhone('en-IN').withMessage('Invalid Phone number'),
    body('phonenumber2').optional({ nullable: false }).isMobilePhone('en-IN').withMessage('Invalid phone number'),
    body('phonenumber3').optional({ nullable: true }).isMobilePhone('en-IN').withMessage('Invalid phone number'),
    body('phonenumber4').optional({ nullable: true }).isMobilePhone('en-IN').withMessage('Invalid phone number'),
    body('country').not().isEmpty().withMessage('Country is required'),
    body('State').not().isEmpty().withMessage('State is required'),
    body('district').not().isEmpty().withMessage('District is required'),
    body('bloodgroup').not().isEmpty().withMessage('Blood group is required'),
    body('maritalstatus').not().isEmpty().withMessage('Marital status is required')
]

export const SOSvalidator = [
    body('user_id').not().isEmpty().withMessage('User ID is required!'),
    body('primary_mobile').isMobilePhone('en-IN').withMessage('Invalid Phone number'),
    body('lat').not().isEmpty().withMessage('lat is required!'),
    body('lon').not().isEmpty().withMessage('lon is required!'),
    body('time').not().isEmpty().withMessage('Time is required'),
    body('phoneNumberArray').isArray().withMessage('Phone number array is required') // used internet help for array of phone number.
    // eslint-disable-next-line no-unused-vars
    .custom((phoneNumberArray, { req }) => {
      phoneNumberArray.forEach((phoneNumber, index) => {
        if (!validator.isMobilePhone(phoneNumber, 'en-IN')) {
          throw new Error(`Invalid phone number at index ${index}`);
        }
      });
      return true;
    }),
    body('battery_life').not().isEmpty().withMessage('Need battery life in body!'),
    body('count').not().isEmpty().withMessage('count is not valid')
]