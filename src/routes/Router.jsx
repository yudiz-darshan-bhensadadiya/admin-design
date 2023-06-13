import { lazy } from 'react'
import { route } from 'shared/constants/AllRoutes'

const PublicRoute = lazy(() => import('routes/PublicRoutes'))
const PrivateRoute = lazy(() => import('routes/PrivateRoutes'))

// public Routes Files
const Login = lazy(() => import('views/auth/login'))
const ForgotPassword = lazy(() => import('views/auth/forgot-password'))
const ResetPassword = lazy(() => import('views/auth/reset-password'))

// Private Routes Files
const Profile = lazy(() => import('views/profile'))
const ChangePassword = lazy(() => import('views/profile/changePassword'))
const Dashboard = lazy(() => import('views/dashboard'))
const AdminMangement = lazy(() => import('views/adminManagement'))
const AddAdminPage = lazy(() => import('views/adminManagement/add'))
const ViewAdmin = lazy(() => import('views/adminManagement/view'))
const EditAdmin = lazy(() => import('views/adminManagement/edit'))
const GameManagement = lazy(() => import('views/gameManagement'))
const AddGamePage = lazy(() => import('views/gameManagement/add'))
const FeatureManagement = lazy(() => import('views/featureManagement'))
const SubjectManagement = lazy(() => import('views/subjectManagement'))
const AboutusMangement = lazy(() => import('views/aboutusMangement'))
const PrivacyPolicy = lazy(() => import('views/privacyPolicy'))
const TermsAndCondition = lazy(() => import('views/termsAndCondition'))

const RoutesDetails = [
  {
    defaultRoute: '',
    Component: PublicRoute,
    props: {},
    isPrivateRoute: false,
    children: [
      { path: '/login', Component: Login, exact: true },
      { path: route.forgotPassword, Component: ForgotPassword, exact: true },
      {
        path: route.resetPassword(':token'),
        Component: ResetPassword,
        exact: true
      }
    ]
  },
  {
    defaultRoute: '',
    Component: PrivateRoute,
    props: {},
    isPrivateRoute: true,
    children: [
      { path: route.editProfile, Component: Profile, exact: true },
      { path: route.changePassword, Component: ChangePassword, exact: true },

      { path: route.dashboard, Component: Dashboard, exact: true },

      {
        path: route.adminManagement,
        Component: AdminMangement,
        exact: true
      },
      { path: route.addAdmin, Component: AddAdminPage, exact: true },
      { path: route.editAdmin(':id'), Component: EditAdmin, exact: true },
      { path: route.viewAdmin(':id'), Component: ViewAdmin, exact: true },
      { path: route.gameManagement, Component: GameManagement, exact: true },
      { path: route.addGame, Component: AddGamePage, exact: true },
      { path: route.editGame(':id', ':type'), Component: AddGamePage, exact: true },

      {
        path: route.featureManagement,
        Component: FeatureManagement,
        exact: true
      },

      {
        path: route.subjectManagement,
        Component: SubjectManagement,
        exact: true
      },

      {
        path: route.aboutusMangement,
        Component: AboutusMangement,
        exact: true
      },
      {
        path: route.privacypolicy,
        Component: PrivacyPolicy,
        exact: true
      },
      {
        path: route.termsandcondition,
        Component: TermsAndCondition,
        exact: true
      },
    ]
  }
]

export default RoutesDetails
