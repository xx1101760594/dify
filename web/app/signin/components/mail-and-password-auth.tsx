import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter, useSearchParams } from 'next/navigation'
import { useContext } from 'use-context-selector'
import Button from '@/app/components/base/button'
import Toast from '@/app/components/base/toast'
import { emailRegex } from '@/config'
import { login } from '@/service/common'
import Input from '@/app/components/base/input'
import I18NContext from '@/context/i18n'
import { noop } from 'lodash-es'
import {
  RiEyeLine,
  RiEyeOffLine,
} from '@remixicon/react'
import { getSsoUrl } from '@/service/common'

type MailAndPasswordAuthProps = {
  isInvite: boolean
  isEmailSetup: boolean
  allowRegistration: boolean
  allowSsoLogin: boolean
}

const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/

export default function MailAndPasswordAuth({ isInvite, isEmailSetup, allowRegistration, allowSsoLogin }: MailAndPasswordAuthProps) {
  const { t } = useTranslation()
  const { locale } = useContext(I18NContext)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const emailFromLink = decodeURIComponent(searchParams.get('email') || '')
  const [email, setEmail] = useState(emailFromLink)
  const [password, setPassword] = useState('')
  const [ssoUrlData, setSsoUrlData] = useState<any>({})

  const [isLoading, setIsLoading] = useState(false)
  const handleEmailPasswordLogin = async () => {
    if (!email) {
      Toast.notify({ type: 'error', message: t('login.error.emailEmpty') })
      return
    }
    if (!emailRegex.test(email)) {
      Toast.notify({
        type: 'error',
        message: t('login.error.emailInValid'),
      })
      return
    }
    if (!password?.trim()) {
      Toast.notify({ type: 'error', message: t('login.error.passwordEmpty') })
      return
    }
    if (!passwordRegex.test(password)) {
      Toast.notify({
        type: 'error',
        message: t('login.error.passwordInvalid'),
      })
      return
    }
    try {
      setIsLoading(true)
      const loginData: Record<string, any> = {
        email,
        password,
        language: locale,
        remember_me: true,
      }
      if (isInvite)
        loginData.invite_token = decodeURIComponent(searchParams.get('invite_token') as string)
      const res = await login({
        url: '/login',
        body: loginData,
      })
      if (res.result === 'success') {
        if (isInvite) {
          router.replace(`/signin/invite-settings?${searchParams.toString()}`)
        }
        else {
          localStorage.setItem('console_token', res.data.access_token)
          localStorage.setItem('refresh_token', res.data.refresh_token)
          router.replace('/apps')
        }
      }
      else if (res.code === 'account_not_found') {
        if (allowRegistration) {
          const params = new URLSearchParams()
          params.append('email', encodeURIComponent(email))
          params.append('token', encodeURIComponent(res.data))
          router.replace(`/reset-password/check-code?${params.toString()}`)
        }
        else {
          Toast.notify({
            type: 'error',
            message: t('login.error.registrationNotAllowed'),
          })
        }
      }
      else {
        Toast.notify({
          type: 'error',
          message: res.data,
        })
      }
    }

    finally {
      setIsLoading(false)
    }
  }
  const handleSsoLogin = async () => {
    console.log('---ssoUrlData---',ssoUrlData)
     if (ssoUrlData.result === 'success') {
      window.location.href = ssoUrlData.data.sso_login_url
    }
    else {
      Toast.notify({
        type: 'error',
        message: ssoUrlData.data,
      })
      router.replace('/signin')
    }
  }

  const getSsoLoginUrl = async() => {
    const callback_url = window.location.origin+'/sso'
    // const callback_url = 'http://10.128.172.252/sso'
    
    const res = await getSsoUrl({
      params: {
       callback_url: callback_url,
      },
    })
    setSsoUrlData(res)
  }

  useEffect(() => {
    getSsoLoginUrl()
  },[allowSsoLogin])
  return <form onSubmit={noop}>
    <div className='mb-6'>
      <label htmlFor="email" className="my-2 text-text-secondary">
        {t('login.email')}
      </label>
      <div className="mt-1">
        <Input
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={isInvite}
          id="email"
          type="email"
          autoComplete="email"
          placeholder={t('login.emailPlaceholder') || ''}
          tabIndex={1}
        />
      </div>
    </div>

    <div className='mb-6'>
      <label htmlFor="password" className="my-2 flex items-center justify-between">
        <span className='text-text-secondary'>{t('login.password')}</span>
        {/* <Link
          href={`/reset-password?${searchParams.toString()}`}
          className={`system-xs-regular ${isEmailSetup ? 'text-components-button-secondary-accent-text' : 'pointer-events-none text-components-button-secondary-accent-text-disabled'}`}
          tabIndex={isEmailSetup ? 0 : -1}
          aria-disabled={!isEmailSetup}
        >
          {t('login.forget')}
        </Link> */}
      </label>
      <div className="relative mt-1">
        <Input
          id="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter')
              handleEmailPasswordLogin()
          }}
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          placeholder={t('login.passwordPlaceholder') || ''}
          tabIndex={2}
        />
        <div className="absolute inset-y-0 right-0 flex items-center">
          <Button
            type="button"
            variant='ghost'
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <RiEyeLine className='mr-2 h-4 w-4' /> : <RiEyeOffLine className='mr-2 h-4 w-4' />}
          </Button>
        </div>
      </div>
    </div>

    <div className='mb-2'>
      <Button
        tabIndex={2}
        variant='primary'
        onClick={handleEmailPasswordLogin}
        disabled={isLoading || !email || !password}
        className="w-full"
      >{t('login.signBtn')}</Button>
    </div>
    {allowSsoLogin && <div className='mb-2'>
      <div className='relative mt-10 mb-4 pt-5 border-t'><span className='absolute left-1/2 -translate-x-1/2 bg-white px-2 -top-3'>其他登录方式</span></div>
      <Button
        tabIndex={2}
        variant='secondary'
        onClick={handleSsoLogin}
        className="w-full"
      >{t('login.ssoBtn')}</Button>
    </div>}
  </form>
}
