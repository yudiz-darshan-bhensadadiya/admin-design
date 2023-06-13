import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { useQuery } from 'react-query'
import { getDashboard } from 'query/statistics/statistics.query'
import Cards from 'shared/components/Card'
import { Loader } from 'shared/components/Loader'

function Dashboard() {
  const [allStatistics, setAllStatistics] = useState({})

  const { isLoading, isFetching } = useQuery('statisticsData', () => getDashboard(), {
    select: (data) => data.data.data,
    onSuccess: (response) => {
      setAllStatistics(response)
    },
    onError: () => {
      setAllStatistics({})
    }
  })

  const data = [
    {
      title: `${allStatistics?.admins?.toString() || '-'}`,
      subtitle: 'Total Registered Admin'
    },
    {
      title: `${allStatistics?.teachers?.toString() || '-'}`,
      subtitle: 'Total Registered Teacher'
    },
    {
      title: `${allStatistics?.students?.toString() || '-'}`,
      subtitle: 'Total Registered Students'
    }
  ]

  useEffect(() => {
    document.title = 'Dashboard'
  }, [])

  return (
    <div>
      {isLoading || isFetching ? (
        <Loader />
      ) : (
        <Row>
          {data?.map((value, i) => {
            return (
              <Col xxl={3} lg={4} sm={6} className='pb-3 pb-lg-0' key={i}>
                <Cards cardtitle={value?.subtitle} cardtext={value?.title} />
              </Col>
            )
          })}
        </Row>
      )}
    </div>
  )
}

export default Dashboard
