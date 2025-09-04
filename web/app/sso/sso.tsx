'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import cn from '@/utils/classnames'
import Toast from '@/app/components/base/toast'
import { ssoCallback } from '@/service/common'
import Loading from '@/app/components/base/loading'

const SsoSignIn = () => {
    const searchParams = useSearchParams()
    const [token, setToken] = useState(searchParams.get('token') || '')
    const router = useRouter()
    const getSsoCallBack = async () => {
        try {
            const res = await ssoCallback({
                params: {
                    token: token
                },
            })
            console.log('------res---',res)
            if (res.result === 'success') {
                localStorage.setItem('console_token', res.data.access_token)
                localStorage.setItem('refresh_token', res.data.refresh_token)
                router.replace('/apps')
            }
            else {
                Toast.notify({
                    type: 'error',
                    message: res.data,
                })
                router.replace('/signin')
            }
        } catch (error) {
           router.replace('/signin')
        }
    }

    useEffect(()=> {
        getSsoCallBack()
    },[token])

   return <div className={
      cn(
        'flex w-full h-full grow flex-col items-center justify-center',
        'px-6',
        'md:px-[108px]',
      )
    }>
      <Loading type='area' />
    </div>
}

export default SsoSignIn
