"use client";
import { useCallback, useState, useEffect } from "react";
import { useContext } from "use-context-selector";
import { useTranslation } from "react-i18next";
import WorkspaceSelector from "./workspace-selector";
import cn from "@/utils/classnames";
import s from "./index.module.css";
import { getAllWorkspace, workspaceSwitch } from "@/service/common";
import { WorkspaceListRes } from '@/models/common'
import { ToastContext } from "@/app/components/base/toast";
import I18n from "@/context/i18n";
import { noop } from "lodash-es";

const WorkSpaceNav = () => {
  const { t } = useTranslation();
  const { notify } = useContext(ToastContext);
  const { locale } = useContext(I18n);
  const [workList, setWorkList] = useState<WorkspaceListRes[]>([]);
  const [workspaceId, setWorkspaceId] = useState<string>("");
  const [currWorkSpace, setCurrWorkSpace] = useState<WorkspaceListRes>({});

  const getWorkspace = useCallback(async () => {
    try {
      const res = await getAllWorkspace(`/workspaces`);
      setWorkList(res.workspaces);
      const currData = res.workspaces.find((item: WorkspaceListRes ) => item.current)
      setCurrWorkSpace(currData)
    } catch {}
  }, []);

  useEffect(() => {
    getWorkspace();
  }, []);

  const changeWorkspace = async (id: string) => {
    const res = await workspaceSwitch({url:'/workspaces/switch', body: {tenant_id: id}})
    setCurrWorkSpace(res?.new_tenant)
    notify({ type: 'success', message: t('common.members.switchSucessTip') })
    location.reload()
  }

  return (
    <div className={cn(s.wrap)}>
        <WorkspaceSelector workList={workList} currWork={currWorkSpace} onChange={changeWorkspace} />
    </div>
  );
};

export default WorkSpaceNav;
