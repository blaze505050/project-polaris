export const items = {
  query: () => ({
    include: (..._args: any[]) => ({
      skip: (skipNum: number) => ({
        limit: (limitNum: number) => ({
          find: async () => ({ items: [], totalCount: 0, hasNext: () => false }),
        }),
      }),
    }),
    skip: (skipNum: number) => ({
      limit: (limitNum: number) => ({
        find: async () => ({ items: [], totalCount: 0, hasNext: () => false }),
      }),
    }),
    eq: (field: string, val: any) => ({
      include: (..._args: any[]) => ({
        find: async () => ({ items: [] }),
      }),
      find: async () => ({ items: [] }),
    }),
  }),
  queryReferenced: async () => ({ items: [], totalCount: 0, hasNext: () => false }),
  insert: async (_col: string, data: any) => ({ _id: "mock-id-" + Date.now(), ...data }),
  insertReference: async () => {},
  removeReference: async () => {},
  update: async (_col: string, data: any) => data,
  remove: async (_col: string, id: string) => ({ _id: id }),
};

export const members = {
  getCurrentMember: async () => null,
};

export const currentCart = {
  getCurrentCart: async () => ({ lineItems: [] }),
  addToCurrentCart: async () => ({}),
  updateCurrentCartLineItemQuantity: async () => ({}),
  removeLineItemsFromCurrentCart: async () => ({}),
  createCheckoutFromCurrentCart: async () => ({ checkoutUrl: "#" }),
  deleteCurrentCart: async () => ({}),
  ChannelType: { WEB: "WEB" },
};

export const checkout = {
  createCheckout: async () => ({ checkoutUrl: "#" }),
  ChannelType: { WEB: "WEB" },
};

export const redirects = {
  createRedirectSession: async () => ({ redirectUrl: "#" }),
};

export const CurrentCartServiceDefinition = {};

export function useWixModules() {
  return {};
}

export function useService() {
  return {};
}

export const SEO = {
  Tags: () => null,
};

export async function loadSEOTagsServiceConfig() {
  return {};
}
