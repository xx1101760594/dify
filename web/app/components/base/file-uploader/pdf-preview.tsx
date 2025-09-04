import type { FC } from "react";
import { createPortal } from "react-dom";
import "react-pdf-highlighter/dist/style.css";
import {
  AreaHighlight,
  Content,
  IHighlight,
  PdfHighlighter,
  PdfLoader,
  ScaledPosition,
} from "react-pdf-highlighter";
import { t } from "i18next";
import { RiCloseLine, RiZoomInLine, RiZoomOutLine } from "@remixicon/react";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import Loading from "@/app/components/base/loading";
import useBreakpoints, { MediaType } from "@/hooks/use-breakpoints";
import Tooltip from "@/app/components/base/tooltip";
import HighlightSidebar from "./highlight-siderbar";

export type HighlightsData = {
  content: string;
  segment_position: number;
  polygons: {
    page: number;
    x_start: number;
    y_start: number;
    x_end: number;
    y_end: number;
  }[];
};

type PdfPreviewProps = {
  url: string;
  onCancel: () => void;
  highlightsData: HighlightsData[];
};

const PdfPreview: FC<PdfPreviewProps> = ({ url, onCancel, highlightsData }) => {
  const media = useBreakpoints();
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const isMobile = media === MediaType.mobile;
  const scrollViewerTo = useRef((highlight: IHighlight) => {});
  const [pdfDimensions, setPdfDimensions] = useState({
    width: 595,
    height: 842,
  }); // 默认 A4 尺寸
  const [pdfDocument, setPdfDocument] = useState<any>(null);

  // 获取PDF实际尺寸
  useEffect(() => {
    if (pdfDocument) {
      const getPdfDimensions = async () => {
        try {
          const firstPage = await pdfDocument.getPage(1);
          const viewport = firstPage.getViewport({ scale: 1 });
          setPdfDimensions({
            width: viewport.width,
            height: viewport.height,
          });
          console.log("PDF实际尺寸:", viewport.width, "x", viewport.height);
        } catch (error) {
          console.error("获取PDF尺寸失败:", error);
        }
      };

      getPdfDimensions();
    }
  }, [pdfDocument]);

  // 处理PDF文档加载完成
  const handlePdfLoad = useCallback(
    (pdfDoc: any) => {
      if (pdfDoc && pdfDoc !== pdfDocument) {
        setPdfDocument(pdfDoc);
      }
    },
    [pdfDocument]
  );

  // 将 HighlightsData 转换为 IHighlight 格式，根据 page 分组
  const convertToHighlights = (polygons: any): IHighlight[] => {
    if (!polygons) return [];
    return polygons.map(
      (
        polygon: {
          x_start: any;
          y_start: any;
          x_end: any;
          y_end: any;
          page: any;
        },
        index: number
      ) => ({
        id: `highlight-${index + 1}`,
        position: {
          boundingRect: {
            x1: polygon.x_start,
            y1: polygon.y_start,
            x2: polygon.x_end,
            y2: polygon.y_end,
            width: pdfDimensions.width,
            height: pdfDimensions.height,
          },
          rects: [
            {
              x1: polygon.x_start,
              y1: polygon.y_start,
              x2: polygon.x_end,
              y2: polygon.y_end,
              width: pdfDimensions.width,
              height: pdfDimensions.height,
            },
          ],
          pageNumber: polygon.page,
        },
        content: {
          text: `高亮区域 ${index + 1}`,
        },
        comment: {
          text: `这是第 ${index + 1} 个高亮区域`,
          emoji: "💡",
        },
      })
    );
  };

  // 存储当前显示的高亮
  const [currentHighlights, setCurrentHighlights] = useState<IHighlight[]>([]);

  // 添加一个标志来跟踪是否需要滚动
  const shouldScrollRef = useRef(false);

  const scrollToHighlightFromHash = useCallback(() => {
    const highlight = getHighlightById(parseIdFromHash());
    if (highlight) {
      scrollViewerTo.current(highlight);
    }
  }, []);

  const parseIdFromHash = () =>
    document.location.hash.slice("#highlight-".length);

  const getHighlightById = (id: string) => {
    return currentHighlights.find((highlight) => highlight.id === id);
  };
  // 添加 useEffect 来监听 currentHighlights 变化并执行滚动
  useEffect(() => {
    if (shouldScrollRef.current && currentHighlights.length > 0) {
      const firstHighlight = currentHighlights[0];
      if (firstHighlight) {
        // 延迟执行滚动，确保组件完全渲染
        setTimeout(() => {
          // 使用 DOM 操作滚动到指定页面
          const pdfContainer = document.querySelector('div[class*="pdf"]');
          if (pdfContainer) {
            const pageElements =
              pdfContainer.querySelectorAll("[data-page-number]");
            const targetPage =
              pageElements[firstHighlight.position.pageNumber - 1];
            if (targetPage) {
              // 滚动到页面顶部
              targetPage.scrollIntoView({ behavior: "smooth", block: "start" });

              // 进一步调整滚动位置到高亮区域的起始点
              setTimeout(() => {
                const container =
                  targetPage.closest(".react-pdf-highlighter__container") ||
                  targetPage.closest('div[class*="pdf"]') ||
                  document.querySelector('div[class*="pdf"]');

                if (container) {
                  // 计算高亮区域在页面中的相对位置
                  const pageHeight = (targetPage as HTMLElement).offsetHeight;
                  const highlightY = firstHighlight.position.boundingRect.y1;
                  const highlightRatio = highlightY / pageHeight;

                  // 计算需要滚动的额外距离
                  const targetScrollTop =
                    (container as HTMLElement).scrollTop +
                    highlightRatio * pageHeight;

                  // 平滑滚动到目标位置
                  (container as HTMLElement).scrollTo({
                    top: Math.max(0, targetScrollTop),
                    behavior: "smooth",
                  });

                  // 滚动完成后触发高亮更新
                  setTimeout(() => {
                    // 通过 updateHighlight 方法来触发高亮更新
                    if (currentHighlights.length > 0) {
                      const firstHighlight = currentHighlights[0];
                      updateHighlight(firstHighlight.id, {}, {});
                    }
                  }, 300);
                }
              }, 300);
            }
          }
          shouldScrollRef.current = false;
        }, 100);
      }
    }
  }, [currentHighlights]);

  const zoomIn = () => {
    setScale((prevScale) => Math.min(prevScale * 1.2, 15));
    setPosition({ x: position.x - 50, y: position.y - 50 });
  };

  const zoomOut = () => {
    setScale((prevScale) => {
      const newScale = Math.max(prevScale / 1.2, 0.5);
      if (newScale === 1) setPosition({ x: 0, y: 0 });
      else setPosition({ x: position.x + 50, y: position.y + 50 });

      return newScale;
    });
  };

  const updateHighlight = (
    highlightId: string,
    position: Partial<ScaledPosition>,
    content: Partial<Content>
  ) => {
    console.log("Updating highlight", highlightId, position, content);
    // 这里可以根据需要更新 highlightsData
    // 暂时保持原样，因为 updateHighlight 主要用于内部高亮更新
  };

  useHotkeys("esc", onCancel);
  useHotkeys("up", zoomIn);
  useHotkeys("down", zoomOut);

  const resetHash = () => {
    document.location.hash = "";
  };

  // 处理侧边栏高亮点击
  const handleHighlightClick = useCallback(
    (highlightData: HighlightsData) => {
      // 点击时才创建高亮并进行格式转换
      const highlights = convertToHighlights(highlightData.polygons);
      setCurrentHighlights(highlights);

      console.log("highlights", highlights);

      // 滚动到第一个高亮位置
      if (highlights.length > 0) {
        scrollToHighlight(highlights[0]);
      }
    },
    [convertToHighlights]
  );

  // 滚动到指定高亮位置
  const scrollToHighlight = useCallback((highlight: IHighlight) => {
    // 延迟执行滚动，确保组件完全渲染
    setTimeout(() => {
      // 使用 DOM 操作滚动到指定页面
      const pdfContainer = document.querySelector('div[class*="pdf"]');
      if (pdfContainer) {
        const pageElements =
          pdfContainer.querySelectorAll("[data-page-number]");
        const targetPage = pageElements[highlight.position.pageNumber - 1];
        if (targetPage) {
          // 滚动到页面顶部
          targetPage.scrollIntoView({ behavior: "smooth", block: "start" });

          // 进一步调整滚动位置到高亮区域的起始点
          setTimeout(() => {
            const container =
              targetPage.closest(".react-pdf-highlighter__container") ||
              targetPage.closest('div[class*="pdf"]') ||
              document.querySelector('div[class*="pdf"]');

            if (container) {
              // 计算高亮区域在页面中的相对位置
              const pageHeight = (targetPage as HTMLElement).offsetHeight;
              const highlightY = highlight.position.boundingRect.y1;
              const highlightRatio = highlightY / pageHeight;

              // 计算需要滚动的额外距离
              const targetScrollTop =
                (container as HTMLElement).scrollTop +
                highlightRatio * pageHeight;

              // 平滑滚动到目标位置
              (container as HTMLElement).scrollTo({
                top: Math.max(0, targetScrollTop),
                behavior: "smooth",
              });
            }
          }, 300);
        }
      }
    }, 100);
  }, []);

  return createPortal(
    <div
      className={`fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 ${
        !isMobile && "p-8"
      }`}
      onClick={(e) => e.stopPropagation()}
      tabIndex={-1}
    >
      {highlightsData.length > 0 && (
        <HighlightSidebar
          highlights={highlightsData}
          onHighlightClick={handleHighlightClick}
        />
      )}
      <div
        className="h-[95vh] max-h-full w-[100vw] max-w-full overflow-hidden"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <PdfLoader
          workerSrc="/pdf.worker.min.mjs"
          url={url}
          beforeLoad={
            <div className="flex justify-center items-center h-64">
              <Loading type="app" />
            </div>
          }
        >
          {(pdfDoc) => {
            setTimeout(() => {
              handlePdfLoad(pdfDoc);
            }, 0);

            return (
              <PdfHighlighter
                pdfDocument={pdfDoc}
                enableAreaSelection={() => false}
                scrollRef={(scrollTo) => {
                  scrollViewerTo.current = scrollTo;
                  scrollToHighlightFromHash();
                }}
                onScrollChange={resetHash}
                onSelectionFinished={() => null}
                highlightTransform={(
                  highlight,
                  index,
                  setTip,
                  hideTip,
                  viewportToScaled,
                  screenshot,
                  isScrolledTo
                ) => {
                  return (
                    <AreaHighlight
                      highlight={highlight}
                      isScrolledTo={isScrolledTo}
                      key={highlight.id}
                      onChange={(boundingRect) => {
                        updateHighlight(
                          highlight.id,
                          { boundingRect: viewportToScaled(boundingRect) },
                          { image: screenshot(boundingRect) }
                        );
                      }}
                    />
                  );
                }}
                highlights={currentHighlights}
              />
            );
          }}
        </PdfLoader>
      </div>

      {/* <Tooltip popupContent={t("common.operation.zoomOut")}>
        <div
          className="flex absolute top-6 right-24 justify-center items-center w-8 h-8 rounded-lg cursor-pointer"
          onClick={zoomOut}
        >
          <RiZoomOutLine className="w-4 h-4 text-gray-500" />
        </div>
      </Tooltip>
      <Tooltip popupContent={t("common.operation.zoomIn")}>
        <div
          className="flex absolute top-6 right-16 justify-center items-center w-8 h-8 rounded-lg cursor-pointer"
          onClick={zoomIn}
        >
          <RiZoomInLine className="w-4 h-4 text-gray-500" />
        </div>
      </Tooltip> */}
      <Tooltip popupContent={t("common.operation.cancel")}>
        <div
          className="absolute right-6 top-6 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-white/8 backdrop-blur-[2px]"
          onClick={onCancel}
        >
          <RiCloseLine className="w-4 h-4 text-gray-500" />
        </div>
      </Tooltip>
    </div>,
    document.body
  );
};

export default PdfPreview;
