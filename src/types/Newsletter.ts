// src/types/Newsletter.ts

export interface INewsletterSubscription {
    _id: string;
    email: string;
    subscribedAt: string; // ISO Date string
    status: 'Pending' | 'Confirmed' | 'Unsubscribed';
    confirmationToken?: string;
    unsubscribeToken?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface INewsletterSubscriptionResponse {
    data: INewsletterSubscription;
  }
  
  export interface INewsletterSubscriptionListResponse {
    data: INewsletterSubscription[];
    total: number;
    page: number;
    limit: number;
  }
  
  export interface SubscribeRequest {
    email: string;
  }
  
  export interface SendNewsletterRequest {
    subject: string;
    content: string;
  }
  
  export interface SendNewsletterResponse {
    message: string;
  }
  
  export interface ConfirmSubscriptionResponse {
    message: string;
    subscription: {
      email: string;
      subscribedAt: string;
    };
  }
  
  export interface UnsubscribeResponse {
    message: string;
    subscription: {
      email: string;
      unsubscribedAt: string;
    };
  }
  