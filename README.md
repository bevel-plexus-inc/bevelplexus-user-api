# Bevel User Service


### Notes
- ? => means value may be null
- All Endpoints may also return a friendly `ErrorResponse` or GraphQL Error when app breaks
- All Methods are mutations but there are some queries not exposed right now but will be done in due time

### Enums
UserType {
   - Regular = "Regular",
   - Student = "Student"
   
}


### Schema
- SuccessResponse => {

    message: string,
    
    identifier: string,

}

- ErrorResponse => {

    message: string,
    
    identifier: string,
    
    error: string,

}

- User => {

    id: string;

    firstName: string;

    lastName: string;

    email: string;

    phoneNumber?: string;

    password: string;

    userType: UserType;

    createdAt: Date;

    updatedAt: Date;

    deletedAt?: Date;

    studentAccountDetail?: StudentAccountDetail;

    regularAccountDetail?: RegularAccountDetail;
    
    userVerification?: UserVerification;

}

- studentAccountDetail => {

    id: string;

    userId: string;

    studentNumber: string;

    studentEmail: string;

    country: string;

    countryIso3Code: string;

    school: string;

    yearOfGraduation: Date;

    course: string;

    dateOfBirth: Date;

    createdAt: Date;

    updatedAt: Date;

    deletedAt?: Date;
    
}

- regularAccountDetails => {

    id: string;

    userId: string;

    address: string;

    city: string;

    postalCode: string;

    country: string;

    countryIso3Code: string;

    createdAt: Date;

    updatedAt: Date;

    deletedAt?: Date;
    
}

- userVerification => {
    
    id: string;

    userId: string;

    isIdentityVerified: boolean;

    identityDocumentUrl: string;

    isSchoolEnrollmentVerified: boolean;

    enrollmentDocumentUrl: string;

    isPhoneNumberVerified: boolean;
    
    isEmailVerified: boolean;

    createdAt: Date;

    updatedAt: Date;

    deletedAt?: Date;

}

- authenticationData => {
    
    token: string;
    
    user: User;

}

### Methods

- login (email: string, password: string): authenticationData
- signup ({

  firstName: string;
  
  lastName: string;
  
  email: string;
  
  referralCode: string;
  
  userType: UserType;
  
  password: string;
  
  confirmPassword: string;
  
}): user

- authenticatePhoneNumber({

    phoneNumber: string;
    
    userId: string;
    
}): SuccessResponse

- addRegularAccountDetails({
    
    userId: string;

    address: string;

    city: string;

    postalCode: string;

    country: string;

    countryIso3Code: string;
}): RegularAccountDetails

- addStudentAccountDetails({

    userId: string;

    studentNumber: string;

    studentEmail: string;

    country: string;

    countryIso3Code: string;

    school: string;

    yearOfGraduation: Date;

    course: string;

    dateOfBirth: Date;
    
}): StudentAccountDetails

- verifyEmail({

    email: string;

    otp: string;
    
}): SuccessResponse

- verifyPhoneNumber({

    phoneNumber: string;

    otp: string;

}): SuccessResponse


- verifyPhoneNumber({

    phoneNumber: string;

    otp: string;

}): SuccessResponse


- verifyIdentity({

    userId: string;

    document: blob;

}): SuccessResponse


- verifyEmail({

    userId: string;

    document: blob;

}): SuccessResponse


### TODO:
- Sending of emails for 
    * Registration
    * Email Validation
    * Phone Number Validation
    * Recovering of Password
- Uploading of identity and school enrolment
