import { useState, useRef, useEffect } from "react";
import styles from "./SelectionDropDown.module.scss";

export default function SelectionDropDown({
  items = [],
  initialSelectedId = null,
  onSelect,
  onSelectAll
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(initialSelectedId);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setSelectedId(initialSelectedId ?? null);
  }, [initialSelectedId]);

  const selectedItem = items.find((item) => item.id === selectedId) || null;

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(item) {
    setSelectedId(item.id);
    setIsOpen(false);
    onSelect?.(item.id);
  }

  function handleSelectAll() {
    setSelectedId(null);
    setIsOpen(false);
    onSelectAll?.();
  }

  return (
    <div className={styles.dropdown} ref={wrapperRef}>
      <button
        className={styles.dropdown__trigger}
        onClick={() => setIsOpen((prev) => !prev)}
        type="button"
      >
        {selectedItem ? selectedItem.slug : "All"}
        <span className={styles.dropdown__arrow}>▼</span>
      </button>

      {isOpen && (
        <div className={styles.dropdown__menu}>
          <div className={styles.dropdown__item} onClick={handleSelectAll}>
            All
          </div>

          {items.map((item) => (
            <div
              key={item.id}
              className={styles.dropdown__item}
              onClick={() => handleSelect(item)}
            >
              {item.slug}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}