import React, { useState } from 'react'
import { useQuery } from 'react-apollo'
import { TimeSplit } from './typings/global'
import { tick } from './utils/time'// react/Countdown.tsx
import { useCssHandles } from 'vtex.css-handles'
import useProduct from 'vtex.product-context/useProduct'
import productReleaseDate from './queries/productReleaseDate.graphql'

interface CountdownProps { 
  targetDate: string
}

const DEFAULT_TARGET_DATE = (new Date('2020-08-25')).toISOString()
const CSS_HANDLES = ["container", "countdown", "title"]



const Countdown: StorefrontFunctionComponent<CountdownProps> = ({ targetDate = DEFAULT_TARGET_DATE }) => {

  const { product: { linkText } } = useProduct()
  const { data, loading, error } = useQuery(productReleaseDate, {
    variables: {
      slug: linkText
    },
    ssr: false
  })

  console.log({data})

  const [timeRemaining, setTime] = useState<TimeSplit>({
    hours: '00',
    minutes: '00',
    seconds: '00'
  })

  const handles = useCssHandles(CSS_HANDLES)
  tick(data?.product?.releaseDate || DEFAULT_TARGET_DATE, setTime)

  if (loading) {
    return (
      <div>
        <span>Loading...</span>
      </div>
    )
  }
  if (error) {
    return (
      <div>
        <span>Erro!</span>
      </div>
    )
  }
  // if (!product) {
  //   return (
  //     <div>
  //       <span>Não há contexto de produto</span>
  //     </div>
  //   )
  // }

  return (
      <div className={`${handles.countdown} t-heading-2 fw3 w-100 c-muted-1 db tc`}>
        <h1>{ `${timeRemaining.hours}:${timeRemaining.minutes}:${timeRemaining.seconds}` }</h1>
      </div>
  )
}

Countdown.schema = {
  title: 'editor.countdown.title',
  description: 'editor.countdown.description',
  type: 'object',
  properties: {
    targetDate: {
      title: 'Data Final',
      description:'Data final utilizada no contador',
      type: 'string',
      default: null
    }
  },
}

export default Countdown
