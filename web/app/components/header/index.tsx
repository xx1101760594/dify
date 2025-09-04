"use client";
import { useCallback, useEffect } from "react";
import Link from "next/link";
import { useBoolean } from "ahooks";
import { useSelectedLayoutSegment } from "next/navigation";
import { Bars3Icon } from "@heroicons/react/20/solid";
import AccountDropdown from "./account-dropdown";
import AppNav from "./app-nav";
import DatasetNav from "./dataset-nav";
import DatabaseNav from "./database-nav";
import EnvNav from "./env-nav";
import PluginsNav from "./plugins-nav";
import WorkspaceNav from "./workspace";
import ExploreNav from "./explore-nav";
import ToolsNav from "./tools-nav";
import ModelsNav from "./models-nav";
import { WorkspaceProvider } from "@/context/workspace-context";
import { useAppContext } from "@/context/app-context";
import DifyLogo from "@/app/components/base/logo/dify-logo";
import WorkplaceSelector from "@/app/components/header/account-dropdown/workplace-selector";
import useBreakpoints, { MediaType } from "@/hooks/use-breakpoints";
import { useProviderContext } from "@/context/provider-context";
import { useModalContext } from "@/context/modal-context";
import PlanBadge from "./plan-badge";
import LicenseNav from "./license-env";
import { Plan } from "../billing/type";
import { basePath } from "@/utils/var";
import { useTranslation } from "react-i18next";

const navClassName = `
  flex items-center justify-center relative mr-0 sm:mr-3 px-3 h-8 rounded-2xl
  font-medium text-sm
  cursor-pointer
  w-[94px]
`;

const Header = () => {
  const { t } = useTranslation();
  const { isCurrentWorkspaceEditor, isCurrentWorkspaceDatasetOperator } =
    useAppContext();
  const selectedSegment = useSelectedLayoutSegment();
  const media = useBreakpoints();
  const isMobile = media === MediaType.mobile;
  const [isShowNavMenu, { toggle, setFalse: hideNavMenu }] = useBoolean(false);
  const { enableBilling, plan } = useProviderContext();
  const { setShowPricingModal, setShowAccountSettingModal } = useModalContext();
  const isFreePlan = plan.type === Plan.sandbox;
  const handlePlanClick = useCallback(() => {
    if (isFreePlan) setShowPricingModal();
    else setShowAccountSettingModal({ payload: "billing" });
  }, [isFreePlan, setShowAccountSettingModal, setShowPricingModal]);

  useEffect(() => {
    hideNavMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSegment]);
  return (
    <div className="flex relative flex-1 justify-between items-center pr-5 pl-5 bg-white">
      <div className="flex items-center">
        <div className="flex items-center pr-5">
          <img
            src={`${basePath}/logo/logo.png`}
            className="block object-contain w-28"
            alt="logo"
          />
          <span className="pr-2 pl-2 text-gray-300">|</span>
          <span className="text-lg">{t("common.menus.mofang")}</span>
          {/* {isMobile && <div
            className='flex justify-center items-center w-8 h-8 cursor-pointer'
            onClick={toggle}
          >
            <Bars3Icon className="w-4 h-4 text-gray-500" />
          </div>}
          {
            !isMobile
            && <div className='flex shrink-0 items-center gap-1.5 self-stretch pl-3'>
              <Link href="/apps" className='flex h-8 w-[52px] shrink-0 items-center justify-center gap-2'>
                <CubixLogo />
              </Link>
              <div className='font-light text-divider-deep'>/</div>
              <div className='flex items-center gap-0.5'>
                <WorkspaceProvider>
                  <WorkplaceSelector />
                </WorkspaceProvider>
                {enableBilling ? <PlanBadge allowHover sandboxAsUpgrade plan={plan.type} onClick={handlePlanClick} /> : <LicenseNav />}
              </div>
            </div>
          } */}
        </div>
        {isMobile && (
          <div className="flex">
            <Link href="/apps" className="flex items-center mr-4">
              <DifyLogo />
            </Link>
            <div className="font-light text-divider-deep">/</div>
            {enableBilling ? (
              <PlanBadge
                allowHover
                sandboxAsUpgrade
                plan={plan.type}
                onClick={handlePlanClick}
              />
            ) : (
              <LicenseNav />
            )}
          </div>
        )}
        {!isMobile && (
          <div className="flex items-center">
            {!isCurrentWorkspaceDatasetOperator && (
              <ExploreNav className={navClassName} />
            )}
            {!isCurrentWorkspaceDatasetOperator && <AppNav />}
            <DatasetNav />
            {!isCurrentWorkspaceDatasetOperator && (
              <DatabaseNav className={navClassName} />
            )}
            {!isCurrentWorkspaceDatasetOperator && (
              <ToolsNav className={navClassName} />
            )}
            {!isCurrentWorkspaceDatasetOperator && (
              <ModelsNav className={navClassName} />
            )}
          </div>
        )}
      </div>
      <div className="flex items-center pr-3 shrink-0">
        <EnvNav />
        {/* <div className='mr-2'>
          <PluginsNav />
        </div> */}
        <div className='mr-2'>
          <WorkspaceNav />
        </div>
        <AccountDropdown />
      </div>
      {isMobile && isShowNavMenu && (
        <div className="flex flex-col gap-y-1 p-2 w-full">
          {!isCurrentWorkspaceDatasetOperator && (
            <ExploreNav className={navClassName} />
          )}
          {!isCurrentWorkspaceDatasetOperator && <AppNav />}
          <DatasetNav />
          {!isCurrentWorkspaceDatasetOperator && (
            <DatabaseNav className={navClassName} />
          )}
          {!isCurrentWorkspaceDatasetOperator && (
            <ModelsNav className={navClassName} />
          )}
          {!isCurrentWorkspaceDatasetOperator && (
            <ToolsNav className={navClassName} />
          )}
        </div>
      )}
    </div>
  );
};
export default Header;
