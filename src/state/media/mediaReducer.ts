export enum MediaSource {
    YT = "YouTube",
    LOCAL = "Local"
}

export const MULTI = "SET_MULTIPLE";

export interface Media {
  url: string;
  source: MediaSource;
  playing: boolean;
  timestamp: number;
  fileName: string
}

export interface MediaAction {
  name: (keyof Media) | string;
  value: any;
}

export const initialMedia: Media = {
  url: "",
  source: MediaSource.LOCAL,
  playing: false,
  timestamp: 0,
  fileName: ""
};

export function mediaReducer(state: Media, action: MediaAction) {
  if(action.name===MULTI) {
    return {...state, ...action.value }
  }
  return {
    ...state,
    [action.name]: action.value === 'default' ? undefined : action.value,
  };
}
