import { Fragment, useState } from "react";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import Tooltip from "./tooltip";
import ProgressTooltip from "./progress-tooltip";
import type { Resources } from "./index";
import {
  PortalToFollowElem,
  PortalToFollowElemContent,
  PortalToFollowElemTrigger,
} from "@/app/components/base/portal-to-follow-elem";
import FileIcon from "@/app/components/base/file-icon";
import Modal from "@/app/components/base/modal";
import {
  Hash02,
  Target04,
} from "@/app/components/base/icons/src/vender/line/general";
import {
  BezierCurve03,
  TypeSquare,
} from "@/app/components/base/icons/src/vender/line/editor";
import { get } from "@/service/base";
import Loading from "@/app/components/base/loading";
import HighlightPdfView from "@/app/components/base/file-uploader/highlight-pdf-view";

type PopupProps = {
  data: Resources;
  showHitInfo?: boolean;
};

const Popup: FC<PopupProps> = ({ data, showHitInfo = false }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedSource, setSelectedSource] = useState<any>(null);
  const [loadingContent, setLoadingContent] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const fileType =
    data.dataSourceType !== "notion"
      ? /\.([^.]*)$/g.exec(data.documentName)?.[1] || ""
      : "notion";

  const handleSourceClick = async (source: any) => {
    setSelectedSource(source);
    setShowDocumentModal(true);
    setOpen(false);
    setLoadingContent(true);
    setPreviewUrl("");

    try {
      // 获取文档详情
      const { file_preview_url } = await get<any>(
        `/datasets/${source.dataset_id}/documents/${source.document_id}/preview-file`
      );
      // 设置PDF预览URL
      setPreviewUrl(file_preview_url);
    } catch (error) {
      console.error("Failed to fetch document content:", error);
    } finally {
      setLoadingContent(false);
    }
  };

  const handleCloseDocumentModal = () => {
    setShowDocumentModal(false);
    setSelectedSource(null);
    setPreviewUrl("");
  };

  const renderFilePreview = () => {
    if (!previewUrl) return null;

    console.log("renderFilePreview", data.sources);

    const highlightsData: any[] = [];
    data.sources.forEach((source) => {
      if (source.polygons) {
        const polygons = JSON.parse(source.polygons);
        highlightsData.push({
          content: source.content,
          polygons: polygons,
          segment_position: source.segment_position,
        });
      }
    });

    return (
      <HighlightPdfView pdfUrl={previewUrl} highlightsData={highlightsData} />
    );
  };

  return (
    <>
      <PortalToFollowElem
        open={open}
        onOpenChange={setOpen}
        placement="top-start"
        offset={{
          mainAxis: 8,
          crossAxis: -2,
        }}
      >
        <PortalToFollowElemTrigger onClick={() => setOpen((v) => !v)}>
          <div className="flex h-7 max-w-[240px] items-center rounded-lg bg-components-button-secondary-bg px-2">
            <FileIcon type={fileType} className="mr-1 w-4 h-4 shrink-0" />
            <div className="text-xs truncate text-text-tertiary">
              {data.documentName}
            </div>
          </div>
        </PortalToFollowElemTrigger>
        <PortalToFollowElemContent style={{ zIndex: 1000 }}>
          <div className="max-w-[360px] rounded-xl bg-background-section-burn shadow-lg">
            <div className="px-4 pt-3 pb-2">
              <div className="flex h-[18px] items-center">
                <FileIcon type={fileType} className="mr-1 w-4 h-4 shrink-0" />
                <div className="truncate system-xs-medium text-text-tertiary">
                  {data.documentName}
                </div>
              </div>
            </div>
            <div className="max-h-[450px] overflow-y-auto rounded-lg bg-components-panel-bg px-4 py-0.5">
              <div className="w-full">
                {data.sources.map((source, index) => (
                  <Fragment key={index}>
                    <div className="py-3 group">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex h-5 items-center rounded-md border border-divider-subtle px-1.5">
                          <Hash02 className="mr-0.5 h-3 w-3 text-text-quaternary" />
                          <div className="text-[11px] font-medium text-text-tertiary">
                            {source.segment_position || index + 1}
                          </div>
                        </div>
                        <div className="flex gap-2 items-center">
                          {/* 只有PDF文件才显示预览按钮 */}
                          {fileType === "pdf" && (
                            <button
                              onClick={() => handleSourceClick(source)}
                              className="hidden h-[18px] items-center text-xs text-text-accent group-hover:flex hover:text-text-accent-hover"
                              title={t("common.chat.citation.previewDocument")}
                            >
                              {t("common.chat.citation.preview")}
                            </button>
                          )}
                        </div>
                      </div>
                      <div
                        className={`break-words text-[13px] text-text-secondary rounded px-2 py-1 -mx-2 ${
                          fileType === "pdf"
                            ? "cursor-pointer hover:bg-components-panel-bg-hover"
                            : ""
                        }`}
                        onClick={
                          fileType === "pdf"
                            ? () => handleSourceClick(source)
                            : undefined
                        }
                      >
                        {source.content}
                      </div>
                      {showHitInfo && (
                        <div className="flex flex-wrap items-center mt-2 system-xs-medium text-text-quaternary">
                          <Tooltip
                            text={t("common.chat.citation.characters")}
                            data={source.word_count}
                            icon={<TypeSquare className="mr-1 w-3 h-3" />}
                          />
                          <Tooltip
                            text={t("common.chat.citation.hitCount")}
                            data={source.hit_count}
                            icon={<Target04 className="mr-1 w-3 h-3" />}
                          />
                          <Tooltip
                            text={t("common.chat.citation.vectorHash")}
                            data={source.index_node_hash?.substring(0, 7)}
                            icon={<BezierCurve03 className="mr-1 w-3 h-3" />}
                          />
                          {source.score && (
                            <ProgressTooltip
                              data={Number(source.score.toFixed(2))}
                            />
                          )}
                        </div>
                      )}
                    </div>
                    {index !== data.sources.length - 1 && (
                      <div className="my-1 h-[1px] bg-divider-regular" />
                    )}
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </PortalToFollowElemContent>
      </PortalToFollowElem>

      {/* 文档预览弹框 */}
      {showDocumentModal && selectedSource && (
        <Modal
          title={t("common.chat.citation.documentPreview")}
          isShow={showDocumentModal}
          onClose={handleCloseDocumentModal}
          className="!w-[95vw] !max-w-[95vw] !h-[95vh] !max-h-[95vh] !p-6 !rounded-none"
          wrapperClassName="!p-0"
          closable={true}
        >
          <div className="flex flex-col h-full">
            {/* 头部信息 */}
            <div className="flex flex-shrink-0 justify-between items-center pb-4 mb-4 border-b border-divider-regular">
              <div className="flex gap-2 items-center">
                <FileIcon type={fileType} className="w-4 h-4" />
                <span className="text-sm font-medium">{data.documentName}</span>
              </div>
            </div>

            {/* 主要内容区域 */}
            <div className="flex overflow-hidden flex-col flex-1">
              {/* 加载状态 */}
              {loadingContent && (
                <div className="flex justify-center items-center h-full">
                  <Loading type="app" />
                </div>
              )}

              {/* PDF预览 */}
              {!loadingContent && renderFilePreview()}
            </div>

            {/* 底部信息 */}
            {showHitInfo && (
              <div className="flex flex-wrap flex-shrink-0 gap-4 items-center pt-4 mt-4 border-t border-divider-regular system-xs-medium text-text-quaternary">
                <Tooltip
                  text={t("common.chat.citation.characters")}
                  data={selectedSource.word_count}
                  icon={<TypeSquare className="mr-1 w-3 h-3" />}
                />
                <Tooltip
                  text={t("common.chat.citation.hitCount")}
                  data={selectedSource.hit_count}
                  icon={<Target04 className="mr-1 w-3 h-3" />}
                />
                <Tooltip
                  text={t("common.chat.citation.vectorHash")}
                  data={selectedSource.index_node_hash?.substring(0, 7)}
                  icon={<BezierCurve03 className="mr-1 w-3 h-3" />}
                />
                {selectedSource.score && (
                  <ProgressTooltip
                    data={Number(selectedSource.score.toFixed(2))}
                  />
                )}
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  );
};

export default Popup;
