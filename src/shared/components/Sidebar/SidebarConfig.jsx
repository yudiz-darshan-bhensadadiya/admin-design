import {
  iconHome,
  iconUser,
  iconTV,
  iconGrid,
  privacypolicy,
  tandc,
  inquiry,
  subject,
  aboutus,
} from 'assets/images/icons'

import { route } from 'shared/constants/AllRoutes'

export const sidebarConfig = [
  {
    path: route.dashboard,
    icon: iconHome,
    title: 'Home'
  },
  {
    path: route.adminManagement,
    icon: iconUser,
    title: 'Admin Management'
  },
  {
    path: route.gameManagement,
    icon: iconTV,
    title: 'Game Management'
  },
  {
    path: route.subjectManagement,
    icon: subject,
    title: 'Subject Management'
  },
  {
    path: route.featureManagement,
    icon: inquiry,
    title: 'CMS Management',
    children: [
      {
        path: route.featureManagement,
        icon: iconGrid,
        title: 'Feature Management'
      },
      {
        path: route.aboutusMangement,
        icon: aboutus,
        title: 'About Us'
      },
      {
        path: route.privacypolicy,
        icon: privacypolicy,
        title: 'Privacy Policy'
      },
      {
        path: route.termsandcondition,
        icon: tandc,
        title: 'Terms and Condition'
      }
    ]
  }
]
