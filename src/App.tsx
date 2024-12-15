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

import { useAppSelector } from './app/hooks';
import { connectSocket } from './socket';


// Lazy-loaded components
const Home = lazy(() => import('./pages/Home/Home'));
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
const UserApprovalRequests = lazy(() => import('./components/UserApprovalRequests'));
const SurveyList = lazy(() => import('./components/Survey/SurveyList'));

const CreateApprovalRequest = lazy(() => import('./components/CreateApprovalRequest'));
const ApprovalRequestDetails = lazy(() => import('./components/ApprovalRequestDetails'));
const Appraisal = lazy(() => import('./components/Appraisal/Appraisal'));
const Admin = lazy(() => import('./pages/Admin/Admin'));
const AdminAppraisalPeriods = lazy(() => import('./components/Appraisal/AdminAppraisalPeriods'));
const TicketDetails = lazy(() => import('./pages/Tickets/TicketDetails'));
const MyTickets = lazy(() => import('./pages/Tickets/MyTicket'));
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
const IncidentList = lazy(() => import('./components/Incidents/IncidentList'));
const ResourceDetails = lazy(() => import('./components/Resources/ResourceDetail'));
const  UserResourceList = lazy(() => import('./components/Resources/UserResources'));
const PolicyAcknowledgement = lazy(() => import('./components/Resources/PolicyAcknowledgement'));
const ResourcesManage = lazy(() => import('./components/Resources/ResourcesManage'));
const Support = lazy(() => import('./components/Support/Support'));
const AdminSupportDashboard = lazy(() => import('./components/Support/AdminSupportDashboard'));
const TicketDetailPage = lazy(() => import('./components/Support/TicketDetailPage'));
const EmployeePayPeriodsList = lazy(() => import('./components/EmployeePayPeriods/EmployeePayPeriodsList'));
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
const  AdminArticleList = lazy(() => import('./components/Article/AdminArticleList'));
const UserArticleList = lazy(() => import('./components/Article/UserArticleList'));
const Notifications = lazy(() => import('./components/Notifications/Notifications'));
const Chat = lazy(() => import('./components/Chat/Chat'));




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
              </Routes>
            </Layout>
          </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default App;
