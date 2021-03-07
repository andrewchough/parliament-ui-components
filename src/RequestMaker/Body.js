/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import React, { useState } from 'react'
import { RadioGroup, Radio, Text, TextArea, View } from '@adobe/react-spectrum'
import PropTypes from 'prop-types'
import { ParameterTable } from './ParameterTable'
import { RequestMakerUI } from './RequestMakerUI'

const Body = ({ type = 'raw', dispatch, children }) => {
  const [selected, setSelected] = useState(type)
  const [body, setBody] = useState(children)

  const updateBody = (type, data) => {
    console.log(type)
    switch (type) {
      case 'form-data': {
        const formData = new FormData()
        data
          .filter((item) => item.enabled && item.key !== '')
          .map((item) => formData.append(item.key, item.value))
        setBody(formData)
        dispatch({
          type: RequestMakerUI.ACTION_TYPES.SET_BODY,
          body: formData
        })
        break
      }
      case 'urlencoded': {
        const urlFormData = new URLSearchParams()
        data
          .filter((item) => item.enabled && item.key !== '')
          .map((item) => urlFormData.append(item.key, item.value))
        setBody(urlFormData)
        dispatch({
          type: RequestMakerUI.ACTION_TYPES.SET_BODY,
          body: urlFormData
        })
        break
      }
      case 'raw': {
        // TODO set content type
        // TODO call dispatcher for content-type
        setBody(data)
        dispatch({
          type: RequestMakerUI.ACTION_TYPES.SET_BODY,
          body: data
        })
        break
      }
      case 'binary': {
        setBody(data)
        break
      }
      case 'none':
      default: {
        setBody(null)
        dispatch({
          type: RequestMakerUI.ACTION_TYPES.SET_BODY,
          body: ''
        })
        break
      }
    }
  }

  const updateBodyType = (type) => {
    setSelected(type)
    console.log(type)
    switch (type) {
      case 'form-data': {
        dispatch({
          type: RequestMakerUI.ACTION_TYPES.UPDATE_CONTENT_TYPE,
          contentType: 'multipart/form-data'
        })
        break
      }
      case 'urlencoded': {
        dispatch({
          type: RequestMakerUI.ACTION_TYPES.UPDATE_CONTENT_TYPE,
          contentType: 'application/x-www-form-urlencoded'
        })
        break
      }
      case 'raw':
      case 'binary': {
        // set your own content type
        dispatch({
          type: RequestMakerUI.ACTION_TYPES.REMOVE_FORM_CONTENT_TYPE,
          body: null
        })
        break
      }
      case 'none':
      default: {
        dispatch({
          type: RequestMakerUI.ACTION_TYPES.REMOVE_CONTENT_TYPE
        })
        break
      }
    }
  }

  const renderByType = (type, children) => {
    switch (type) {
      case 'form-data':
        return (
          <ParameterTable
            items={[]}
            callback={(data) => updateBody('form-data', data)}
          />
        )
      case 'urlencoded':
        return (
          <ParameterTable
            items={[]}
            callback={(data) => updateBody('urlencoded', data)}
          />
        )
      case 'raw':
        return (
          <TextArea
            minWidth='100%'
            minHeight='size-2000'
            onChange={(data) => updateBody('raw', data)}
            defaultValue={body}
          />
        )
      case 'binary':
        break
      case 'none':
      default:
        return <Text>The request does not have a body</Text>
    }
  }

  return (
    <View>
      <RadioGroup
        value={selected}
        orientation='horizontal'
        onChange={updateBodyType}
      >
        <Radio value='none'>none</Radio>
        <Radio value='form-data'>form-data</Radio>
        <Radio value='urlencoded'>x-www-form-urlencoded</Radio>
        <Radio value='raw'>raw</Radio>
        <Radio value='binary'>binary</Radio>
      </RadioGroup>
      <View
        borderWidth='thin'
        borderRadius='medium'
        borderColor='dark'
        padding='size-250'
        backgroundColor='gray-75'
        minHeight='size-2400'
      >
        {renderByType(selected, children)}
      </View>
    </View>
  )
}

Body.propTypes = {
  children: PropTypes.element.isRequired
}

export { Body }