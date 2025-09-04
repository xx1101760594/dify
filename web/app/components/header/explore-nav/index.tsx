'use client'

import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import {
  RiPlanetFill,
  RiPlanetLine,
} from '@remixicon/react'
import classNames from '@/utils/classnames'
type ExploreNavProps = {
  className?: string
}

const ExploreNav = ({
  className,
}: ExploreNavProps) => {
  const { t } = useTranslation()
  const selectedSegment = useSelectedLayoutSegment()
  const activated = selectedSegment === 'explore'

  return (
    <Link href="/explore/apps" className={classNames(
      className, 'group',
      activated && 'actived-bg shadow-md',
      activated ? '' : 'text-components-main-nav-nav-button-text hover:bg-components-main-nav-nav-button-bg-hover',
    )}>
      {/* {
        activated
          ? <RiPlanetFill className='mr-2 h-4 w-4' />
          : <RiPlanetLine className='mr-2 h-4 w-4' />
      } */}
      {t('common.menus.intelligentCenter')}
    </Link>
  )
}

export default ExploreNav

