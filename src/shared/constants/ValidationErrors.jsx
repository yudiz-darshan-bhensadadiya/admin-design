/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/display-name */
/* eslint-disable react/jsx-no-undef */
import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

/* eslint-disable react/react-in-jsx-scope */
export const validationErrors = {
  required: <FormattedMessage id='required' />,
  emailRequired: <FormattedMessage id='requiredMail' />,
  firstNameRequired: <FormattedMessage id='requiredFirstName' />,
  surNameRequired: <FormattedMessage id='requiredSurName' />,
  gameNameRequired: <FormattedMessage id='requiredGameName' />,
  subjectCoveredRequired: <FormattedMessage id='requiredSubjectCovered' />,
  subscriptionPeriodRequired: <FormattedMessage id='requiredSubscriptionPeriod' />,
  suitableForRequired: <FormattedMessage id='requiredSuitableFor' />,
  gameDescriptionRequired: <FormattedMessage id='requiredGameDescription' />,
  featureDescriptionRequired: <FormattedMessage id='requiredFeatureDescription' />,
  aboutusDescriptionRequired: <FormattedMessage id='requiredaboutusDescription' />,
  customizableRequired: <FormattedMessage id='requiredCustomizable' />,
  passwordRequired: <FormattedMessage id='requiredPassword' />,
  currentPasswordRequired: <FormattedMessage id='requiredCurrentPassword' />,
  newPasswordRequired: <FormattedMessage id='requiredNewPassword' />,
  confirmRequired: <FormattedMessage id='requiredConfirmPassword' />,
  userNameRequired: <FormattedMessage id='requiredUserName' />,
  mobileNoRequired: <FormattedMessage id='requiredMobileNo' />,
  email: <FormattedMessage id='validEmail' />,
  tandcRequired: <FormattedMessage id='requiredtandc' />,
  schoolRequired: <FormattedMessage id='requiredSchool' />,
  packageRequired: <FormattedMessage id='requiredPackage' />,
  packageNameRequired: <FormattedMessage id='requiredPackageName' />,
  noOfAccoutnRequired: <FormattedMessage id='requiredNoOfAccount' />,
  organizationNumberRequired: <FormattedMessage id='requiredOrganizationNumber' />,
  referenceNumberRequired: <FormattedMessage id='requiredReferenceNumber' />,
  subjectNameRequired: <FormattedMessage id='requiredSubjectName' />,
  addressRequired: <FormattedMessage id='requiredAddress' />,
  passwordRegEx: <FormattedMessage id='passwordRegEx' />,
  priceRequired: <FormattedMessage id='requiredPrice' />,
  urlRequired: <FormattedMessage id='requiredUrl' />,
  subscriptionRequired: <FormattedMessage id='requiredSubscription' />,
  gamesRequired: <FormattedMessage id='requiredGames' />,
  url: <FormattedMessage id='validUrl' />,
  date: <FormattedMessage id='validDate' />,
  number: <FormattedMessage id='validNumber' />,
  IFSCCode: <FormattedMessage id='validIfscCode' />,
  accountNumber: <FormattedMessage id='validAccountNumber' />,
  digit: <FormattedMessage id='pleaseEnterOnlyDigits' />,
  stageName: <FormattedMessage id='requiredStageName' />,
  privacypolicy: <FormattedMessage id='privacypolicyrequred' />,
  minLength: (length) => `${useIntl().formatMessage({ id: 'enterGreater' })} ${length}.`,
  rangeLength: (min, max) =>
    `${useIntl().formatMessage({ id: 'rangeLength' })} ${min} ${useIntl().formatMessage({ id: 'and' })} ${max} ${useIntl().formatMessage({
      id: 'charLong'
    })}`,
  maxLength: (length) => `${useIntl().formatMessage({ id: 'enterLess' })} ${length}.`,
  passwordNotMatch: <FormattedMessage id='passwordNotMatch' />,
  selectOnePermission: <FormattedMessage id='selectOnePermission' />,
  noSPace: <FormattedMessage id='noSPace' />,
  customURL: <FormattedMessage id='customURL' />,
  customURLWithSlash: <FormattedMessage id='customURLWithSlash' />,
  notAvailable: <FormattedMessage id='notAvailable' />,
  category: <FormattedMessage id='category' />,
  captain: <FormattedMessage id='captainRequired' />,
  viceCaptain: <FormattedMessage id='viceCaptainRequired' />,
  oldAndNewUrlCanNotBeSame: <FormattedMessage id='oldAndNewUrlCanNotBeSame' />,
  wicketKeeper: <FormattedMessage id='wicketKeeperRequired' />,
  selectElevenPlayersOnly: <FormattedMessage id='selectElevenPlayersOnly' />,
  thirdPlayer: <FormattedMessage id='thirdPlayerRequired' />,
  selectRoleAndPermission: <FormattedMessage id='selectRoleAndPermission' />,
  noSpecialCharacters: <FormattedMessage id='noSpecialCharacters' />,
  noNegative: <FormattedMessage id='noNegative' />,
  commonRange: (min = 5, max = 1000) =>
    `${useIntl().formatMessage({
      id: 'rangeLength'
    })} ${min} ${useIntl().formatMessage({
      id: 'and'
    })} ${max} ${useIntl().formatMessage({
      id: 'charLong'
    })}`,
  underscoreAndDot: <FormattedMessage id='underscoreAndDot' />
}
