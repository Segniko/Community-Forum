// Mock Firebase configuration and services
const mockAuth = {
  currentUser: null,
  onAuthStateChanged: () => {},
};

const mockFirestore = {
  collection: () => ({
    doc: () => ({
      get: async () => ({
        exists: () => true,
        data: () => ({}),
      }),
      set: async () => {},
      update: async () => {},
    }),
  }),
};

const mockStorage = {
  ref: () => ({
    put: async () => {},
    getDownloadURL: async () => 'https://example.com/mock-image.jpg',
  }),
};

export const auth = mockAuth;
export const db = mockFirestore;
export const storage = mockStorage;

export default {
  auth,
  db,
  storage,
};
