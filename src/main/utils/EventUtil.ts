import { API_BASE_URL, API_PATHS } from '../constants/apiConstants';
import { getAppHeaders } from './apiUtils';
import SharedDataManager from './SharedDataManager';

interface IEventData {
  type: string;
  payload: {
    [key: string]: any;
  };
}

export const fireEvent = (data: IEventData) => {
  if (data?.type && data?.payload) {
    const dataManager = SharedDataManager.getInstance();
    const body = {
      projectId: dataManager?.getProjectId(),
      key: data.type,
      value: {
        ...data.payload,
        uid: dataManager?.getUid(),
      },
    };
    fetch(API_BASE_URL + API_PATHS.LOG_EVENT, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: getAppHeaders(),
    }).catch((err) => {
      console.error('Stallion: Error in events API ', err);
    });
  }
};
