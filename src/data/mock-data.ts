import { User } from '../users/user-types';

export const mockUsers: User[] = [
  {
    id: 's1',
    name: 'Tech Solutions Inc.',
    email: 'sales@techsolutions.com',
    avatar: 'https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    createdAt: '2023-01-15T08:00:00Z',
    username: 'techsolutionsinc',
    password: 'changeme',
  },
  {
    id: 's2',
    name: 'Fashion Forward',
    email: 'support@fashionforward.com',
    avatar: 'https://images.pexels.com/photos/3992656/pexels-photo-3992656.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    createdAt: '2023-02-10T10:30:00Z',
    username: 'fashionforward',
    password: 'changeme',
  },
  {
    id: 's3',
    name: 'Home Essentials Co.',
    email: 'contact@homeessentials.com',
    avatar: 'https://images.pexels.com/photos/3760610/pexels-photo-3760610.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    createdAt: '2023-03-05T14:15:00Z',
    username: 'homeessentialsco',
    password: 'changeme',
  },
];