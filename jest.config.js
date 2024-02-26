module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper : {
        '^@prisma/client$': '<rootDir>/tests/__mocks__/prismaClient.ts',
        '^next-auth/client$': '<rootDir>/tests/__mocks__/next-auth-client.ts',
        '^next-auth/jwt$': '<rootDir>/tests/__mocks__/next-auth-jwt.ts',
        '^@/(.*)$': '<rootDir>/$1',
        

    }
};
  