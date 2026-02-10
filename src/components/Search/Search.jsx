import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MOCK_RECIPE_TYPES } from "../../mockData/mockData";
import "./Search.scss";

function normalize(s) {
  return (s || "").trim().toLowerCase();
}

function dedupeStrings(arr) {
  const seen = new Set();
  const out = [];
  for (const s of arr) {
    const key = normalize(s);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(s);
  }
  return out;
}

export default function Search({
  title = "Find recipe type",
  placeholder = "Search recepie type",
  minChars = 1,
  debounceMs = 250,
  maxSuggestions = 8,
}) {
  const navigate = useNavigate();

  const rootRef = useRef(null);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const canSuggest = useMemo(() => normalize(query).length >= minChars, [query, minChars]);

  useEffect(() => {
    function onDocMouseDown(e) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) {
        setIsOpen(false);
        setHighlightIndex(-1);
      }
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  // Debounced suggestion lookup
  useEffect(() => {
    let timerId;

    async function loadSuggestions() {
      const q = normalize(query);
      if (!canSuggest) {
        setSuggestions([]);
        setIsOpen(false);
        setHighlightIndex(-1);
        return;
      }

      setIsLoading(true);

      // MOCK (replace with real API later)
      const filtered = MOCK_RECIPE_TYPES.filter((x) => normalize(x).includes(q));
      const next = dedupeStrings(filtered).slice(0, maxSuggestions);

      setSuggestions(next);
      setIsOpen(true);
      setHighlightIndex(-1);
      setIsLoading(false);

      /*
      try {
        setIsLoading(true);
        const res = await fetch(`/api/recipe-types?query=${encodeURIComponent(q)}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("Failed to fetch suggestions");
        const data = await res.json(); // array of strings, e.g. ["pizza","pasta"]
        const next = dedupeStrings(data).slice(0, maxSuggestions);

        setSuggestions(next);
        setIsOpen(true);
        setHighlightIndex(-1);
      } finally {
        setIsLoading(false);
      }
      */
    }

    timerId = setTimeout(loadSuggestions, debounceMs);
    return () => clearTimeout(timerId);
  }, [query, canSuggest, debounceMs, maxSuggestions]);

  function selectSuggestion(value) {
    setQuery(value);
    setIsOpen(false);
    setHighlightIndex(-1);
  }

  function submitSearch(value) {
    const finalValue = (value ?? query).trim();
    if (!finalValue) return;

    console.log(`redirected to the page recepies?category=${finalValue}`);
    navigate(`/recepies?category=${encodeURIComponent(finalValue)}`);
  }

  function onKeyDown(e) {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === "Enter") submitSearch();
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const picked =
        highlightIndex >= 0 && highlightIndex < suggestions.length
          ? suggestions[highlightIndex]
          : null;
      if (picked) selectSuggestion(picked);
      submitSearch(picked ?? query);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setHighlightIndex(-1);
    }
  }

  return (
    <div className="recipe-search" ref={rootRef}>
      <h2 className="recipe-search__title">{title}</h2>

      <div className="recipe-search__bar">
        <div className="recipe-search__inputWrap">
          <input
            className="recipe-search__input"
            value={query}
            placeholder={placeholder}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setIsOpen(true);
            }}
            onKeyDown={onKeyDown}
            aria-autocomplete="list"
            aria-expanded={isOpen}
            aria-controls="recipe-search-listbox"
          />

          {isOpen && (
            <div className="recipe-search__dropdown" role="listbox" id="recipe-search-listbox">
              {isLoading && <div className="recipe-search__hint">Loading…</div>}

              {!isLoading && suggestions.length === 0 && (
                <div className="recipe-search__hint">No matches</div>
              )}

              {!isLoading &&
                suggestions.map((item, idx) => (
                  <button
                    type="button"
                    key={item}
                    className={
                      "recipe-search__option" +
                      (idx === highlightIndex ? " recipe-search__option--active" : "")
                    }
                    onMouseEnter={() => setHighlightIndex(idx)}
                    onMouseDown={(e) => e.preventDefault()} 
                    onClick={() => selectSuggestion(item)}
                    role="option"
                    aria-selected={idx === highlightIndex}
                  >
                    {item}
                  </button>
                ))}
            </div>
          )}
        </div>

        <button
          type="button"
          className="recipe-search__btn"
          onClick={() => submitSearch()}
          disabled={!query.trim()}
        >
          Search
        </button>
      </div>
    </div>
  );
}
