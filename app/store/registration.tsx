import { create } from 'zustand';

interface RegistrationData {
  // Step 1
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;

  // Step 2
  gender?: 'male' | 'female';
  dob?: string;
  country?: string;
  state?: string;
  city?: string;
  nationality?: string;

  // Step 3
  maritalStatus?: 'single' | 'divorced' | 'widowed';
  waliName?: string;
  waliRelation?: string;
  waliContact?: string;
  childrenCount?: string;
  childrenDetails?: string;


  // Step 4
  prayerRegularity?: '5x daily' | 'sometimes' | 'rarely';
  quranLevel?: string;
  hijabOrBeard?: 'Yes' | 'No' | 'Hijab Rarely';

  // Step 5
  termsAccepted?: boolean;
  islamicPolicyAccepted?: boolean;
}

interface RegistrationStore {
  data: RegistrationData;
  setData: (values: Partial<RegistrationData>) => void;
  reset: () => void;
}

export const useRegistrationStore = create<RegistrationStore>((set) => ({
  data: {},
  setData: (values) =>
    set((state) => ({ data: { ...state.data, ...values } })),
  reset: () => set({ data: {} }),
}));
