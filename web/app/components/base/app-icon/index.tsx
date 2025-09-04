'use client'

import React from 'react'
import type { FC } from 'react'
import { init } from 'emoji-mart'
import data from '@emoji-mart/data'
import { cva } from 'class-variance-authority'
import type { AppIconType } from '@/types/app'
import classNames from '@/utils/classnames'
import { basePath } from '@/utils/var'

init({ data })

export type AppIconProps = {
  size?: 'xs' | 'tiny' | 'small' | 'medium' | 'large' | 'xl' | 'xxl'
  rounded?: boolean
  iconType?: AppIconType | null
  icon?: string
  background?: string | null
  imageUrl?: string | null
  className?: string
  innerIcon?: React.ReactNode
  coverElement?: React.ReactNode
  onClick?: () => void
}
const appIconVariants = cva(
  'flex items-center justify-center relative text-lg rounded-[4px] grow-0 shrink-0 overflow-hidden leading-none',
  {
    variants: {
      size: {
        xs: 'w-4 h-4 text-xs',
        tiny: 'w-6 h-6 text-base',
        small: 'w-8 h-8 text-xl',
        medium: 'w-9 h-9 text-[22px]',
        large: 'w-10 h-10 text-[24px]',
        xl: 'w-12 h-12 text-[28px]',
        xxl: 'w-14 h-14 text-[32px]',
      },
      rounded: {
        true: 'rounded-full',
      },
    },
    defaultVariants: {
      size: 'medium',
      rounded: false,
    },
  })
const AppIcon: FC<AppIconProps> = ({
  size = 'medium',
  rounded = false,
  iconType,
  icon,
  background,
  imageUrl,
  className,
  innerIcon,
  coverElement,
  onClick,
}) => {
  const isValidImageIcon = iconType === 'image' && imageUrl

  return <span
    className={classNames(appIconVariants({ size, rounded }), className)}
    style={{ background: isValidImageIcon ? undefined : (background || '#FFEAD5') }}
    onClick={onClick}
  >
    {/* <img src={`${basePath}/icon/icon4.png`} alt="" /> */}
    {isValidImageIcon

      ? <img src={imageUrl} className="h-full w-full" alt="app icon" />
      : (innerIcon || ((icon && icon !== '') ? <span className={['tiny','xs'].includes(size) ? 'text-[12px]' : 'text-[18px]'}><em-emoji id={icon} /></span> : <span className={['tiny','xs'].includes(size) ? 'text-[12px]' :'text-[18px]'}><em-emoji id='speech_balloon' /></span>))
      // 🤖
    }
    {coverElement}
  </span>
}

export default React.memo(AppIcon)
