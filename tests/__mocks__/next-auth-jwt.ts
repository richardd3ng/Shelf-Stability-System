export const mockToken= {
    id: 1,
    name: 'My name',
    email: 'email@example.com',
    // Add any other necessary properties
};

export const getToken = jest.fn().mockReturnValue(mockToken)