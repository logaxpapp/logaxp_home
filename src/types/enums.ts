// src/types/enums.ts

export enum Application {
    LogaBeauty = 'LogaBeauty',
    GatherPlux = 'GatherPlux',
    TimeSync = 'TimeSync',
    BookMiz = 'BookMiz',
    DocSend = 'DocSend',
    ProFixer = 'ProFixer',
    // Add more applications as needed
  }
  
  export enum UserRole {
    Admin = 'admin',
    Support = 'support',
    User = 'user',
    Approver = 'approver',
  }
  
  export enum UserStatus {
    Pending = 'Pending',
    Active = 'Active',
    Suspended = 'Suspended',
    PendingDeletion = 'Pending Deletion',
    Inactive = 'Inactive',
  }


  export enum Permission {
    READ_USERS = 'read_users',
    EDIT_USERS = 'edit_users',
    DELETE_USERS = 'delete_users',
    MANAGE_ROLES = 'manage_roles',
    READ_SETTINGS = 'read_settings',
    EDIT_SETTINGS = 'edit_settings',
    // Add more as needed
  }
  
  export enum OnboardingStep {
    WelcomeEmail = 'WelcomeEmail',
    ProfileSetup = 'ProfileSetup',
    SystemTraining = 'SystemTraining',
    ComplianceTraining = 'ComplianceTraining',
    FirstTask = 'FirstTask',
    // Add other onboarding steps as needed
  }
  

  export enum OnlineStatus {
    Online = 'online',
    Offline = 'offline',
    Busy = 'busy',
    Away = 'away',
  }


  export enum SubscriptionStatus {
    Pending = 'Pending',
    Confirmed = 'Confirmed',
    Unsubscribed = 'Unsubscribed',
  }
  