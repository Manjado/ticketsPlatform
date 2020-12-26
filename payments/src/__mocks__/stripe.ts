export const stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({}), //for async
  },
};
