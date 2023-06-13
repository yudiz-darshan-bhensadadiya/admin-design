export const adminTableColumns = [
  { name: 'No', isSort: false },
  { name: 'Name', internalName: 'sFirstName', type: 1, isSort: true },
  { name: 'School Name', internalName: 'sSchoolName', type: 1, isSort: true },
  { name: 'Package', internalName: 'sPackageName', type: 1, isSort: true },
  { name: 'Subscription Expires On', internalName: 'dPackageEndDate', type: 1, isSort: true },
  { name: 'Status', internalName: 'eStatus', isSort: false },
  { name: 'Actions', isSort: false }
]

export const gameTableColumns = [
  { name: 'No', isSort: false },
  { name: 'Game Name', internalName: 'sGameName', type: 1, isSort: true },
  { name: 'Game URL', internalName: 'sGameUrl', type: 1, isSort: true },
  { name: 'Game Icon', isSort: false },
  { name: 'Game Description', isSort: false },
  { name: 'Actions', isSort: false }
]

export const packageTableColumns = [
  { name: 'No', isSort: false },
  { name: 'Package Name', internalName: 'sName', type: 1, isSort: true },
  { name: 'Total No of Account', internalName: 'nAllowedMember', type: 1, isSort: true },
  { name: 'Total No of  Games', internalName: 'aGameCount', type: 1, isSort: true },
  { name: 'Package Type', internalName: 'ePackageType', type: 1, isSort: true },
  { name: 'Package Price', internalName: 'nPrice', type: 1, isSort: true },
  { name: 'Actions', isSort: false }
]

export const subjectTableColumns = [
  { name: 'No', isSort: false },
  { name: 'Subject', internalName: 'sSubjectName', type: 1, isSort: true },
  { name: 'Subject Overview', type: 1, isSort: false },
  { name: 'Stages', internalName: 'sStagesName', type: 1, isSort: false },
  { name: 'Actions', isSort: false }
]

export const inquiryTableColumns = [
  { name: 'No', isSort: false },
  { name: 'Date and Time', internalName: 'sDatetime', type: 1, isSort: false },
  { name: 'Email ID', internalName: 'sEmail', type: 1, isSort: false },
  { name: 'Phone Number', internalName: 'nPhonenumber', type: 1, isSort: false },
  { name: 'Title', internalName: 'sTitle', type: 1, isSort: false },
  { name: 'Actions', isSort: false }
]

export const stageTableColumns = [
  { name: 'No', isSort: false },
  { name: 'Stage Name', internalName: 'sStage', type: 1, isSort: false },
  { name: 'Sub Topic Name', internalName: 'sSubtopicName', type: 1, isSort: false },
  { name: 'Subject', internalName: 'sSubjectName', type: 1, isSort: false },
  { name: 'Randomize' },
  { name: 'Actions', isSort: false }
]
