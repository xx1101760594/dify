"use client";

import React, { useEffect, useRef, useState } from "react";
import Loading from "@/app/components/base/loading";
import { Hash02 } from "@/app/components/base/icons/src/vender/line/general";

// 类型定义
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

interface HighlightPdfViewProps {
  pdfUrl: string;
  highlightsData?: HighlightsData[];
}

// 全局PDF.js加载管理器
class PdfJsLoader {
  private static instance: PdfJsLoader;
  private loadingPromise: Promise<any> | null = null;
  private pdfjsLib: any = null;
  private isPreloading = false;
  private documentCache = new Map<string, any>();

  private constructor() {
    // 在构造函数中开始预加载
    this.preload();
  }

  static getInstance(): PdfJsLoader {
    if (!PdfJsLoader.instance) {
      PdfJsLoader.instance = new PdfJsLoader();
    }
    return PdfJsLoader.instance;
  }

  async load(): Promise<any> {
    // 如果已经加载完成，直接返回
    if (this.pdfjsLib) {
      return this.pdfjsLib;
    }

    // 如果正在加载，返回现有的Promise
    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    // 开始加载
    this.loadingPromise = this.loadPdfJs();
    try {
      this.pdfjsLib = await this.loadingPromise;
      return this.pdfjsLib;
    } finally {
      this.loadingPromise = null;
    }
  }

  private async loadPdfJs(): Promise<any> {
    // 检查是否已经加载
    if ((window as any).pdfjsLib) {
      const pdfjsLib = (window as any).pdfjsLib;
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
      return pdfjsLib;
    }

    // 动态加载PDF.js
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "/pdf.min.js";
      script.async = true;

      script.onload = () => {
        const pdfjsLib = (window as any).pdfjsLib;
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
        resolve(pdfjsLib);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // 加载PDF文档（带缓存）
  async loadDocument(url: string): Promise<any> {
    // 检查缓存
    if (this.documentCache.has(url)) {
      return this.documentCache.get(url);
    }

    const pdfjsLib = await this.load();
    const loadingTask = pdfjsLib.getDocument(url);
    const doc = await loadingTask.promise;

    // 缓存文档
    this.documentCache.set(url, doc);
    return doc;
  }

  // 清除文档缓存
  clearDocumentCache(url?: string): void {
    if (url) {
      this.documentCache.delete(url);
    } else {
      this.documentCache.clear();
    }
  }

  // 预加载PDF.js
  preload(): void {
    if (!this.pdfjsLib && !this.loadingPromise && !this.isPreloading) {
      this.isPreloading = true;
      this.load()
        .catch(console.error)
        .finally(() => {
          this.isPreloading = false;
        });
    }
  }

  // 检查是否已加载
  isLoaded(): boolean {
    return !!this.pdfjsLib;
  }

  // 检查是否正在加载
  isLoading(): boolean {
    return !!(this.loadingPromise || this.isPreloading);
  }
}

const HighlightPdfView: React.FC<HighlightPdfViewProps> = ({
  pdfUrl,
  highlightsData = [],
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeChunkId, setActiveChunkId] = useState<string | null>(null);
  const [currentScale, setCurrentScale] = useState(1);
  const [pdfPages, setPdfPages] = useState<
    Array<{
      pageNum: number;
      canvas: HTMLCanvasElement;
      width: number;
      height: number;
    }>
  >([]);

  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const highlightLayersRef = useRef<Map<number, HTMLDivElement>>(new Map());
  const pdfLoader = PdfJsLoader.getInstance();

  // 初始化PDF查看器
  useEffect(() => {
    let isMounted = true;

    const initPdfViewer = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 使用加载管理器加载PDF文档（带缓存）
        const doc = await pdfLoader.loadDocument(pdfUrl);
        const pdfjsLib = await pdfLoader.load();

        if (!isMounted) return;

        // 渲染所有页面
        await renderAllPages(doc, pdfjsLib);

        setIsLoading(false);
      } catch (err) {
        if (isMounted) {
          console.error("PDF加载失败:", err);
          setError("PDF加载失败，请检查文件是否存在");
          setIsLoading(false);
        }
      }
    };

    if (pdfUrl) {
      initPdfViewer();
    }

    // 清理函数
    return () => {
      isMounted = false;
      setPdfPages([]);
      highlightLayersRef.current.clear();
      // 清理当前PDF文档的缓存
      pdfLoader.clearDocumentCache(pdfUrl);
    };
  }, [pdfUrl, pdfLoader]);

