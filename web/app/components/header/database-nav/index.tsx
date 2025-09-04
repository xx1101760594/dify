'use client'

import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import classNames from '@/utils/classnames'
type ToolsNavProps = {
  className?: string
}

const ToolsNav = ({
  className,
}: ToolsNavProps) => {
  const { t } = useTranslation()
  const selectedSegment = useSelectedLayoutSegment()
  const activated = selectedSegment === "database";

  return (
    <Link href="/database" className={classNames(
      'group text-sm font-medium',
      activated && 'actived-bg hover:bg-components-main-nav-nav-button-bg-active-hover shadow-md',
      activated ? '' : 'text-components-main-nav-nav-button-text hover:bg-components-main-nav-nav-button-bg-hover',
      className,
    )}>
      {/* {
        activated
          ? <RiHammerFill className='mr-2 w-4 h-4' />
          : <RiHammerLine className='mr-2 w-4 h-4' />
      } */}
      {t('common.menus.database')}
    </Link>
  )
}

export default ToolsNav
