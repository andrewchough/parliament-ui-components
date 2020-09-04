/**
 *  Copyright 2020 Adobe. All rights reserved.
 *  This file is licensed to you under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License. You may obtain a copy
 *  of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software distributed under
 *  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 *  OF ANY KIND, either express or implied. See the License for the specific language
 *  governing permissions and limitations under the License.
 */

/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { useState } from 'react'
import PropTypes from 'prop-types'
import { navigate } from 'gatsby'
import { Index } from 'elasticlunr'
import { Heading, SearchField, Text } from '@adobe/react-spectrum'
import { Item, Menu } from '../Menu'
import { Popover } from '../Popover'

import './search.css'

const Search = ({ searchIndex = {}, ...props }) => {
  const [index] = useState(Index.load(searchIndex))
  const [results, setResults] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  const search = (searchTerm) => {
    const searchResults = index
      .search(searchTerm, { expand: true })
      .map(({ ref }) => {
        return index.documentStore.getDoc(ref)
      })

    setResults(searchResults)
    if (searchTerm.length > 0) setIsOpen(true)
  }

  const docsResultMenuItems = [
    <Item key='docs-divider' isSectionHeading>
      Docs
    </Item>
  ]
  const apiResultMenuItems = [
    <Item key='api-divider' isSectionHeading>
      APIs
    </Item>
  ]

  for (const result of results) {
    const item = (
      <a
        key={result.id}
        className='searchMenuLink'
        onClick={() => {
          setIsOpen(false)
          navigate(result.path)
        }}
      >
        <Item>{result.title}</Item>
      </a>
    )

    if (result.type === 'apis') {
      apiResultMenuItems.push(item)
    } else {
      docsResultMenuItems.push(item)
    }
  }

  const items = []
  if (docsResultMenuItems.length > 1) items.push(...docsResultMenuItems)
  if (apiResultMenuItems.length > 1) items.push(...apiResultMenuItems)

  return (
    <div style={{ position: 'relative' }} {...props}>
      <SearchField
        onClear={() => {
          setIsOpen(false)
        }}
        onChange={(searchTerm) => {
          searchTerm.length > 0 ? search(searchTerm) : setIsOpen(false)
        }}
        onSubmit={() => {
          if (results.length > 0) {
            navigate(results[0].path)
          }
        }}
      />
      <Popover
        isOpen={isOpen}
        style={{
          position: 'absolute',
          left: '0px',
          top: '32px',
          zIndex: '1000',
          width: '368px'
        }}
      >
        {results.length > 0 ? (
          <Menu>{items}</Menu>
        ) : (
          <div
            css={css`
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              margin-bottom: 64px;
              margin-top: 64px;
            `}
          >
            <Heading level={2}>No Results Found</Heading>
            <Text>
              <em>Try another search term.</em>
            </Text>
          </div>
        )}
      </Popover>
    </div>
  )
}

Search.propTypes = {
  searchIndex: PropTypes.object
}

export { Search }
