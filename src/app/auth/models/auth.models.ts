

export type AuthenticationType = 'LOGIN' | 'SIGNUP';

export interface UserAuthState {
  data: {
    attributes: {
      expires: string | any | null;
      permissions: Array<string>;
    };
    id: string;
    type: string;
  };
  meta: {
    auth: {
      expires: string;
    };
  };
}

export interface ArtistsAuthStateModel {
  data: {
    attributes: any;
    relationships: any;
    id: string;
    type: string;
    links?: {
      [key: string]: string | any;
    };
  };
  links?: {
    [key: string]: string | any;
  };
  meta?: {
    auth: {
      expires: string;
    };
    LoginStatus: boolean;
    stateLoaded?: boolean;
  };
}

export const defaultUserAuthState: ArtistsAuthStateModel = {
  data: {
    attributes: null,
    relationships: null,
    id: null,
    type: null,
  },
  links: null,
  meta: {
    auth: {
      expires: null,
    },
    LoginStatus: false,
    stateLoaded: false,
  },
};
