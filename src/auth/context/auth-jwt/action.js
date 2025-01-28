
import axiosInstance, { endpoints } from 'src/utils/axios';

import { setSession } from './utils';

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({ email, password }) => {
    try {
        const params = { email, password };

        const response = await axiosInstance.post(endpoints.auth.signIn, params);

        const { data, error_code, message } = response.data;

        if (error_code !== 0) {
            throw new Error(message);
        }

        setSession(data.accessToken);
    } catch (error) {
        const errorMsg =
            (error instanceof Error && error.message) ||
            (typeof error === 'object' && error?.message) ||
            error;
        console.error('Error during sign in:', errorMsg);
        throw errorMsg;
    }
};

/** **************************************
 * Sign up
 *************************************** */
export const signUp = async ({ email, password, name }) => {
    const params = {
        email,
        password,
        name
    };

    try {
        const response = await axiosInstance.post(endpoints.auth.signUp, params);

        const { error_code, message } = response.data;

        if (error_code !== 0) {
            throw new Error(message);
        }
    } catch (error) {
        const errorMsg =
            (error instanceof Error && error.message) ||
            (typeof error === 'object' && error?.message) ||
            error;
        console.error('Error during sign up:', errorMsg);
        throw errorMsg;
    }
};

// otp verification

export const userVerify = async ({ email, otp }) => {
    const params = {
        email,
        otp,
    };

    try {
        const result = await axiosInstance.post(endpoints.auth.userVerify, params);

        const { error_code, message, data } = result.data;

        if (error_code !== 0) {
            throw new Error(message);
        }

        setSession(data.accessToken);
    } catch (error) {
        const errorMsg =
            (error instanceof Error && error.message) ||
            (typeof error === 'object' && error?.message) ||
            error;

        console.log('error during verification: ', errorMsg);
        throw errorMsg;
    }
};

// reset password

export const verifyOtp = async({ email, otp }) => {
    const params ={
        email,
        otp
    }
    try{
        const result = await axiosInstance.post(endpoints.auth.otpVerify, params);
        const { error_code, message } = result.data;

        if (error_code !== 0) {
            throw new Error(message);
        }

    }catch (error){
        const errorMsg =
        (error instanceof Error && error.message) ||
        (typeof error === 'object' && error?.message) ||
        error;

    console.log('error during verification: ', errorMsg);
    throw errorMsg;
    }
};

// resend otp

export const resendOtp = async ({ email }) => {
    const params = {
        email,
    };
    try {
        const result = await axiosInstance.post(endpoints.auth.otpResend, params);
        const { error_code, message } = result.data;

        if (error_code !== 0) {
            throw new Error(message);
        }
    } catch (error) {
        const errorMsg =
            (error instanceof Error && error.message) ||
            (typeof error === 'object' && error?.message) ||
            error;

        console.log('error during resend: ', errorMsg);
        throw errorMsg;
    }
};

// create otp
export const createOtp = async ({ email }) => {
    const params = {
        email,
    };
    try {
        const result = await axiosInstance.post(endpoints.auth.otpRequest, params);
        const { error_code, message } = result.data;

        if (error_code !== 0) {
            throw new Error(message);
        }
    } catch (error) {
        const errorMsg =
            (error instanceof Error && error.message) ||
            (typeof error === 'object' && error?.message) ||
            error;

        console.log('error during resend: ', errorMsg);
        throw errorMsg;
    }
};



// password verification
export const updatePassword = async ({ email, otp, password }) => {
    const params = {
        email,
        otp,
        password,
    };

    try {
        const response = await axiosInstance.post(endpoints.auth.resetPasword, params);

        const { error_code, message } = response.data;

        if (error_code !== 0) {
            throw new Error(message);
        }
        return { status: true, message: 'Password updated successfully' };
    } catch (error) {
        const errorMsg =
            (error instanceof Error && error.message) ||
            (typeof error === 'object' && error?.message) ||
            error;
        console.error('Error during password update:', errorMsg);
        throw errorMsg;
    }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async () => {
    try {
        await setSession(null);
    } catch (error) {
        console.error('Error during sign out:', error);
        throw error;
    }
};
