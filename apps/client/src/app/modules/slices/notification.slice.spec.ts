import {
  fetchNotification,
  notificationAdapter,
  notificationReducer,
} from './notification.slice';

describe('notification reducer', () => {
  it('should handle initial state', () => {
    const expected = notificationAdapter.getInitialState({
      loadingStatus: 'not loaded',
      error: null,
    });

    expect(notificationReducer(undefined, { type: '' })).toEqual(expected);
  });

  it('should handle fetchNotification', () => {
    let state = notificationReducer(undefined, fetchNotification.pending(''));

    expect(state).toEqual(
      expect.objectContaining({
        loadingStatus: 'loading',
        error: null,
        entities: {},
        ids: [],
      })
    );

    state = notificationReducer(
      state,
      fetchNotification.fulfilled([{ id: 1 }], '')
    );

    expect(state).toEqual(
      expect.objectContaining({
        loadingStatus: 'loaded',
        error: null,
        entities: { 1: { id: 1 } },
        ids: [1],
      })
    );

    state = notificationReducer(
      state,
      fetchNotification.rejected(new Error('Uh oh'), '')
    );

    expect(state).toEqual(
      expect.objectContaining({
        loadingStatus: 'error',
        error: 'Uh oh',
        entities: { 1: { id: 1 } },
        ids: [1],
      })
    );
  });
});
