import {AuthProviders} from "angularfire2/angularfire2";
export interface UserCredentials {
  displayName: string;
  credentials: FirebaseCredentials
}

export interface UserData {
  uid: string;
  displayName: string;
  profileImageURL: string;
  timestamp: number;
  provider: AuthProviders
}
