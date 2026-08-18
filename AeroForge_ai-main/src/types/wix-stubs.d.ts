declare module '@wix/members' {
  export namespace members {
    export interface GetMyMemberResponse {
      member: {
        loginEmail?: string;
        loginEmailVerified?: boolean;
        status?: 'UNKNOWN' | 'PENDING' | 'APPROVED' | 'BLOCKED' | 'OFFLINE';
        contact?: {
          firstName?: string;
          lastName?: string;
          phones?: string[];
        };
        profile?: {
          nickname?: string;
          photo?: {
            url?: string;
            height?: number;
            width?: number;
            offsetX?: number;
            offsetY?: number;
          };
          title?: string;
        };
        _createdDate?: Date;
        _updatedDate?: Date;
        lastLoginDate?: Date;
      };
    }
  }
  export const members: {
    getCurrentMember(options?: any): Promise<members.GetMyMemberResponse | null>;
  };
}

declare module '@wix/data' {
  export const items: {
    query(collectionId: string): any;
    queryReferenced(collectionId: string, itemId: string, refField: string, options?: any): Promise<any>;
    insert(collectionId: string, itemData: any): Promise<any>;
    insertReference(collectionId: string, propertyName: string, itemId: string, refIds: string[]): Promise<any>;
    removeReference(collectionId: string, propertyName: string, itemId: string, refIds: string[]): Promise<any>;
    update(collectionId: string, itemData: any): Promise<any>;
    remove(collectionId: string, itemId: string): Promise<any>;
  };
  export interface WixDataItem {
    _id?: string;
    _createdDate?: Date;
    _updatedDate?: Date;
    [key: string]: any;
  }
}

declare module '@wix/ecom' {
  export namespace currentCart {
    export type Cart = any;
    export interface LineItem {
      _id?: string;
      quantity?: number;
      catalogReference?: any;
      [key: string]: any;
    }
  }
  export const currentCart: {
    getCurrentCart(): Promise<any>;
    addToCurrentCart(options?: any): Promise<any>;
    updateCurrentCartLineItemQuantity(options?: any): Promise<any>;
    removeLineItemsFromCurrentCart(lineItemIds?: any): Promise<any>;
    createCheckoutFromCurrentCart(options?: any): Promise<any>;
    deleteCurrentCart(): Promise<any>;
    ChannelType: any;
  };
  export const checkout: {
    createCheckout(options?: any): Promise<any>;
    ChannelType: any;
  };
}

declare module '@wix/redirects' {
  export const redirects: {
    createRedirectSession(options?: any): Promise<any>;
  };
}

declare module '@wix/services-manager-react' {
  export function useWixModules(): any;
  export function useService<T = any>(service?: T): any;
}

declare module '@wix/ecom/services' {
  export const currentCart: any;
  export const CurrentCartServiceDefinition: any;
}

declare module '@wix/seo/components' {
  export const SEO: any;
}

declare module '@wix/seo/services' {
  export function loadSEOTagsServiceConfig(options?: any): Promise<any>;
}

declare module '@wix/image-kit' {
  export type FittingType = 'fill' | 'fit';
  export type ImageTransformOptions = any;
  export const getPlaceholder: any;
  export const sdk: any;
  export const STATIC_MEDIA_URL: string;
}
