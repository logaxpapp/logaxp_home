//App.tsx

import React, { useEffect, Suspense, lazy, startTransition } from 'react';
import { useSelector } from 'react-redux';
import { useGetCsrfTokenQuery } from './api/usersApi';
import { useAppDispatch } from './app/hooks';
import { setCsrfToken } from './store/slices/csrfSlice';
import { RootState } from './app/store';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Loader from './components/Loader';
import SessionExpiredModal from './components/SessionExpiredModal';
import { connectSocket } from './socket';
import { useParams } from 'react-router-dom';




import ThankYou from './pages/ThankYou';
import ContractCreate from './components/Contracts/Admin/ContractCreate';
import ContractorEdit from './components/Contracts/Admin/ContractorEdit';
import ContractEdit from './components/Contracts/Admin/ContractEdit';

const CreateReferenceForm = lazy(() => import('./components/Reference/CreateReferenceForm'));
const ReferencesManagement = lazy(() => import('./components/Reference/ReferencesManagement'));
const  AddRefereeForm = lazy(() => import('./components/Reference/AddRefereeForm'));
const  RefereeDetailPage = lazy(() => import('./components/Reference/RefereeDetailPage'));
import EditRefereeForm from './components/Reference/EditRefereeForm';
const  AuditReference = lazy(() => import('./components/Reference/AuditReference'));
const ReferenceDetail = lazy(() => import('./components/Reference/ReferenceDetail'));
const PublicReferenceForm = lazy(() => import('./components/Reference/PublicReferenceForm'));
import SendInvitation from './components/Board/InvitationForm';
const AcceptInvitation = lazy(() => import('./components/Board/AcceptInvitationPage'));

// Lazy-loaded components
const Home = lazy(() => import('./pages/Home/Home'));
const FAQ = lazy(() => import('./pages/FAQ/FAQ'));
const FAQDetail = lazy(() => import('./pages/FAQ/FAQDetail'));
const About = lazy(() => import('./pages/About/About'));
const Contact = lazy(() => import('./pages/ContactUs/ContactUs'));
const PrivacyStatement = lazy(() => import('./pages/Privacy/PrivacyStatement'));
const Legal = lazy(() => import('./pages/Legal/Legal'));
const Login = lazy(() => import('./pages/Login/Login'));
const PasswordReset = lazy(() => import('./pages/PasswordReset/PasswordReset'));
const SetupAccount = lazy(() => import('./components/UserList/SetupAccount'));
const AllProducts = lazy(() => import('./components/FeaturedProducts/AllProducts'));
const Blogs = lazy(() => import('./components/Blogs/Blogs'));
const BlogDetail = lazy(() => import('./components/Blogs/BlogDetail'));
const AllPosts = lazy(() => import('./components/Blogs/AllPosts'));
const Dashboard = lazy(() => import('./components/Dashboard/Dashboard'));
const DashboardHome = lazy(() => import('./components/DashboardHome/DashboardHome'));
const UserList = lazy(() => import('./components/UserList/UserList'));
const CreateUserForm = lazy(() => import('./components/CreateUserForm/CreateUserForm'));
const UserApprovalRequests = lazy(() => import('./components/ManageApprovals'));
const SurveyList = lazy(() => import('./components/Survey/SurveyList'));

