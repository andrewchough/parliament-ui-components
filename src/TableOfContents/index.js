/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import Heading from '@react/react-spectrum/Heading'
import { parse } from 'node-html-parser'

const stripOuterH1 = function (toc) {
  let html = ''
  const root = parse(toc)
  const headerOneList = root.querySelector('ul')
  if (headerOneList) {
    const headerTwoList = headerOneList.querySelector('ul')
    if (headerTwoList) {
      html = headerTwoList.toString()
    }
  }
  return html
}

const TableOfContents = ({ tableOfContents, stripH1 }) => {
  // Removing the H1 from the ToC
  const html = stripH1 ? stripOuterH1(tableOfContents) : tableOfContents
  return (
    <div
      css={css`
        height: 70vh;
        overflow-y: auto;
        overflow-x: hidden;
      `}
    >
      <Heading variant='subtitle3'>On this page</Heading>
      <span className='toc' dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}

export default TableOfContents
