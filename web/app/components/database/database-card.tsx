"use client";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import type {
  CustomConfigurationModelFixedFields,
  ModelProvider,
} from "@/app/components/header/account-setting/model-provider-page/declarations";
import cn from "@/utils/classnames";
import CustomPopover from "@/app/components/base/popover";
import type { HtmlContentProps } from "@/app/components/base/popover";
import Divider from "@/app/components/base/divider";
import { RiMoreFill } from "@remixicon/react";
import { useToastContext } from "@/app/components/base/toast";
import Confirm from "@/app/components/base/confirm";
import { deleteDatabase } from "@/service/database";
import { DatabaseConnection, DatabaseEngine } from "@/types/database";

export type CardProps = {
  className?: string;
  db: DatabaseConnection;
  provider: ModelProvider;
  onConfig: (db?: DatabaseConnection) => void;
  onSuccess: () => void;
};

const Card = ({ db, onConfig, onSuccess }: CardProps & {}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);
  const { notify } = useToastContext();
  const handleRemove = async () => {
    try {
      setLoading(true);
      if (!db.id) return;
      const res: any = await deleteDatabase(db.id);
      if (res.result === "success") {
        notify({
          type: "success",
          message: t("common.actionMsg.deletedSuccessfully"),
        });
        setShowConfirm(false);
        onSuccess();
      }
    } finally {
      setLoading(false);
    }
  };

  const Operations = (props: HtmlContentProps) => {
    const onMouseLeave = async () => {
      props.onClose?.();
    };
    const onClickRename = async (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      props.onClick?.();
      e.preventDefault();
      onConfig(db);
    };
    const onClickDelete = async (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      props.onClick?.();
      e.preventDefault();
      setShowConfirm(true);
    };

    return (
      <div className="relative py-1 w-full" onMouseLeave={onMouseLeave}>
        <div
          className="mx-1 flex h-8 cursor-pointer items-center gap-2 rounded-lg px-3 py-[6px] hover:bg-state-base-hover"
          onClick={onClickRename}
        >
          <span className="text-sm text-text-secondary">
            {t("common.modelProvider.config")}
          </span>
        </div>
        <Divider className="!my-1" />
        <div
          className="group mx-1 flex h-8 cursor-pointer items-center gap-2 rounded-lg px-3 py-[6px] hover:bg-state-destructive-hover"
          onClick={onClickDelete}
        >
          <span
            className={cn(
              "text-sm text-text-secondary",
              "group-hover:text-text-destructive"
            )}
          >
            {t("common.operation.delete")}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="group relative col-span-1 inline-flex h-[110px] flex-col rounded-md border-[1px] border-solid border-components-card-border bg-components-card-bg transition-all duration-200 ease-in-out hover:shadow-lg hover:border-primary-600">
      <div className="grow rounded-t-xl p-3 flex h-[66px]">
        <div className="flex-1 justify-center w-0">
          <div className="text-base font-semibold leading-5 truncate text-text-secondary">
            {db.database_name}
          </div>
          {/* <button className='flex w-[60px] h-[28px] items-center justify-center rounded-[4px] text-[12px] font-medium text-text-tertiary bg-state-base-hover hover:bg-primary-base-hover hover:text-text-secondary'
            onClick={() => onConfig({ __model_name: model.model, __model_type: model.model_type })}>
            {t('common.modelProvider.config')}
          </button> */}
          <div className="text-xs text-text-tertiary mt-[5px]">{db.engine}</div>
          <div className="text-xs text-text-tertiary mt-[5px]">
            {db.parameters && db.parameters.host}
          </div>
        </div>

        <div
          className={cn(
            "flex items-center justify-center rounded text-xs font-medium text-white w-[40px] h-[40px] border-[0.5px] border-[#E0EAFF] ",
            {
              "bg-pink-500": db.engine === DatabaseEngine.mysql,
              "bg-green-500": db.engine === DatabaseEngine.postgresql,
              "bg-gray-500": db.engine === DatabaseEngine.sqlite,
              "bg-blue-500": db.engine === DatabaseEngine.oracle,
              "bg-red-500": db.engine === DatabaseEngine.mssql,
              "bg-yellow-500": db.engine === DatabaseEngine.elasticsearch,
              "bg-purple-500": db.engine === DatabaseEngine.clickhouse,
              "bg-blue-400": !Object.values(DatabaseEngine).includes(
                db.engine as DatabaseEngine
              ),
            }
          )}
        >
          {db.engine && db.engine.toUpperCase().slice(0, 2)}
        </div>
      </div>

      <div
        className={cn(
          "flex justify-end items-center pt-1 h-[40px] shrink-0 pb-[6px] pl-[14px] pr-[6px]"
        )}
      >
        <div className="flex shrink-0">
          <CustomPopover
            htmlContent={<Operations />}
            position="br"
            trigger="click"
            btnElement={
              <div className="flex justify-center items-center w-8 h-8 rounded-md cursor-pointer">
                <RiMoreFill className="w-4 h-4 text-text-secondary" />
              </div>
            }
            btnClassName={(open) =>
              cn(
                open ? "!bg-black/5 !shadow-none" : "!bg-transparent",
                "h-8 w-8 rounded-md border-none !p-2 hover:!bg-black/5"
              )
            }
            className={"!z-20 h-fit !w-[128px]"}
          />
        </div>
      </div>
      {showConfirm && (
        <Confirm
          title={t("common.modelProvider.confirmDelete")}
          isShow={showConfirm}
          onCancel={() => setShowConfirm(false)}
          onConfirm={handleRemove}
        />
      )}
    </div>
  );
};

export default Card;
