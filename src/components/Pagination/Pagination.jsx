import React, { useMemo } from "react";
import "./Pagination.scss";

export default function Pagination({ currentPage, numberOfPages, onPageChange }) {
  const curr = Number(currentPage);
  const total = Number(numberOfPages);

  const items = useMemo(() => {
    if (!Number.isFinite(curr) || !Number.isFinite(total) || total <= 0) return [];
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

    const result = [];

    const addPage = (n) => result.push({ type: "page", value: n });
    const addEllipsis = () => result.push({ type: "ellipsis" });

    const first = 1;
    const last = total;

    addPage(first);

    const start = Math.max(2, curr - 1);
    const end = Math.min(last - 1, curr + 1);

    if (start > 2) addEllipsis();

    for (let p = start; p <= end; p++) addPage(p);

    if (end < last - 1) addEllipsis();

    addPage(last);

    const seen = new Set();
    return result.filter((it) => {
      if (it.type === "ellipsis") return true;
      if (seen.has(it.value)) return false;
      seen.add(it.value);
      return true;
    });
  }, [curr, total]);

  if (total <= 1) return null;

  return (
    <div className="pagination">
      {items.map((it, idx) => {
        if (it.type === "ellipsis") {
          return (
            <span key={`ellipsis-${idx}`} className="pagination__ellipsis">
              ...
            </span>
          );
        }

        const page = it.value;

        return (
          <button
            key={`page-${page}`}
            className={`pagination__button ${page === curr ? "active" : ""}`}
            onClick={() => onPageChange(page)}
            disabled={page === curr}
          >
            {page}
          </button>
        );
      })}
    </div>
  );
}
