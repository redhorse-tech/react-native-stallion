import React, { useCallback } from 'react';

import SharedDataManager from '../../utils/SharedDataManager';

import { DEFAULT_ERROR_MESSAGE } from '../../constants/appConstants';
import { extractError } from '../../utils/errorUtil';
import {
  setRequiresLogin,
  setTempOtp,
  setUserData,
  setUserError,
} from '../../state/actions/userActions';
import { apiAuthMiddleware, getApiHeaders } from '../../utils/apiUtils';
import { setUserLoading } from '../../state/actions/userActions';

import { API_BASE_URL, API_PATHS } from '../../constants/apiConstants';
import { IUserAction, IUserData, IUserState } from '../../../types/user.types';
import {
  ILoginActionPayload,
  IVerifyOtpPayload,
} from '../../../types/globalProvider.types';
import { setApiKeyNative } from '../../utils/StallionNativeUtils';

const useUserActions = (
  dispatch: React.Dispatch<IUserAction>,
  userState: IUserState
) => {
  const dataManager = SharedDataManager.getInstance();

  const setUserRequiresLogin = useCallback(
    (requiresLogin: boolean) => {
      dispatch(setUserData({} as IUserData));
      dispatch(setRequiresLogin(requiresLogin));
    },
    [dispatch]
  );

  const loginUser = useCallback(
    (loginPayload: ILoginActionPayload) => {
      dispatch(setUserLoading());
      fetch(API_BASE_URL + API_PATHS.LOGIN, {
        method: 'POST',
        body: JSON.stringify({
          ...loginPayload,
          projectId: dataManager?.getProjectId(),
        }),
        headers: getApiHeaders(),
      })
        .then((res) => res.json())
        .then((loginResponse) => {
          const accessToken = loginResponse?.data?.accessToken as string;
          if (accessToken) {
            dataManager?.setAccessToken(accessToken);
            setApiKeyNative(accessToken);
            dispatch(
              setUserData({
                fullName: loginResponse?.data?.user?.fullName,
                email: loginResponse?.data?.user?.email,
              })
            );
            dispatch(setRequiresLogin(false));
          } else {
            dispatch(setUserError(extractError(loginResponse)));
          }
        })
        .catch((_) => {
          dispatch(setUserError(DEFAULT_ERROR_MESSAGE));
        });
    },
    [dispatch, dataManager]
  );

  const verifyOtp = useCallback(
    (verifyOtpPayload: IVerifyOtpPayload) => {
      dispatch(setUserLoading());
      fetch(API_BASE_URL + API_PATHS.VERIFY_OTP, {
        method: 'POST',
        body: JSON.stringify({
          ...verifyOtpPayload,
          otpToken: userState.tempOtpToken,
        }),
        headers: getApiHeaders(),
      })
        .then((res) => apiAuthMiddleware(res, setUserRequiresLogin))
        .then((otpResponse) => {
          const accessToken: string = otpResponse?.data?.accessToken;
          if (accessToken) {
            dataManager?.setAccessToken(accessToken);
            setApiKeyNative(accessToken);
            dispatch(
              setUserData({
                fullName: otpResponse?.data?.user?.fullName,
                email: otpResponse?.data?.user?.email,
              })
            );
            dispatch(setRequiresLogin(false));
          } else {
            dispatch(setUserError(extractError(otpResponse)));
          }
        })
        .catch((_) => {
          dispatch(setUserError(DEFAULT_ERROR_MESSAGE));
        });
    },
    [dispatch, userState.tempOtpToken, dataManager, setUserRequiresLogin]
  );

  const retryLogin = useCallback(() => {
    dispatch(setTempOtp(null));
  }, [dispatch]);

  const getUserProfile = useCallback(() => {
    dispatch(setUserLoading());
    fetch(API_BASE_URL + API_PATHS.USER_PROFILE, {
      method: 'POST',
      headers: getApiHeaders(),
    })
      .then((res) => apiAuthMiddleware(res, setUserRequiresLogin))
      .then((userProfileResponse) => {
        if (userProfileResponse?.data?.email) {
          dispatch(
            setUserData({
              fullName: userProfileResponse?.data?.fullName,
              email: userProfileResponse?.data?.email,
            })
          );
        } else {
          dispatch(setUserError(extractError(userProfileResponse)));
        }
      })
      .catch(() => {
        dispatch(setUserError(DEFAULT_ERROR_MESSAGE));
      });
  }, [dispatch, setUserRequiresLogin]);

  return {
    loginUser,
    verifyOtp,
    retryLogin,
    setUserRequiresLogin,
    getUserProfile,
  };
};

export default useUserActions;
