"use client";
import { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useEffect, useState, useRef } from "react";
import type { ModelItem } from "@/app/components/header/account-setting/model-provider-page/declarations";

import { useDatabaseModalHandler } from "@/app/components/header/account-setting/model-provider-page/hooks";
import { useModalContextSelector } from "@/context/modal-context";
import { provider } from "./provider";
import CreateDatabaseCard from "./create-card";
import DatabaseCard from "./database-card";
import { useEventEmitterContextContext } from "@/context/event-emitter";
import { useDebounceFn } from "ahooks";
import DatabaseEmptyState from "./empty-state";
import { fetchDatabaseList } from "@/service/database";

const DatabaseListPage = () => {
  const { t } = useTranslation();

  const { eventEmitter } = useEventEmitterContextContext();
  const handleOpenDatabaseModal = useDatabaseModalHandler();
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState("");
  const [databaseList, setDatabaseList] = useState<any>([]);

  const getList = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const { data }: any = await fetchDatabaseList({});
      setDatabaseList(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getList();
  }, []);

  eventEmitter?.useSubscription((v: any) => {
    if (v?.type === "UPDATE_MODEL_PROVIDER_CUSTOM_MODEL_LIST" || v?.type === "UPDATE_DATABASE_LIST") {
      getList();
    }
  });

  const setShowModelLoadBalancingModal = useModalContextSelector(
    (state) => state.setShowModelLoadBalancingModal
  );

  const onModifyLoadBalancing = useCallback(
    (model: ModelItem) => {
      setShowModelLoadBalancingModal({
        provider,
        model: model!,
        open: !!model,
        onClose: () => setShowModelLoadBalancingModal(null),
        onSave: getList,
      });
    },
    [getList, provider, setShowModelLoadBalancingModal]
  );

  const onConfig = (database: any) => {
    handleOpenDatabaseModal(database, true);
  };

  const onSuccess = () => {
    getList();
  };

  const { run: handleSearch } = useDebounceFn(
    () => {
      getList();
    },
    { wait: 500 }
  );

  const handleKeywordsChange = (val: string) => {
    setKeywords(val);
    handleSearch();
  };

  return (
    <>
      <div className="flex sticky top-0 z-10 flex-wrap gap-y-2 justify-between items-center px-12 py-6 bg-background-body">
        {databaseList.length >= 1 && (
          <CreateDatabaseCard
            onOpenModal={() => handleOpenDatabaseModal(undefined, false)}
          ></CreateDatabaseCard>
        )}
        {/* <div className='flex gap-2 items-center'>
        <Input
          showLeftIcon
          showClearIcon
          wrapperClassName='w-[200px]'
          value={keywords}
          onChange={e => handleKeywordsChange(e.target.value)}
          onClear={() => handleKeywordsChange('')}
        />
      </div> */}
      </div>
      <div className="grid relative grid-cols-1 gap-8 content-start px-12 pb-5 grow sm:grid-cols-2 md:grid-cols-4 2xl:grid-cols-5 2k:grid-cols-6">
        {databaseList.length === 0 ? (
          <div className="col-span-full">
            <DatabaseEmptyState
              onCreateDatabase={() => handleOpenDatabaseModal(undefined, false)}
            />
          </div>
        ) : (
          databaseList.map((db: any) => (
            <DatabaseCard
              key={db.id}
              {...{
                db,
                provider,
                onModifyLoadBalancing,
                onConfig,
                onSuccess,
              }}
            />
          ))
        )}
      </div>
    </>
  );
};

export default DatabaseListPage;
