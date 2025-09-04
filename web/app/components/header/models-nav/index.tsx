'use client'

import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import {
  RiHammerFill,
  RiHammerLine,
} from '@remixicon/react'
import classNames from '@/utils/classnames'
type ModelProps = {
  className?: string
}

const ModelsNav = ({
  className,
}: ModelProps) => {
  const { t } = useTranslation()
  const selectedSegment = useSelectedLayoutSegment()
  const activated = selectedSegment === 'model-square'

  return (
    <Link href="/model-square" className={classNames(
      'group text-sm font-medium',
      activated && 'actived-bg hover:bg-components-main-nav-nav-button-bg-active-hover shadow-md',
      activated ? '' : 'text-components-main-nav-nav-button-text hover:bg-components-main-nav-nav-button-bg-hover',
      className,
    )}>
      {/* {
        activated
          ? <RiHammerFill className='mr-2 h-4 w-4' />
          : <RiHammerLine className='mr-2 h-4 w-4' />
      } */}
      {t('common.menus.models')}
    </Link>
  )
}

export default ModelsNav
