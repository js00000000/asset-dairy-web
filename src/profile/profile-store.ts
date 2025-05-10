import { create } from 'zustand';
import { User } from './user-types';
import { profileApi } from './profile-api';
import { persist } from 'zustand/middleware';

interface ProfileState {
  profile: User | null;
  isProfileLoading: boolean;
  isProfileSubmitting: boolean;
  profileError: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  deleteProfile: () => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  resetProfileError: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist((set) => ({
    profile: null,
    isProfileLoading: false,
    isProfileSubmitting: false,
    profileError: null,

    fetchProfile: async () => {
      set({ isProfileLoading: true, profileError: null });
      try {
        const user = await profileApi.fetchProfile();
        set({ profile: user });
      } catch (err) {
        set({
          profileError: err instanceof Error ? err.message : 'Failed to fetch profile',
        });
      } finally {
        set({ isProfileLoading: false });
      }
    },

    updateProfile: async (data) => {
      set({ isProfileSubmitting: true, profileError: null });
      try {
        const updatedUser = await profileApi.updateProfile(data);
        set({ profile: updatedUser });
      } catch (err) {
        set({
          profileError: err instanceof Error ? err.message : 'Failed to update profile',
        });
      } finally {
        set({ isProfileSubmitting: false });
      }
    },

    deleteProfile: async () => {
      set({ isProfileSubmitting: true, profileError: null });
      try {
        const result = await profileApi.deleteProfile();
        set({ profile: null });
        return result;
      } catch (err) {
        set({
          profileError: err instanceof Error ? err.message : 'Failed to delete profile',
        });
        return false;
      } finally {
        set({ isProfileSubmitting: false });
      }
    },

    changePassword: async (currentPassword: string, newPassword: string) => {
      set({ isProfileSubmitting: true, profileError: null });
      try {
        await profileApi.changePassword(currentPassword, newPassword);
      } catch (err) {
        set({
          profileError: err instanceof Error ? err.message : 'Failed to update profile',
        });
      } finally {
        set({ isProfileSubmitting: false });
      }
    },

    resetProfileError: () => set({ profileError: null }),
  }), {
    name: 'profile-storage',
    partialize: (state) => ({
      profile: state.profile,
    })
  })
);
