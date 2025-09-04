import { HighlightsData } from "./pdf-preview";

interface Props {
  highlights: Array<HighlightsData>;
  onHighlightClick?: (highlight: HighlightsData, index: number) => void;
}

export default function HighlightSidebar({
  highlights,
  onHighlightClick,
}: Props) {
  return (
    <div
      className="sidebar h-[95vh] overflow-y-auto"
      style={{ width: "25vw", backgroundColor: "#fff" }}
    >
      <ul className="sidebar__highlights">
        {highlights.map((highlight, index) => (
          <li
            key={index}
            className="p-3 mb-3 rounded-md border border-gray-200 transition-colors cursor-pointer sidebar__highlight hover:bg-gray-100"
            onClick={() => onHighlightClick?.(highlight, index)}
          >
            <div>
              <p className="break-words text-[13px] text-text-secondary cursor-pointer hover:bg-components-panel-bg-hover rounded px-2 py-1 -mx-2 max-h-[100px] overflow-y-auto">
                {highlight.content}
              </p>
                             <div className="mt-2 text-sm text-center text-gray-500">
                 页面 {[...new Set(highlight.polygons.map((polygon) => polygon.page))].sort((a, b) => a - b).join(",")}
               </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
