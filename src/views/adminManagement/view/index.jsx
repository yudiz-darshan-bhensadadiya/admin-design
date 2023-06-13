import moment from 'moment'
import { getAdminById } from 'query/admin/admin.query'
import React, { useEffect, useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import NotFound from 'shared/components/404'
import CommonViewInput from 'shared/components/CommonViewInput'
import { Loader } from 'shared/components/Loader'
import Wrapper from 'shared/components/Wrap'

export default function ViewAdmin() {
  const { id } = useParams()
  const [viewAdminData, setViewAdminData] = useState()

  const { isLoading, isFetching, isError } = useQuery('adminById', () => getAdminById(id), {
    select: (data) => data.data.data,
    onSuccess: (response) => {
      setViewAdminData(response)
    },
    onError: () => {
      setViewAdminData()
    }
  })

  useEffect(() => {
    document.title = 'View Admin'
  }, [])

  return (
    <>
      {isLoading || isFetching ? (
        <Loader />
      ) : isError ? (
        <NotFound />
      ) : (
        <Form className='step-one' autoComplete='off'>
          <div className='personal-details'>
            <div className='user-form'>
              <Row>
                <Col xxl={8}>
                  <Wrapper>
                    <Row>
                      <Col sm='6'>
                        <CommonViewInput type='text' label='emailAddress' value={viewAdminData?.sEmail} disabled />
                      </Col>
                      <Col sm='6'>
                        <CommonViewInput type='text' label='firstName' value={viewAdminData?.sFirstName} disabled />
                      </Col>
                      <Col sm='6'>
                        <CommonViewInput type='text' label='schoolName' value={viewAdminData?.sSchoolName} disabled />
                      </Col>
                      <Col sm='6'>
                        <CommonViewInput type='text' label='surName' value={viewAdminData?.sSurname} disabled />
                      </Col>
                      <Col sm='6'>
                        <CommonViewInput type='text' label='noOfUser' value={viewAdminData?.sTotalUser} disabled />
                      </Col>
                      <Col sm='6'>
                        <CommonViewInput
                          type='text'
                          label='daysLeft'
                          value={viewAdminData?.nTotalRemainingDays <= 0 ? '0' : viewAdminData?.nTotalRemainingDays}
                          disabled
                        />
                      </Col>
                      <Col sm='6'>
                        <CommonViewInput type='text' label='organizationNumber' value={viewAdminData?.nOrganizationNumber} disabled />
                      </Col>
                      <Col sm='6'>
                        <CommonViewInput
                          type='text'
                          label='subScriptionExpire'
                          value={moment(viewAdminData?.dPackageEndDate).format('MM-DD-YYYY')}
                          disabled
                        />
                      </Col>
                      <Col sm='6'>
                        <CommonViewInput type='text' label='address' value={viewAdminData?.sAddress} disabled />
                      </Col>
                      <Col sm='6'>
                        <CommonViewInput type='text' label='totalGameInPackage' value={viewAdminData?.nTotalGame} disabled />
                      </Col>
                      <Col sm='6'>
                        <CommonViewInput type='text' label='referenceNumber' value={viewAdminData?.nReferenceNumber} disabled />
                      </Col>
                    </Row>
                  </Wrapper>
                </Col>
              </Row>
            </div>
          </div>
        </Form>
      )}
    </>
  )
}
