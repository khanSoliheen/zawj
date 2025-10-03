import { create } from 'zustand';

export interface RegistrationData {
  // Step 1
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;

  // Step 2
  gender: 'Male' | 'Female';
  dob: string;
  country: string;
  state: string;
  city: string;
  education: string;
  employmentType: string;
  designation: string;
  department: string;


  // Step 3
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  waliName?: string;
  waliRelation?: string;
  waliContact?: string;
  childrenCount?: string;
  childrenDetails?: string;


  // Step 4
  prayerRegularity: '5x daily' | 'Regularly' | 'Sometimes' | 'Rarely' | 'Never';
  quranLevel: string;
  hijabOrBeard: 'Yes' | 'No' | 'Sometimes';

  // Step 5
  termsAccepted: boolean;
  islamicPolicyAccepted: boolean;
}

interface RegistrationStore {
  data: RegistrationData;
  setData: (values: Partial<RegistrationData>) => void;
  reset: () => void;
}

export const useRegistrationStore = create<RegistrationStore>((set) => ({
  data: {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    gender: 'Male',
    dob: '',
    country: '',
    state: '',
    city: '',
    education: '',
    employmentType: '',
    designation: '',
    department: '',
    maritalStatus: 'Single',
    prayerRegularity: '5x daily',
    quranLevel: '',
    hijabOrBeard: 'Yes',
    termsAccepted: false,
    islamicPolicyAccepted: false,
  },
  setData: (values) =>
    set((state) => ({ data: { ...state.data, ...values } })),
  reset: () => set({
    data: {
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      gender: 'Male',
      dob: '',
      country: '',
      state: '',
      city: '',
      education: '',
      employmentType: '',
      designation: '',
      department: '',
      maritalStatus: 'Single',
      prayerRegularity: '5x daily',
      quranLevel: '',
      hijabOrBeard: 'Yes',
      termsAccepted: false,
      islamicPolicyAccepted: false,
    }
  }),
}));
