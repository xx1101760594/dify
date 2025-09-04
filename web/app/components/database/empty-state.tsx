import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { RiDatabase2Line } from '@remixicon/react'
import Button from '@/app/components/base/button'

export type DatabaseEmptyStateProps = {
  onCreateDatabase?: () => void
  showCreateButton?: boolean
}

const DatabaseEmptyState: FC<DatabaseEmptyStateProps> = ({
  onCreateDatabase,
  showCreateButton = true,
}) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col justify-center items-center px-4 py-32">
      <div className="flex justify-center items-center w-16 h-16 rounded-xl border shadow-lg border-divider-subtle">
        <RiDatabase2Line className="w-8 h-8 text-text-tertiary" />
      </div>
      <div className="mt-4 text-center">
        <h3 className="text-lg font-semibold text-text-primary">
          {t('workflow.nodes.database.empty.title')}
        </h3>
        <p className="mt-2 max-w-md text-sm text-text-tertiary">
          {t('workflow.nodes.database.empty.description')}
        </p>
      </div>
      {showCreateButton && onCreateDatabase && (
        <Button
          variant="primary"
          className="mt-6"
          onClick={onCreateDatabase}
        >
          {t('workflow.nodes.database.empty.createButton')}
        </Button>
      )}
    </div>
  )
}

export default DatabaseEmptyState 