// Read env values from Cypress at runtime.
// If a key is missing, use the provided fallback so tests still run locally.
// const getCypressEnv = (key, fallback) => {
//     if (typeof Cypress !== "undefined" && typeof Cypress.env === "function") {
//         const value = Cypress.env(key);
//         return value ?? fallback;
//     }
//     return fallback;
// };

// Base URL for your frontend app pages visited by Cypress (e.g. /login, /sign-up).
const WEB_BASE_URL = "http://localhost:3000";
// Base URL for your backend API used by app requests (staging by default fallback).
const API_BASE_URL =  "https://staging-api.sendsile.com/api/v1"
// Route path for login page and login API intercept pattern.
const LOGIN_PATH =  "/login"
// Route path for sign-up page.
const SIGNUP_PATH =  "/sign-up"
// Route path for forgot-password page.
const FORGOT_PASSWORD_PATH = "/forgot-password"
// Route path template for email verification page.
const EMAIL_VERIFICATION_PATH =  "/email-verification/:token/:id"
// API path used for register endpoint intercepts.
const REGISTER_API_PATH =  "/register"
// API path used for forgot-password reset-initiate intercepts.
const RESET_INITIATE_API_PATH = "/password/reset/initiate"
// API path used for resend verification email intercepts.
const RESEND_EMAIL_API_PATH = "/email/resend"

export const Sendsile = {
    login: {
        pageUrl: `${WEB_BASE_URL}${LOGIN_PATH}`,
        base: API_BASE_URL,
        path: LOGIN_PATH,
        emailId: "#email",
        message01: "Login to your account",
        emailentry: "hello@test.com",
        passwordentry: "mypassword",
        message02:"Forgot password?",
        message03:"Continue with google",
        message04:"Invalid credentials",
        wrongemail:"wrong@example.com",
        wrongpassword:"wrongpassword",
        button:"Continue",
        statuscode: 200,
        statuscodefail: 400,
        testemail:"user@example.com",
        testname:"Test User",
        testbalance:0,
        testphone:"0000000000",
        photo:"",
        temp_token:"temp-2fa-token",
        loginUrl:"/login",
        login2faUrl:"/login/2fa",
        loginmessage01:"OTP",
        loginmessage02:"OTP sent to your email",
        loginemail:"user@example.com",
        loginpassword:"Password123",
        loginmessage03:"Invalid OTP",
        instructionmessage01:"Enter the 6-digit code on your Authenticator App",
    },
    signup: {
        pageUrl: `${WEB_BASE_URL}${SIGNUP_PATH}`,
        base: API_BASE_URL,
        message01: "Let's sign you up first",
        nameId: "#fullname",
        emailId: "#email",
        passwordId: "#password",
        confirmPassword: "confirmPassword",
        button: "Continue",
        statuscode: 200,
        responsemail: "user@example.com",
        message02: "Passwords do not match",
        registerURL: REGISTER_API_PATH,
        emailURL: "/email-verification",
        message03: "Email already exists",
        statuscodefail: 400,

    },
    emailVerification: {
        pageUrl: `${WEB_BASE_URL}${EMAIL_VERIFICATION_PATH}`,
        verifyUrl: `${WEB_BASE_URL}/email-verification/test-token/123?signature=abc&expires=1`,
        base: API_BASE_URL,
        header01: "Check your inbox",
        header02: "A verification email has been sent to your email",
        resendButton: "Resend verification email",
        resendmessage01: "Verification email resent",
        resenderror: "Unable to resend verification email",
        resendUrl:"/email/verify/test-token/123?signature=abc&expires=1",
        resendmessage02:"Email verified",
        resendendpoint: RESEND_EMAIL_API_PATH,
        verifyendpoint: "/email/verify/test-token/123?*",
        statuscode: 200,
        statuscodefail: 400,

    },
    forgotpassword:{
        pageUrl: `${WEB_BASE_URL}${FORGOT_PASSWORD_PATH}`,
        base: API_BASE_URL,
        header01:"Forgot your password?",
        emailId:"#email",
        resetButton:"Reset password",
        rememberPassword:"Remember password?",
        resetmessage01:"Set a new password",
        resetURL: RESET_INITIATE_API_PATH,
        resetmessage02:"Reset link sent",
        resetmessage03:"Email does not exist",
        reseterror:"Unable to reset password",
        statuscode: 200,
        statuscodefail: 400,
        emailtest: "test@example.com"
        


        
    }
}

