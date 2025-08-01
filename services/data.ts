import { User } from '@/types/auth';

export const DUMMY_USERS: User[] = [
  {
    id: '687241fce82c6f1478d253a1',
    email: 'alice.admin@example.com',
    name: 'Alice Admin',
    role: 'admin',
    phoneNumber: '+919876543210',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '687241fce82c6f1478d253a2',
    email: 'bob.manager@example.com',
    name: 'Bob Manager',
    role: 'manager',
    phoneNumber: '+919123456780',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: '687241fce82c6f1478d253a3',
    email: 'carol.staff@example.com',
    name: 'Carol Staff',
    role: 'staff',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
];

export const DUMMY_TOKENS = {
  accessToken:
    'drpM8ij5Rryn-21iT_n1Xs:APA91bEhQ_MKIn6j3klSaa1J0qgu-xcV4YWajDW6CYAAqhNoeSjxH0CdUiIkGlvdcN5fqL-kajDLJDg9bdlWXAryDKydT8cGK4bjpfRLjSBNjL-fPRWg-1M',
  refreshToken:
    'arpM8ij5Rryn-21iT_n1Xs:APA91bEhQ_MKIn6j3klSaa1J0qgu-xcV4YWajDW6CYAAqhNoeSjxH0CdUiIkGlvdcN5fqL-kajDLJDg9bdlWXAryDKydT8cGK4bjpfRLjSBNjL-fPRWg-1M',
};
