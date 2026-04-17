import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { onAuthChange, getUserProfile } from '../services/firebase';

const AppContext = createContext(null);

const initialState = {
  // Auth
  isLoggedIn: false,
  user: null,
  isAuthLoading: true,

  // Profile / Onboarding
  profile: {
    major: '',
    interests: [],
    year: '',
    cgpa: '',
    state: '',
    county: '',
    college: '',
  },
  isProfileComplete: false,

  // Opportunities
  opportunities: [],
  visibleCount: 6,
  activeFilter: 'all',
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_AUTH':
      return {
        ...state,
        isLoggedIn: !!action.payload.user,
        user: action.payload.user,
        isAuthLoading: false,
      };
    case 'SET_PROFILE':
      const profile = { ...state.profile, ...action.payload };
      const isProfileComplete = !!(profile.major && profile.state && profile.college);
      return {
        ...state,
        profile,
        isProfileComplete,
      };
    case 'LOGOUT':
      return {
        ...initialState,
        isAuthLoading: false,
      };
    case 'SET_OPPORTUNITIES':
      return {
        ...state,
        opportunities: action.payload,
      };
    case 'LOAD_MORE':
      return {
        ...state,
        visibleCount: state.visibleCount + 6,
      };
    case 'SET_FILTER':
      return {
        ...state,
        activeFilter: action.payload,
        visibleCount: 6,
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Persistence Listener
  useEffect(() => {
    console.log('Altezza: Initializing Auth Listener...');
    const unsubscribe = onAuthChange(async (user) => {
      if (user) {
        console.log('Altezza: User logged in:', user.email);
        dispatch({ type: 'SET_AUTH', payload: { user } });
        
        try {
          // Fetch real profile from Firestore
          const { data, error } = await getUserProfile(user.uid);
          if (data) {
            console.log('Altezza: Profile synced from Firestore');
            dispatch({ type: 'SET_PROFILE', payload: data });
          } else {
            console.log('Altezza: No profile found for user in Firestore');
          }
        } catch (err) {
          console.error('Altezza: Firestore sync error:', err);
        }
      } else {
        console.log('Altezza: No active user session');
        dispatch({ type: 'SET_AUTH', payload: { user: null } });
      }
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback((userData) => {
    dispatch({ type: 'SET_AUTH', payload: { user: userData } });
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
  }, []);

  const setProfile = useCallback((profileData) => {
    dispatch({ type: 'SET_PROFILE', payload: profileData });
  }, []);

  const setOpportunities = useCallback((opps) => {
    dispatch({ type: 'SET_OPPORTUNITIES', payload: opps });
  }, []);

  const loadMore = useCallback(() => {
    dispatch({ type: 'LOAD_MORE' });
  }, []);

  const setFilter = useCallback((filter) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  }, []);

  const value = {
    ...state,
    login,
    logout,
    setProfile,
    setOpportunities,
    loadMore,
    setFilter,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
