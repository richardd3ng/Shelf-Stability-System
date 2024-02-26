export const getSession = jest.fn().mockResolvedValueOnce({
    user: {
      id: 1,
      name: 'My name',
      email: 'email@example.com',
    },
    accessToken: 'valid-access-token',
});
  
export const signIn = jest.fn().mockResolvedValueOnce({
    user: {
        id: 1,
        name: 'My name',
        email: 'email@example.com',
    },
    accessToken: 'valid-access-token',
});
  
export const signOut = jest.fn().mockResolvedValueOnce(undefined);
  