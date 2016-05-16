import * as Firebase from 'firebase';

export interface ConnectionEntry {
  uid: string;
  name: string;
  email: string;
  profileImageURL: string;
  timestamp: number;
}