  // 渲染所有页面
  const renderAllPages = async (doc: any, pdfjsLib: any) => {
    const numPages = doc.numPages;
    const pages: Array<{
      pageNum: number;
      canvas: HTMLCanvasElement;
      width: number;
      height: number;
    }> = [];

    // 获取容器宽度来计算缩放比例
    const containerWidth = (pdfContainerRef.current?.clientWidth || 800) - 40;
    let scale = 1;

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await doc.getPage(pageNum);
      const originalViewport = page.getViewport({ scale: 1 });

      // 计算适合容器宽度的缩放比例
      if (pageNum === 1) {
        scale = containerWidth / originalViewport.width;
        setCurrentScale(scale);
      }

      const viewport = page.getViewport({ scale });

      // 创建canvas
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      canvas.style.display = "block";
      canvas.style.width = "100%";
      canvas.style.height = "auto";

      // 渲染PDF页面
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;

      pages.push({
        pageNum,
        canvas,
        width: viewport.width,
        height: viewport.height,
      });
    }

    setPdfPages(pages);
  };

  // 高亮指定区域
  const highlightArea = (highlightIndex: number) => {
    if (!highlightsData[highlightIndex]) {
      console.warn("找不到高亮数据:", highlightIndex);
      return;
    }
    const highlightData = highlightsData[highlightIndex];

    setActiveChunkId(`highlight-${highlightIndex}`);

    // 清除所有现有高亮
    clearAllHighlights();

    // 添加新的高亮
    highlightData.polygons.forEach((polygon, polygonIndex) => {
      addHighlight(
        polygon,
        highlightData.content,
        highlightIndex,
        polygonIndex
      );
    });

    // 滚动到对应页面和高亮区域 - 使用 setTimeout 确保 DOM 更新完成
    if (highlightData.polygons && highlightData.polygons.length > 0) {
      setTimeout(() => {
        // 获取第一个高亮区域的Y位置，用于精确定位
        const firstPolygon = highlightData.polygons[0];
        scrollToPage(firstPolygon.page, firstPolygon.y_start);
      }, 100);
    }
  };

  // 滚动到指定页面和高亮区域
  const scrollToPage = (pageNumber: number, highlightY?: number) => {
    console.log(`尝试滚动到页面 ${pageNumber}, 高亮Y位置: ${highlightY}`);

    const pageElement = document.querySelector(
      `.pdf-page[data-page="${pageNumber}"]`
    ) as HTMLElement;
    const pdfContainer = pdfContainerRef.current;

    if (!pageElement) {
      console.warn(`找不到页面元素: ${pageNumber}`);
      return;
    }

    if (!pdfContainer) {
      console.warn("找不到PDF容器");
      return;
    }

    // 计算页面元素相对于容器的位置
    const pageScrollTop = pageElement.offsetTop - pdfContainer.offsetTop;

    let targetScrollTop = pageScrollTop;

    // 如果有高亮Y位置，计算滚动到高亮区域的位置
    if (highlightY !== undefined) {
      // 高亮Y位置是相对于页面的，需要加上页面的偏移
      const highlightScrollTop = pageScrollTop + highlightY * currentScale;

      // 获取容器高度，确保高亮区域在可视范围内
      const containerHeight = pdfContainer.clientHeight;

      // 计算目标滚动位置，让高亮区域在容器中间偏上的位置
      targetScrollTop = highlightScrollTop - containerHeight * 0.3;
    } else {
      // 没有高亮位置时，滚动到页面顶部
      targetScrollTop = pageScrollTop - 20;
    }

    console.log(
      `页面 ${pageNumber} 的 offsetTop: ${pageElement.offsetTop}, 容器 offsetTop: ${pdfContainer.offsetTop}, 目标滚动距离: ${targetScrollTop}`
    );

    // 平滑滚动到目标位置
    pdfContainer.scrollTo({
      top: Math.max(0, targetScrollTop),
      behavior: "smooth",
    });
  };

  // 清除所有高亮
  const clearAllHighlights = () => {
    highlightLayersRef.current.forEach((layer) => {
      if (layer) {
        while (layer.firstChild) {
          layer.removeChild(layer.firstChild);
        }
      }
    });
  };

  // 添加单个高亮
  const addHighlight = (
    polygon: any,
    content: string,
    highlightIndex: number,
    polygonIndex: number
  ) => {
    const pageNumber = polygon.page;
    const highlightLayer = highlightLayersRef.current.get(pageNumber);

    if (!highlightLayer) {
      console.warn(`找不到页面 ${pageNumber} 的高亮层`);
      return;
    }

    // 根据缩放比例调整高亮位置和尺寸
    const scaledX1 = polygon.x_start * currentScale;
    const scaledY1 = polygon.y_start * currentScale;
    const scaledWidth = (polygon.x_end - polygon.x_start) * currentScale;
    const scaledHeight = (polygon.y_end - polygon.y_start) * currentScale;

    // 获取页面容器的实际尺寸
    const pageContainer = highlightLayer.parentElement;
    if (!pageContainer) return;

    const pageWidth = pageContainer.clientWidth;
    const pageHeight = pageContainer.clientHeight - 41; // 减去页面信息的高度

    // 边界检查：确保高亮不超出页面范围
    let finalX1 = Math.max(0, scaledX1);
    let finalY1 = Math.max(0, scaledY1);
    let finalWidth = Math.min(scaledWidth, pageWidth - finalX1);
    let finalHeight = Math.min(scaledHeight, pageHeight - finalY1);

    // 如果高亮完全超出页面范围，则跳过
    if (
      finalWidth <= 0 ||
      finalHeight <= 0 ||
      finalX1 >= pageWidth ||
      finalY1 >= pageHeight
    ) {
      console.warn(`高亮超出页面范围，跳过`);
      return;
    }

    // 创建高亮元素
    const highlightElement = document.createElement("div");
    highlightElement.className =
      "absolute z-10 rounded-sm border-2 cursor-pointer highlight-rect bg-yellow-200/60 border-yellow-500/80 hover:bg-yellow-200/80 hover:border-yellow-500";
    highlightElement.style.left = finalX1 + "px";
    highlightElement.style.top = finalY1 + "px";
    highlightElement.style.width = finalWidth + "px";
    highlightElement.style.height = finalHeight + "px";

    // 点击事件
    highlightElement.addEventListener("click", function () {
      highlightArea(highlightIndex);
    });

    highlightLayer.appendChild(highlightElement);
  };

  if (error) {
    return <div className="p-5 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="flex gap-5 p-5 h-screen bg-gray-100">
      {/* 左侧高亮区域列表 */}
      <div className="flex overflow-y-auto flex-col flex-shrink-0 p-4 w-80 bg-gray-50 rounded-lg">
        <div className="overflow-y-auto flex-1">
          {highlightsData.map((highlightData, index) => {
            const isActive = activeChunkId === `highlight-${index}`;
            const pageNumbers = [
              ...new Set(highlightData.polygons.map((p) => p.page)),
            ].sort((a, b) => a - b);
            return (
              <div
                key={`highlight-${index}`}
                className={`bg-white border rounded p-3 mb-3 cursor-pointer transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 border-blue-500"
                    : "border-gray-300 hover:border-blue-5"
                }`}
                onClick={() => highlightArea(index)}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex h-5 items-center rounded-md border border-divider-subtle px-1.5">
                    <Hash02 className="mr-0.5 h-3 w-3 text-text-quaternary" />
                    <div className="text-[11px] font-medium text-text-tertiary">
                      {highlightData.segment_position}
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded">
                    第{pageNumbers.join(",")}页
                  </span>
                </div>
                <div className="overflow-y-auto max-h-20 leading-relaxed text-gray-700 text-[12px]">
                  {highlightData.content}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 右侧PDF预览 */}
      <div className="flex flex-col flex-1 min-w-0 min-h-0">
        <div
          ref={pdfContainerRef}
          className="box-border overflow-x-auto overflow-y-auto flex-1 p-5 w-full min-h-0 text-center bg-gray-100 rounded border border-gray-300"
        >
          {isLoading && (
            <div className="flex justify-center items-center h-64">
              <Loading type="app" />
            </div>
          )}

          {!isLoading && pdfPages.length === 0 && (
            <div className="p-5 text-gray-600">准备渲染PDF...</div>
          )}

          {pdfPages.map((page) => (
            <div
              key={page.pageNum}
              className="overflow-hidden relative mx-auto mb-5 bg-white rounded shadow-lg pdf-page"
              data-page={page.pageNum}
              style={{ width: page.width + "px" }}
            >
              {/* 页面信息 */}
              <div className="p-3 font-bold bg-gray-100 border-b border-gray-300">
                第 {page.pageNum} 页
              </div>

              {/* Canvas容器 */}
              <div className="relative">
                <div
                  ref={(el) => {
                    if (el && page.canvas) {
                      el.innerHTML = "";
                      el.appendChild(page.canvas);
                    }
                  }}
                />

                {/* 高亮层 */}
                <div
                  ref={(el) => {
                    if (el) {
                      highlightLayersRef.current.set(page.pageNum, el);
                    }
                  }}
                  className="absolute top-0 left-0 w-full h-full pointer-events-none highlight-layer"
                  data-page={page.pageNum}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HighlightPdfView;
