

export interface ITestCaseVersion {
    versionNumber: number;
    /** 
     * updatedBy can be either a string (user ID)
     * or a populated user object.
     */
    updatedBy: string | {
      _id: string;
      name: string;
      email: string;
    };
    updatedAt: string;  // ISO date string
    changes: string;    // description or summary of what changed
  }
  
  /** Steps for each test */
  export interface ITestStep {
    stepNumber: number;
    action: string;
    expected: string;
  }
  
  /** A single test execution entry (history of runs) */
  export interface ITestExecution {
    executionDate: string; // ISO date string
    executedBy: string;    // user ID (or possibly a user object if populated)
    actualResults: string;
    status: 'Pass' | 'Fail' | 'Blocked' | 'Retest';
    comments?: string;
    recommendations?: string;
    ticketId?: string;      // if linked to a Ticket
  }
  
  /** Each test attachment (e.g., image, doc, etc.). */
  export interface ITestCaseAttachment {
    _id: string;                // from Mongo
    filename: string;
    url: string;
    uploadedAt: string;         // ISO date
    fileType?: string;
    contentType?: string;
    // ...any additional fields
  }
  export interface ITestCase {
    _id: string;
    testId: string;
    feature: string;
    title: string;
    description?: string;
    preconditions?: string[];
    steps?: ITestStep[];
    expectedResults?: string;
    status: 'Not Run' | 'In Progress' | 'Completed';
    comments?: string;
  
    priority?: 'Low' | 'Medium' | 'High';
    severity?: 'Minor' | 'Major' | 'Critical';
    testType?: 'Functional' | 'Regression' | 'Smoke' | 'Performance' | 'Security';
    tags?: string[];
    requirementIds?: string[];
  
    isAutomated?: boolean;
    automationScriptPath?: string;
  
    estimatedExecutionTime?: number;
    lastExecutionTime?: number;
  
    // references
    assignedTo?: string | { _id: string; name: string; email: string };
    createdBy: string | { _id: string; name: string; email: string };
    executions: ITestExecution[];
    attachments?: ITestCaseAttachment[];
  
    versions?: ITestCaseVersion[];
  
    application: string;
    environment: 'development' | 'staging' | 'production';
    createdAt: string; // ISO date
    updatedAt: string; // ISO date
  }
  
  
  /** Minimal user references (optional expansions). */
  type AssignedToUser = {
    _id: string;
    name: string;
    email: string;
  };
  
  type CreatedByUser = {
    _id: string;
    name: string;
    email: string;
  };
  
  /** Payload for creating a new test case (front end => back end). */
  export interface CreateTestCasePayload {
    feature: string;
    title: string;
    description?: string;
    preconditions?: string[];
    steps?: ITestStep[];
    expectedResults?: string;
    comments?: string;
  
    application: string;  // or one of the known apps
    environment: 'development' | 'staging' | 'production';
  
    // new optional fields
    priority?: 'Low' | 'Medium' | 'High';
    severity?: 'Minor' | 'Major' | 'Critical';
    testType?: 'Functional' | 'Regression' | 'Smoke' | 'Performance' | 'Security';
    tags?: string[];
    requirementIds?: string[];
    isAutomated?: boolean;
    automationScriptPath?: string;
    estimatedExecutionTime?: number;
    lastExecutionTime?: number;
  
    // assignedTo?: string; // if your back end allows direct assignment on create
    // createdBy is typically set server-side from req.user?._id
  }
  
  /** Payload for updating an existing test case */
  export interface UpdateTestCasePayload {
    feature?: string;
    title?: string;
    description?: string;
    preconditions?: string[];
    steps?: ITestStep[];
    expectedResults?: string;
    status?: 'Not Run' | 'In Progress' | 'Completed';
    comments?: string;
    assignedTo?: string;
  
    // same new optional fields
    priority?: 'Low' | 'Medium' | 'High';
    severity?: 'Minor' | 'Major' | 'Critical';
    testType?: 'Functional' | 'Regression' | 'Smoke' | 'Performance' | 'Security';
    tags?: string[];
    requirementIds?: string[];
    isAutomated?: boolean;
    automationScriptPath?: string;
    estimatedExecutionTime?: number;
    lastExecutionTime?: number;
  }
  
  /** Payload for assigning a test case */
  export interface AssignTestCasePayload {
    userId: string;
  }
  
  /** Payload for adding a test execution */
  export interface AddTestExecutionPayload {
    executedBy: string; // user ObjectId
    actualResults: string;
    status: 'Pass' | 'Fail' | 'Blocked' | 'Retest';
    comments?: string;
    recommendations?: string;
  }
  

 // e.g. in src/types/testCase.ts or a separate file
export interface TestAnalysisApp {
    _id: string;       // application name
    total: number;
    totalPass: number;
    totalFail: number;
    totalBlocked?: number;
    totalRetest?: number;
  }
  
  export interface TestAnalysis {
    totalTestCases: number;
    totalPass: number;  // etc.
    totalFail: number;
    totalBlocked: number;
    totalRetest: number;
    byApplication: TestAnalysisApp[];
  }
  

  export interface FetchTestCasesParams {
    page?: number;
    limit?: number;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
    createdBy?: string;
    assignedTo?: string;
  }