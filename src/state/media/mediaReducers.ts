import { Media, MULTI, SOURCEMAP } from './media';

export interface MediaAction {
  name: keyof Media | string;
  value: any;
}

export const initialLocalMedia: Media = {
  url: 'https://www.youtube.com/watch?v=iDZLRnHoYCI',
  source: SOURCEMAP.YT,
  playing: false,
  timestamp: 0,
  fileName: '',
};

export const initialRemoteMedia: Media = { ...initialLocalMedia };

export function remoteMediaReducer(state: Media, action: MediaAction) {
  if (action.name === MULTI) {
    return { ...state, ...action.value };
  }
  return {
    ...state,
    [action.name]: action.value === 'default' ? undefined : action.value,
  };
}

export function localMediaReducer(state: Media, action: MediaAction) {
  if (action.name === MULTI) {
    return { ...state, ...action.value };
  }
  return {
    ...state,
    [action.name]: action.value === 'default' ? undefined : action.value,
  };
}
