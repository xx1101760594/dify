'use client'
import { useSearchParams } from 'next/navigation'
import OneMoreStep from './oneMoreStep'
import NormalForm from './normalForm'
import LeftSide from './_leftSide'
import cn from '@/utils/classnames'

const SignIn = () => {
  const searchParams = useSearchParams()
  const step = searchParams.get('step')

  // if (step === 'next')
  //   return <OneMoreStep />
  // return <NormalForm />

  return (<div className={cn('flex w-full shrink-0  bg-background-default-subtle')}>
        <LeftSide />
        <div className={cn('flex items-center justify-center md:px-[80px]')}>
          <div className='flex flex-col md:w-[360px]'>
             <NormalForm />
          </div>
        </div>
      </div>)
}

export default SignIn
