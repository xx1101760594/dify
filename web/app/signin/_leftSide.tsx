'use client'
import React from 'react'
import { basePath } from '@/utils/var'
import { useTranslation } from 'react-i18next'
import s from './page.module.css'


const LeftSide = () => {
  const { t } = useTranslation()
  return (
    <div className={`${s.leftSideWrap}`}>
      <div className={`${s.bg} login-bg`}>
        <img src={`${basePath}/bg/login-bg.png`} alt="" className={`${s.bImg}`} />
      </div>
      <div className={`${s.logo} flex` }>
        <img
          src={`${basePath}/logo/logo1.png`}
          className='block object-contain w-28'
          alt='logo'
        />
        <span className='pl-2 pr-2 text-gray-300'>|</span>
        <span className='text-lg'>{t('common.menus.mofang')}</span>
      </div>
    </div>
  )
}

export default LeftSide
