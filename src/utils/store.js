import { create } from 'zustand';

// ISS Store
export const useISSStore = create((set, get) => ({
  location: { latitude: 0, longitude: 0 },
  speed: 0,
  lastPositions: [],
  peopleInSpace: [],
  totalPeople: 0,
  currentLocationName: 'Loading...',
  timestamp: null,

  setLocation: (lat, lon) => set({ location: { latitude: Number(lat), longitude: Number(lon) } }),
  setSpeed: (speed) => set({ speed }),
  setLastPositions: (positions) => set({ lastPositions: positions }),
  setPeopleInSpace: (people) => set({ peopleInSpace: people }),
  setTotalPeople: (total) => set({ totalPeople: total }),
  setLocationName: (name) => set({ currentLocationName: name }),
  setTimestamp: (time) => set({ timestamp: time }),

  addPosition: (lat, lon) => {
    const { lastPositions } = get();
    const newPositions = [{ lat: Number(lat), lon: Number(lon), timestamp: Date.now() }, ...lastPositions].slice(0, 15);
    set({ lastPositions: newPositions });
  },

  clearPositions: () => set({ lastPositions: [] }),
}));

// News Store
export const useNewsStore = create((set) => ({
  articles: [],
  loading: false,
  error: null,
  selectedCategory: 'general',

  setArticles: (articles) => set({ articles }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  addArticle: (article) => set((state) => ({ articles: [article, ...state.articles] })),
}));

// Chat Store
export const useChatStore = create((set) => ({
  messages: [],
  isOpen: false,
  isLoading: false,

  addMessage: (message) => {
    set((state) => {
      const newMessages = [...state.messages, message].slice(-30);
      localStorage.setItem('chatMessages', JSON.stringify(newMessages));
      return { messages: newMessages };
    });
  },

  setIsOpen: (isOpen) => set({ isOpen }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  clearMessages: () => {
    localStorage.removeItem('chatMessages');
    set({ messages: [] });
  },

  loadMessages: () => {
    const stored = localStorage.getItem('chatMessages');
    if (stored) {
      set({ messages: JSON.parse(stored) });
    }
  },
}));

// Theme Store
export const useThemeStore = create((set) => ({
  isDark: localStorage.getItem('theme') === 'dark',

  setDarkMode: (isDark) => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ isDark });
  },

  toggleTheme: () => {
    set((state) => {
      const newIsDark = !state.isDark;
      localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
      if (newIsDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { isDark: newIsDark };
    });
  },
}));

// Notification Store
export const useNotificationStore = create((set) => ({
  notifications: [],

  addNotification: (notification) => {
    const id = Date.now();
    const notif = { ...notification, id };
    set((state) => ({
      notifications: [...state.notifications, notif],
    }));

    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, 3000);

    return id;
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },
}));
