'use client'
import React,{ useState } from 'react'
import ModelProviderPage from '@/app/components/header/account-setting/model-provider-page'
import Input from '@/app/components/base/input'
import { useTranslation } from 'react-i18next'
export default function ModelsPage() {
  const [searchValue, setSearchValue] = useState<string>('')
  const { t } = useTranslation()
  document.title = `${t('common.menus.models')}`
  return (
    <div className='mx-auto w-full px-6 pt-6'>
      <div className='flex grow justify-end pb-6'>
        <Input
          showLeftIcon
          wrapperClassName='!w-[200px]'
          className='!h-8 !text-[13px]'
          onChange={e => setSearchValue(e.target.value)}
          value={searchValue}
        />
      </div>
      <ModelProviderPage searchText={searchValue} />
    </div>
  )
}