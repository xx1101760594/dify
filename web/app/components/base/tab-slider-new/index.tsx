import type { FC } from 'react'
import cn from '@/utils/classnames'

type Option = {
  value: string
  text: string
  icon?: React.ReactNode
}
type TabSliderProps = {
  className?: string
  value: string
  onChange: (v: string) => void
  options: Option[]
}
const TabSliderNew: FC<TabSliderProps> = ({
  className,
  value,
  onChange,
  options,
}) => {
  return (
    <div className={cn(className, 'relative flex')}>
      {options.map(option => (
        <div
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'relative mr-1 flex h-[32px] cursor-pointer items-center mr-6 py-[7px] text-[14px] leading-[18px] text-black hover:text-components-main-nav-nav-button-text-active',
            value === option.value && 'text-components-main-nav-nav-button-text-active text-[16px]',
          )}
        >
         {value === option.value &&  <span className='absolute w-[30px] h-[3px] bg-red-700 bottom-[-8px] ml-[50%]' style={{left: -15}}></span>}
          {option.icon}
          {option.text}
        </div>
      ))}
    </div>
  )
}

export default TabSliderNew
