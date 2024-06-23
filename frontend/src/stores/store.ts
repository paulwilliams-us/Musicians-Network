import { configureStore } from '@reduxjs/toolkit';
import styleReducer from './styleSlice';
import mainReducer from './mainSlice';
import authSlice from './authSlice';
import openAiSlice from './openAiSlice';

import usersSlice from './users/usersSlice';
import agentsSlice from './agents/agentsSlice';
import applicationsSlice from './applications/applicationsSlice';
import availabilitySlice from './availability/availabilitySlice';
import event_organizersSlice from './event_organizers/event_organizersSlice';
import eventsSlice from './events/eventsSlice';
import jobsSlice from './jobs/jobsSlice';
import musiciansSlice from './musicians/musiciansSlice';
import rsvpsSlice from './rsvps/rsvpsSlice';
import venuesSlice from './venues/venuesSlice';
import rolesSlice from './roles/rolesSlice';
import permissionsSlice from './permissions/permissionsSlice';

export const store = configureStore({
  reducer: {
    style: styleReducer,
    main: mainReducer,
    auth: authSlice,
    openAi: openAiSlice,

    users: usersSlice,
    agents: agentsSlice,
    applications: applicationsSlice,
    availability: availabilitySlice,
    event_organizers: event_organizersSlice,
    events: eventsSlice,
    jobs: jobsSlice,
    musicians: musiciansSlice,
    rsvps: rsvpsSlice,
    venues: venuesSlice,
    roles: rolesSlice,
    permissions: permissionsSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
