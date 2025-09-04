import type { FC } from 'react'
import {
  memo,
  useRef,
} from 'react'
import { useHover } from 'ahooks'
import type { ConversationItem } from '@/models/share'
import Operation from '@/app/components/base/chat/chat-with-history/sidebar/operation'
import cn from '@/utils/classnames'
import {
  RiRadioButtonLine
} from '@remixicon/react'

type ItemProps = {
  isPin?: boolean
  item: ConversationItem
  onOperate: (type: string, item: ConversationItem) => void
  onChangeConversation: (conversationId: string) => void
  currentConversationId: string
}
const Item: FC<ItemProps> = ({
  isPin,
  item,
  onOperate,
  onChangeConversation,
  currentConversationId,
}) => {
  const ref = useRef(null)
  const isHovering = useHover(ref)
  const isSelected = currentConversationId === item.id

  return (
    <div
      ref={ref}
      key={item.id}
      className={cn(
        'system-sm-medium group flex items-center cursor-pointer rounded-lg p-1.5 pl-3 text-components-menu-item-text hover:bg-state-base-hover hover:text-black',
        isSelected && 'bg-white text-black hover:text-text-accent hover:bg-white',
      )}
      onClick={() => onChangeConversation(item.id)}
    >
     { isSelected ?  <RiRadioButtonLine className={cn(isSelected && 'text-text-accent w-[14px]' )}></RiRadioButtonLine>
      : <span className='block w-[8px] h-[8px] mx-[3px] rounded-[10px] bg-[#D0D3D8]'></span>}
      <div className='grow truncate p-1 pl-2' title={item.name}>{item.name}</div>
      {item.id !== '' && (
        <div className='shrink-0' onClick={e => e.stopPropagation()}>
          <Operation
            isActive={isSelected}
            isPinned={!!isPin}
            isItemHovering={isHovering}
            togglePin={() => onOperate(isPin ? 'unpin' : 'pin', item)}
            isShowDelete
            isShowRenameConversation
            onRenameConversation={() => onOperate('rename', item)}
            onDelete={() => onOperate('delete', item)}
          />
        </div>
      )}
    </div>
  )
}

export default memo(Item)