const CreateApprovalRequest = lazy(() => import('./components/CreateApprovalRequest'));
const ApprovalRequestDetails = lazy(() => import('./components/ApprovalRequestDetails'));
const Appraisal = lazy(() => import('./components/Appraisal/AppraisalManagement'));
const Admin = lazy(() => import('./pages/Admin/Admin'));
const AdminAppraisalPeriods = lazy(() => import('./components/Appraisal/AdminAppraisalPeriods'));
const TicketDetails = lazy(() => import('./pages/Tickets/TicketDetails'));
const MyTickets = lazy(() => import('./pages/Tickets/TicketManagement'));
const AllTicket = lazy(() => import('./pages/Tickets/AllTicket'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const ApprovalRequestList = lazy(() => import('./components/Appraisal/ApprovalRequestList'));
const AppraisalPeriodLists = lazy(() => import('./components/Appraisal/AppraisalPeriodList'));
const AdminReports = lazy(() => import('./components/Appraisal/AdminReports'));
const LoggedInUsersList = lazy(() => import('./components/LoggedInUsersList'));
const ShiftTypeList = lazy(() => import('./components/ShiftType/ShiftTypeList'));
const ShiftList = lazy(() => import('./components/Shift/ShiftList'));
const ShiftManagement = lazy(() => import('./components/ShiftManagemant'));
const UserManagement = lazy(() => import('./components/UserManagement'));
const ProfileSettings = lazy(() => import('./pages/Profile/ProfileSettings'));
const ManageSurvey = lazy(() => import('./components/Survey/ManageSurvey'));
const CreateSurvey = lazy(() => import('./components/Survey/CreateSurvey'));
const EditSurvey = lazy(() => import('./components/Survey/EditSurvey'));
const MySurvey = lazy(() => import('./components/Survey/MySurvey'));
const SurveyView = lazy(() => import('./components/Survey/SurveyView'));
const SubmitSurveyResponses = lazy(() => import('./components/Survey/SubmitSurveyResponses'));
const SurveyResponses = lazy(() => import('./components/Survey/SurveyResponses'));
const MySurveyResponses = lazy(() => import('./components/Survey/MySurveyResponses'));
const MySurveyList = lazy(() => import('./components/Survey/MySurveyList'));
const SurveyResponsesList = lazy(() => import('./components/Survey/SurveyResponsesList'));
const SurveyResponsesDetailWrapper = lazy(() => import('./components/Survey/SurveyResponsesDetailWrapper'));
const MyShifts = lazy(() => import('./components/Shift/MyShifts'));
const OpenShifts = lazy(() => import('./components/Shift/OpenShifts'));
const ShiftsPage = lazy(() => import('./components/Shift/ShiftsPage'));
const ShiftsCalendar = lazy(() => import('./components/Shift/ShiftCalendar'));
const IntegrateCalendar = lazy(() => import('./components/Shift/IntegrateGoogle'));
const TimeManagement = lazy(() => import('./components/Time/TimeManagement'));
const ClockInOutPage = lazy(() => import('./components/Time/ClockInOutPage'));
const ResourceList = lazy(() => import('./components/Resources/ResourceList'));
const IncidentList = lazy(() => import('./components/Incidents/IncidentManagement'));
const ResourceDetails = lazy(() => import('./components/Resources/ResourceDetail'));
const  UserResourceList = lazy(() => import('./components/Resources/UserResources'));
const PolicyAcknowledgement = lazy(() => import('./components/Resources/PolicyAcknowledgement'));
const ResourcesManage = lazy(() => import('./components/Resources/ResourcesManage'));
const Support = lazy(() => import('./components/Support/Support'));
const AdminSupportDashboard = lazy(() => import('./components/Support/AdminSupportDashboard'));
const TicketDetailPage = lazy(() => import('./components/Support/TicketDetailPage'));
const EmployeePayPeriodsList = lazy(() => import('./components/EmployeePayPeriods/PayPeriodsManagement'));
const EmployeePayPeriodDetails = lazy(() => import('./components/EmployeePayPeriods/EmployeePayPeriodDetail'));
const EmployeePayPeriodCreate  = lazy(() => import('./components/EmployeePayPeriods/EmployeePayPeriodCreate'));
const EditUserForm = lazy(() => import('./components/UserList/EditUserForm'));
const AdminChangeRequestsDashboard = lazy(() => import('./components/changeRequest/AdminChangeRequestsDashboard'));
const CreateChangeRequest = lazy(() => import('./components/changeRequest/CreateChangeRequestForm'));
const MyChangeRequests = lazy(() => import('./components/changeRequest/MyChangeRequest'));
const DeletedChangeRequests = lazy(() => import('./components/changeRequest/DeletedChangeRequests'));
const ChangeRequestDetail = lazy(() => import('./components/changeRequest/ChangeRequestDetail'));
const ArticleList = lazy(() => import('./components/Article/ArticleList'));
const ArticleDetail = lazy(() => import('./components/Article/ArticleDetail'));
const ArticleEditor = lazy(() => import('./components/Article/ArticleEditor'));
const AdminArticleList = lazy(() => import('./components/Article/AdminArticleList'));
const UserArticleList = lazy(() => import('./components/Article/ArticleManagement'));
const Notifications = lazy(() => import('./components/Notifications/Notifications'));
const Chat = lazy(() => import('./components/Chat/Chat'));
const ListFaqs = lazy(() => import('./pages/FAQ/ListFaqs'));
const ManageNewsletter = lazy(() => import('./components/NewsLetter/ManageNewsletter'));
const PolicyPage = lazy(() => import('./components/Resources/PolicyPage'));
const AdminContractPage = lazy(() => import('./components/Contracts/Admin/AdminPage'));
const ContractorPage = lazy(() => import('./components/Contracts/Contractors/ContractorPage'));
const ContractorDetails = lazy(() => import('./components/Contracts/Admin/ContractorDetails'));
import ContractorContractDetails from './components/Contracts/Contractors/ContractorContractDetails';
const ContractorPayment = lazy(() => import('./components/Contracts/Payments/ContractorPayment'));
const ContractDetails = lazy(() => import('./components/Contracts/Admin/ContractDetails'));
const ListTeams = lazy(() => import('./components/Team/ListTeams'));
const TeamDetail = lazy(() => import('./components/Team/TeamDetail'));
const ListSubContractors = lazy(() => import('./components/SubContractor/ListSubContractors'));
const SubContractorDetail = lazy(() => import('./components/SubContractor/SubContractorDetail'));
const KanbanBoard = lazy(() => import('./components/Board/KanbanBoard'));
const BoardList = lazy(() => import('./components/Board/BoardList'));
const BoardDetail = lazy(() => import('./components/Board/BoardDetails'));
const ViewList = lazy(() => import('./components/Board/ViewList'));
const ViewMember = lazy(() => import('./components/Board/ViewMember'));
const DocumentManager = lazy(() => import('./components/Document/DocumentParent'));
const ProtectedDocumentManager = lazy(() => import('./components/Document/ProtectedDocumentManager'));
const DocumentDetails = lazy(() => import('./components/Document/DocumentDetails'));
const SentDocuments = lazy(() => import('./components/Document/SentDocuments'));
const ReportManagement = lazy(() => import('./components/Report/ReportManagement'));
const ReportPage = lazy(() => import('./components/Report/ReportPage'));
const MyNotification = lazy(() => import('./components/Notifications/MyNotification'));
const WhiteboardManager = lazy(() => import('./pages/Whiteboard/WhiteboardManager'));



// Reusable components
const ProtectedRoute = lazy(() => import('./components/common/ProtectedRoute/ProtectedRoute'));
import ErrorBoundary from './components/common/ErrorBoundary/ErrorBoundary'; // Not lazy-loaded
const Layout = lazy(() => import('./components/Layout'));



const App: React.FC = () => {
  const theme = useSelector((state: RootState) => state.theme.mode);
  const dispatch = useAppDispatch();
  const { data: csrfData, error: csrfError } = useGetCsrfTokenQuery();

   // Select session expiration state
   const isSessionExpired = useSelector((state: RootState) => state.session.isSessionExpired);

   function SendInvitationWrapper() {
    const { boardId } = useParams();
    if (!boardId) return <p>No boardId in URL</p>;
    return <SendInvitation boardId={boardId} />;
  }

  

   useEffect(() => {
    if (csrfData?.csrfToken) {
      console.log('Frontend Fetched CSRF Token:', csrfData.csrfToken); // Debugging the CSRF token
      dispatch(setCsrfToken(csrfData.csrfToken));
    } else if (csrfError) {
      console.error('Failed to fetch CSRF token:', csrfError);
    }
  }, [csrfData, csrfError, dispatch]);

  const token = useSelector((state: RootState) => state.auth.user?.token);
  const userId = useSelector((state: RootState) => state.auth.user?._id);

  useEffect(() => {
    if (token && userId) {
      connectSocket(token, userId);
    }
  }, [token, userId]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-900 transition-colors duration-300">
        {isSessionExpired && <SessionExpiredModal />}
      <ErrorBoundary>
       
          <Suspense fallback={<Loader />}>
            <Layout>
              <Routes>
                {/* Public Routes */}
                <Route
                  path="/"
                  element={
                    <Suspense fallback={<Loader />}>
                      <Home />
                    </Suspense>
                  }
                />
                <Route
                  path="/faq"
                  element={
                    <Suspense fallback={<Loader />}>
                      <FAQ />
                    </Suspense>
                  }
                />
                <Route
                path="/articles"
                element={
                  <Suspense fallback={<Loader />}>
                    <ArticleList />
                  </Suspense>
                }
              />
              <Route
                path="/articles/:slug"
                element={
                  <Suspense fallback={<Loader />}>
                    <ArticleDetail />
                  </Suspense>
                }
              />
                <Route
                  path="/about"
                  element={
                    <Suspense fallback={<Loader />}>
                      <About />
                    </Suspense>
                  }
                />
                <Route
                  path="/contact"
                  element={
                    <Suspense fallback={<Loader />}>
                      <Contact />
                    </Suspense>
                  }
                />
                <Route
                  path="/privacy-statement"
                  element={
                    <Suspense fallback={<Loader />}>
                      <PrivacyStatement />
                    </Suspense>
                  }
                />
                <Route
                  path="/legal"
                  element={
                    <Suspense fallback={<Loader />}>
                      <Legal />
                    </Suspense>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <Suspense fallback={<Loader />}>
                      <Login />
                    </Suspense>
                  }
                />
                <Route
                  path="/password-reset"
                  element={
                    <Suspense fallback={<Loader />}>
                      <PasswordReset />
                    </Suspense>
                  }
                />
                <Route
                  path="/setup-account"
                  element={
                    <Suspense fallback={<Loader />}>
                      <SetupAccount />
                    </Suspense>
                  }
                />
                <Route
                  path="/all-products"
                  element={
                    <Suspense fallback={<Loader />}>
                      <AllProducts />
                    </Suspense>
                  }
                />
                <Route
                  path="/blogs"
                  element={
                    <Suspense fallback={<Loader />}>
                      <Blogs />
                    </Suspense>
                  }
                />
                <Route
                  path="/blogs/:id"
                  element={
                    <Suspense fallback={<Loader />}>
                      <BlogDetail />
                    </Suspense>
                  }
                />
                <Route
                  path="/all-posts"
                  element={
                    <Suspense fallback={<Loader />}>
                      <AllPosts />
                    </Suspense>
                  }
                />

                {/* Protected Routes */}
                <Route
                  element={
                    <Suspense fallback={<Loader />}>
                      <ProtectedRoute />
                    </Suspense>
                  }
                >
                  <Route
                    path="/dashboard"
                    element={
                      <Suspense fallback={<Loader />}>
                        <Dashboard />
                      </Suspense>
                    }
                  >
                    <Route
                      path="notifications"
                      element={
                        <Suspense fallback={<Loader />}>
                          <Notifications />
                        </Suspense>
                      }
                      />
                      <Route
                        path="chat/:chatType/:chatId"
                        element={
                          <Suspense fallback={<Loader />}>
                            <Chat />
                          </Suspense>
                        }
                      />
                    <Route
                    path="articles/create"
                    element={
                      <Suspense fallback={<Loader />}>
                        <ArticleEditor />
                      </Suspense>
                    }
                  />
                  <Route
                    path="articles/edit/:id"
                    element={
                      <Suspense fallback={<Loader />}>
                        <ArticleEditor />
                      </Suspense>
                    }
                  />
                  <Route
                    path="admin-articles"
                    element={
                      <Suspense fallback={<Loader />}>
                        < AdminArticleList />
                      </Suspense>
                    }
                  />
                  <Route
                    path="user-articles"
                    element={
                      <Suspense fallback={<Loader />}>
                        <UserArticleList />
                      </Suspense>
                    }
                  />
                    <Route
                      index
                      element={
                        <Suspense fallback={<Loader />}>
                          <DashboardHome />
                        </Suspense>
                      }
                    />
                    <Route
                      path="tickets"
                      element={
                        <Suspense fallback={<Loader />}>
                          <MyTickets />
                        </Suspense>
                      }
                    />
                    <Route
                      path="tickets/all"
                      element={
                        <Suspense fallback={<Loader />}>
                          <AllTicket />
                        </Suspense>
                      }
                    />
                    <Route
                      path="tickets/:id"
                      element={
                        <Suspense fallback={<Loader />}>
                          <TicketDetails />
                        </Suspense>
                      }
                    />
                    <Route path="users" element={<UserList />} />
                    <Route path="users/edit/:id" element={<EditUserForm />} />
                    <Route
                      path="user-management"
                      element={
                        <Suspense fallback={<Loader />}>
                          <UserManagement />
                        </Suspense>
                      }
                    />
                    <Route
                      path="settings"
                      element={
                        <Suspense fallback={<Loader />}>
                          <Profile />
                        </Suspense>
                      }
                    />
                   
                    <Route
                      path="surveys"
                      element={
                        <Suspense fallback={<Loader />}>
                          <SurveyList />
                        </Suspense>
                      }
                    />
                    <Route
                      path="surveys/:surveyId"
                      element={
                        <Suspense fallback={<Loader />}>
                          <SurveyView />
                        </Suspense>
                      }
                    />
                    <Route
                      path="surveys/:surveyId/assignments/:assignmentId"
                      element={
                        <Suspense fallback={<Loader />}>
                          <SubmitSurveyResponses />
                        </Suspense>
                      }
                    />
                    <Route
                      path="surveys/create"
                      element={
                        <Suspense fallback={<Loader />}>
                          <CreateSurvey />
                        </Suspense>
                      }
                    />
                    <Route
                      path="manage-surveys"
                      element={
                        <Suspense fallback={<Loader />}>
                          <ManageSurvey />
                        </Suspense>
                      }
                    />
                    <Route
                      path="my-surveys"
                      element={
                        <Suspense fallback={<Loader />}>
                          <MySurvey />
                        </Suspense>
                      }
                    />
                    <Route
                      path="edith-survey/:surveyId" 
                      element={
                        <Suspense fallback={<Loader />}>
                          <EditSurvey />
                        </Suspense>
                      }
                    />
                    <Route
                      path="my-responses"
                      element={
                        <Suspense fallback={<Loader />}>
                          <MySurveyResponses />
                        </Suspense>
                      }
                    />
                    <Route
                      path="survey-responses"
                      element={
                        <Suspense fallback={<Loader />}>
                          <SurveyResponses />
                        </Suspense>
                      }
                    />
                    <Route
                      path="survey-responses-list"
                      element={
                        <Suspense fallback={<Loader />}>
                          <SurveyResponsesList />
                        </Suspense>
                      }
                    />
                    <Route
                      path="survey-responses-detail/:id"
                      element={
                        <Suspense fallback={<Loader />}>
                          <SurveyResponsesDetailWrapper />
                        </Suspense>
                      }
                    />
                    <Route
                      path="Manage-my-surveys"
                      element={
                        <Suspense fallback={<Loader />}>
                          <MySurveyList />
                        </Suspense>
                      }
                    />
                    
                    <Route
                      path="create-approval"
                      element={
                        <Suspense fallback={<Loader />}>
                          <CreateApprovalRequest />
                        </Suspense>
                      }
                    />
                    <Route
                      path="user-approvals"
                      element={
                        <Suspense fallback={<Loader />}>
                          <UserApprovalRequests />
                        </Suspense>
                      }
                    />
                    <Route
                      path="user-approvals/:id"
                      element={
                        <Suspense fallback={<Loader />}>
                          <ApprovalRequestDetails />
                        </Suspense>
                      }
                    />
                    <Route
                      path="appraisal"
                      element={
                        <Suspense fallback={<Loader />}>
                          <Appraisal />
                        </Suspense>
                      }
                    />
                    <Route
                      path="admin"
                      element={
                        <Suspense fallback={<Loader />}>
                          <Admin />
                        </Suspense>
                      }
                    />
                    <Route
                      path="appraisal-list"
                      element={
                      <Suspense fallback={<Loader />}>
                        <ApprovalRequestList />
                      </Suspense>
                     }
                    />
                    <Route
                      path="appraisal-periods"
                      element={
                        <Suspense fallback={<Loader />}>
                          <AppraisalPeriodLists />
                        </Suspense>
                      }
                    />
                    <Route
                      path="reports"
                      element={
                        <Suspense fallback={<Loader />}>
                          <AdminReports />
                        </Suspense>
                      }
                    />
                    <Route
                      path="logged-in-users"
                      element={
                        <Suspense fallback={<Loader />}>
                          <LoggedInUsersList />
                        </Suspense>
                      }
                    />
                    <Route
                      path="scheduling"
                      element={
                        <Suspense fallback={<Loader />}>
                          <ShiftManagement />
                        </Suspense>
                      }
                    />
                    <Route
                      path="shift-calendar"
                      element={
                        <Suspense fallback={<Loader />}>
                          <ShiftsCalendar />
                        </Suspense>
                      }
                      />
                      <Route
                      path="integrate-google"
                      element={
                        <Suspense fallback={<Loader />}>
                          <IntegrateCalendar />
                        </Suspense>
                      }
                      />
                    <Route
                      path="Manage-shifts"
                      element={
                        <Suspense fallback={<Loader />}>
                          <ShiftsPage />
                        </Suspense>
                      }
                      />
                    <Route
                      path="my-shift"
                      element={
                        <Suspense fallback={<Loader />}>
                          <MyShifts />
                        </Suspense>
                      }
                      />
                      <Route
                      path="open-shifts"
                      element={
                        <Suspense fallback={<Loader />}>
                          <OpenShifts />
                        </Suspense>
                      }
                      />
                    <Route
                       path="admin/shifts/types"
                      element={
                        <Suspense fallback={<Loader />}>
                          <ShiftTypeList />
                        </Suspense>
                      }
                    />
                    <Route
                      path="admin/shifts"
                      element={
                        <Suspense fallback={<Loader />}>
                          <ShiftList />
                        </Suspense>
                      }
                    />
                    <Route
                      path="admin/appraisal-periodsE"
                      element={
                        <Suspense fallback={<Loader />}>
                          <AdminAppraisalPeriods />
                        </Suspense>
                      }
                    />
                    <Route
                      path="profile-settings"
                      element={
                        <Suspense fallback={<Loader />}>
                          <ProfileSettings />
                        </Suspense>
                      }
                    />
                    <Route
                      path="time-management"
                      element={
                        <Suspense fallback={<Loader />}>
                          <TimeManagement />
                        </Suspense>
                      }
                      />
                      <Route
                      path="clock-in-out"
                      element={
                        <Suspense fallback={<Loader />}>
                          <ClockInOutPage />
                        </Suspense>
                      }
                      />
                      <Route
                      path="resources"
                      element={
                        <Suspense fallback={<Loader />}>
                          <ResourceList />
                        </Suspense>
                      }

                      />
                      <Route
                      path="resources/:id"
                      element={
                        <Suspense fallback={<Loader />}>
                          <ResourceDetails />
                        </Suspense>
                      }
                      />
                      <Route
                      path="user-resources"
                      element={
                        <Suspense fallback={<Loader />}>
                          <UserResourceList />
                        </Suspense>
                      }
                      />
                      <Route
                      path="policy-acknowledgement"
                      element={
                        <Suspense fallback={<Loader />}>
                          <PolicyAcknowledgement />
                        </Suspense>
                      }
                      />
                      <Route
                      path="manage-resources"
                      element={
                        <Suspense fallback={<Loader />}>
                          <ResourcesManage />
                        </Suspense>
                      }
                      />
                      <Route
                      path="support"
                      element={
                        <Suspense fallback={<Loader />}>
                          <Support />
                        </Suspense>
                      }
                      />
                      <Route
                      path="support-tickets/:ticketId"
                      element={
                        <Suspense fallback={<Loader />}>
                          <TicketDetailPage />
                        </Suspense>
                      }
                      />
                      <Route
                      path="incidents"
                      element={
                        <Suspense fallback={<Loader />}>
                          <IncidentList />
                        </Suspense>
                      }
                      />
                      <Route
                      path="admin/support"
                      element={
                        <Suspense fallback={<Loader />}>
                          <AdminSupportDashboard />
                        </Suspense>
                      }
                      />
                      <Route
                      path="employeePayPeriods"
                      element={
                        <Suspense fallback={<Loader />}>
                          <EmployeePayPeriodsList />
                        </Suspense>
                      }
                      />
                      <Route
                      path="employeePayPeriods/create"
                      element={
                        <Suspense fallback={<Loader />}>
                          <EmployeePayPeriodCreate />
                        </Suspense>
                      }
                      />
                      <Route
                      path="employeePayPeriods/:id"
                      element={
                        <Suspense fallback={<Loader />}>
                          <EmployeePayPeriodDetails />
                        </Suspense>
                      }
                      />
                      <Route
                      path="admin/change-requests"
                      element={
                        <Suspense fallback={<Loader />}>
                          <AdminChangeRequestsDashboard />
                        </Suspense>
                      }
                      />
                       <Route
                      path="create-change-request"
                      element={
                        <Suspense fallback={<Loader />}>
                          <CreateChangeRequest />
                        </Suspense>
                      }
                    />
                    <Route
                      path="my-change-requests"
                      element={
                        <Suspense fallback={<Loader />}>
                          <MyChangeRequests />
                        </Suspense>
                      }
                    />
                    <Route
                      path="deleted-change-requests"
                      element={
                        <Suspense fallback={<Loader />}>
                          <DeletedChangeRequests />
                        </Suspense>
                      }
                    />
                    <Route
                      path="change-request-details/:id"
                      element={
                        <Suspense fallback={<Loader />}>
                          <ChangeRequestDetail />
                        </Suspense>
                      }
                    />
                    <Route
                      path="faqs"
                      element={
                        <Suspense fallback={<Loader />}>
                          <ListFaqs />
                        </Suspense>
                      }
                    />
                    <Route
                      path="faqs/:id"
                      element={
                        <Suspense fallback={<Loader />}>
                          <FAQDetail />
                        </Suspense>
                      }
                    />
                    <Route
                      path="policy/:policyId"
                      element={
                        <Suspense fallback={<Loader />}>
                          <PolicyPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path="admin-subscriptions"
                      element={
                        <Suspense fallback={<Loader />}>
                          <ManageNewsletter />
                        </Suspense>
                      }
                    />
                    <Route
                      path="admin/contracts"
                      element={
                        <Suspense fallback={<Loader />}>
                          <AdminContractPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path="contractor/contracts"
                      element={
                        <Suspense fallback={<Loader />}>
                          <ContractorPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path="admin/contracts/create"
                      element={
                        <Suspense fallback={<Loader />}>
                          <ContractCreate />
                        </Suspense>
                      }
                    />
                    <Route
                      path="contractor/contracts/:id"
                      element={
                        <Suspense fallback={<Loader />}>
                          <ContractorDetails />
                        </Suspense>
                      }
                    />
                    <Route
                      path="admin/contracts/:id"
                      element={
                        <Suspense fallback={<Loader />}>
                          <ContractorEdit />
                        </Suspense>
                      }
                    />
                    <Route
                      path="admin/contractors/:id/edit"
                      element={
                        <Suspense fallback={<Loader />}>
                          <ContractorEdit />
                        </Suspense>
                      }
                    />
                    <Route
                      path="admin/contracts/:id/edit"
                      element={
                        <Suspense fallback={<Loader />}>
                          <ContractEdit />
                        </Suspense>
                      }
                    />
                    <Route
                      path="contractors/contracts/:id"
                      element={
                        <Suspense fallback={<Loader />}>
                          <ContractorContractDetails />
                        </Suspense>
                      }
                    />
                    <Route
                      path="contractor/payments"
                      element={
                        <Suspense fallback={<Loader />}>
                          <ContractorPayment />
                        </Suspense>
                      }
                    />
                    <Route
                      path="admin/contracts/:id/details"
                      element={
                        <Suspense fallback={<Loader />}>
                          <ContractDetails />
                        </Suspense>
                      }
                      />
                      <Route
                      path="contractor/team/list"
                      element={
                        <Suspense fallback={<Loader />}>
                          <ListTeams />
                        </Suspense>
                      } 
                      />
                      <Route
                      path="teams/:id"
                      element={
                        <Suspense fallback={<Loader />}>
                          <TeamDetail />
                        </Suspense>
                      }
                      />
                      <Route
                      path="subcontractors"
                      element={
                        <Suspense fallback={<Loader />}>
                          <ListSubContractors />
                        </Suspense>
                      }
                      />
                      <Route
                      path="subcontractors/:id"
                      element={
                        <Suspense fallback={<Loader />}>
                          <SubContractorDetail />
                        </Suspense>
                      }
                      />
                      <Route
                        path="/dashboard/boards/:boardId/kanban"
                        element={
                          <Suspense fallback={<Loader />}>
                            <KanbanBoard />
                          </Suspense>
                        }
                      />
                      <Route
                    path="board-list"
                    element={
                      <Suspense fallback={<Loader />}>
                        <BoardList />
                      </Suspense>
                    }
                  />
                  <Route
                    path="boards/:boardId/detail"
                    element={
                      <Suspense fallback={<Loader />}>
                        <BoardDetail />
                      </Suspense>
                    }
                  />
                  <Route
                  path="lists/:listId"
                  element={
                    <Suspense fallback={<Loader />}>
                      <ViewList />
                    </Suspense>
                  }
                />
                <Route
                    path="board/users/:userId"
                    element={
                      <Suspense fallback={<Loader />}>
                        <ViewMember />
                      </Suspense>
                    }
                  />

                  <Route
                    path="documents"
                    element={
                      <Suspense fallback={<Loader />}>
                        <DocumentManager />
                      </Suspense>
                    }
                  />
                  <Route
                    path="documents/:docId/details"
                    element={
                      <Suspense fallback={<Loader />}>
                        <DocumentDetails />
                      </Suspense>
                    }
                  />
                  <Route
                    path="documents/protected"
                    element={
                      <Suspense fallback={<Loader />}>
                        <ProtectedDocumentManager />
                      </Suspense>
                    }
                  />
                  <Route
                    path="documents/sent"
                    element={
                      <Suspense fallback={<Loader />}>
                        <SentDocuments />
                      </Suspense>
                    }
                  />
                  <Route
                    path="board-reports"
                    element={
                      <Suspense fallback={<Loader />}>
                        <ReportManagement />
                      </Suspense>
                    }
                  />
                  <Route
                    path="board-reports/:reportId"
                    element={
                      <Suspense fallback={<Loader />}>
                        <ReportPage />
                      </Suspense>
                    }
                    />
                    <Route
                    path="references/:referenceId"
                    element={
                    <Suspense fallback={<Loader />}>
                      <ReferenceDetail />
                    </Suspense>
                    }
                    />
                    <Route
                    path="references"
                    element={
                      <Suspense fallback={<Loader />}>
                        <ReferencesManagement />
                      </Suspense>
                    }
                    />
                    <Route
                    path="references/create"
                    element={
                      <Suspense fallback={<Loader />}>
                        <CreateReferenceForm />
                      </Suspense>
                    }
                    />
                    <Route
                    path="referees/add"
                    element={
                      <Suspense fallback={<Loader />}>
                        < AddRefereeForm />
                      </Suspense>
                    }
                    />
                    <Route
                    path="referees/edit/:id"
                    element={
                      <Suspense fallback={<Loader />}>
                        <EditRefereeForm />
                      </Suspense>
                    }
                    />
                     <Route
                    path="references/audit/:referenceId"
                    element={
                      <Suspense fallback={<Loader />}>
                        <AuditReference />
                      </Suspense>
                    }
                    />
                    
                    <Route
                    path="referees/:id"
                    element={
                      <Suspense fallback={<Loader />}>
                        <RefereeDetailPage />
                      </Suspense>
                    }
                    />
                    <Route
                      path="boards/:boardId/send-invitation"
                      element={
                        <Suspense fallback={<Loader />}>
                          <SendInvitationWrapper />
                        </Suspense>
                      }
                    />
                     <Route
                    path="my-notifications"
                    element={
                      <Suspense fallback={<Loader />}>
                        <MyNotification />
                      </Suspense>
                    }
                  />
                  </Route>
                 
                  <Route
                    path="/create-user"
                    element={
                      <Suspense fallback={<Loader />}>
                        <CreateUserForm />
                      </Suspense>
                    }
                  />
                 

                </Route>
               
                <Route
                  path="/apparisal-list"
                  element={
                   <Suspense fallback={<Loader />}>
                     <ApprovalRequestList />
                   </Suspense>
                  }
                />
                {/* Fallback Route */}
                <Route path="*" element={<Navigate to="/" replace />} />
                <Route
                  path="/fill-reference"
                  element={<PublicReferenceForm />}
                />
                <Route
                    path="/invite/accept"
                    element={
                      <Suspense fallback={<Loader />}>
                        <AcceptInvitation />
                      </Suspense>
                    }
                  />
                <Route
                  path="/thank-you"
                  element={<Suspense fallback={<Loader />}>
                    <ThankYou />
                  </Suspense>
                    }
                />    
              </Routes>
            </Layout>
          </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default App;
