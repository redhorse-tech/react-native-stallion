import { NATIVE_CONSTANTS } from '../main/constants/appConstants';

export enum SWITCH_STATES {
  PROD = 'PROD',
  STAGE = 'STAGE',
}

export enum SLOT_STATES {
  STABLE = NATIVE_CONSTANTS.STABLE_FOLDER_SLOT,
  NEW = NATIVE_CONSTANTS.NEW_FOLDER_SLOT,
  DEFAULT = NATIVE_CONSTANTS.DEFAULT_FOLDER_SLOT,
}

export interface IStallionMeta {
  switchState: SWITCH_STATES;
  prodSlot: {
    currentSlot: SLOT_STATES;
    stable?: string;
    new?: string;
    temp?: string;
  };
  stageSlot: {
    currentSlot: SLOT_STATES;
    new?: string;
    temp?: string;
  };
}

export enum MetaActionKind {
  SET_META = 'SET_META',
  GET_META = 'GET_META',
}

export interface ISetMeta {
  type: MetaActionKind.SET_META;
  payload: IStallionMeta;
}

export type IMetaAction = ISetMeta;
