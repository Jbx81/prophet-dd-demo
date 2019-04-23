import React from 'react'
import PropTypes from 'prop-types'
import {InstantSearch} from 'react-instantsearch-dom'

const WithInstantSearch = ({children}) => {
  return (
    <InstantSearch
      appId={process.env.ALGOLIA_ID}
      apiKey={process.env.ALGOLIA_API_KEY}
      indexName={process.env.ALGOLIA_INDEX}
    >
      {children}
    </InstantSearch>
  )
}

WithInstantSearch.propTypes = {
  children: PropTypes.element.isRequired
}

export default WithInstantSearch
