import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RecepieCard.module.scss";

/**
 * Mock API call for AddToFavourite action.
 * Simulates latency and potential errors.
 */
async function addToFavouriteMockApi(recepieId, makeFavourite) {
  // simulate network latency
  await new Promise((r) => setTimeout(r, 500));

  // Uncomment to test error handling sometimes
  // if (Math.random() < 0.1) throw new Error("Failed to update favourite");

  return { recepieId, isFavourite: makeFavourite };
}

/**
 * RecepieCard (training-material style)
 *
 * Debounce strategy:
 * - UI updates instantly (optimistic)
 * - wait a short time (e.g. 350ms) to see if user clicks again
 * - send only final intended value to API
 * - rollback if API fails
 */
export default function RecepieCard({ recepie, onFavouriteChanged }) {
  const navigate = useNavigate();

  const [isFavourite, setIsFavourite] = useState(!!recepie.isFavourite);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  // Keep track of the "server confirmed" value so we can rollback correctly.
  const lastConfirmedRef = useRef(!!recepie.isFavourite);

  // Debounce timer + last desired state
  const debounceTimerRef = useRef(null);
  const pendingDesiredRef = useRef(!!recepie.isFavourite);

  // Prevent state updates if component unmounts during async call
  const isMountedRef = useRef(true);
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  function openDetails() {
    navigate(`/recepie/${recepie.id}`);
  }

  function onStarClick(e) {
    e.stopPropagation();
    e.preventDefault();

    // Optimistic toggle (instant feedback)
    const next = !pendingDesiredRef.current;
    pendingDesiredRef.current = next;

    setIsFavourite(next);
    setError("");

    // Debounce: clear old timer and schedule a new request
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(() => {
      // Send only the final intended value
      void persistFavourite(pendingDesiredRef.current);
    }, 350);
  }

  async function persistFavourite(finalDesiredValue) {
    // If the user already sees the final value, we just persist it now
    setIsSaving(true);

    try {
      const res = await addToFavouriteMockApi(recepie.id, finalDesiredValue);

      if (!isMountedRef.current) return;

      // Confirm with server response
      lastConfirmedRef.current = res.isFavourite;
      pendingDesiredRef.current = res.isFavourite;

      setIsFavourite(res.isFavourite);
      onFavouriteChanged?.(recepie.id, res.isFavourite);
    } catch (err) {
      if (!isMountedRef.current) return;

      // Rollback to last confirmed state
      pendingDesiredRef.current = lastConfirmedRef.current;
      setIsFavourite(lastConfirmedRef.current);
      setError(err?.message ?? "AddToFavourite failed");
    } finally {
      if (!isMountedRef.current) return;
      setIsSaving(false);
    }
  }

  return (
    <article
      className={styles.card}
      role="button"
      tabIndex={0}
      onClick={openDetails}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") openDetails();
      }}
      aria-label={`Open recipe ${recepie.name}`}
    >
      {/* Star button (top-right) */}
      <button
        type="button"
        className={styles.starButton}
        onClick={onStarClick}
        aria-pressed={isFavourite}
        aria-label={isFavourite ? "Remove from favourites" : "Add to favourites"}
        title={isFavourite ? "Favourite" : "Not favourite"}
      >
        {/* Show spinner while saving, otherwise show star */}
        {isSaving ? <TinySpinner /> : <StarIcon filled={isFavourite} />}
      </button>

      {/* Image takes ~1/3 */}
      <div className={styles.imageWrap}>
        <img
          className={styles.image}
          src={recepie.imgUrl}
          alt={recepie.name}
          loading="lazy"
        />
      </div>

      {/* Details */}
      <div className={styles.body}>
        <div className={styles.divider} />

        <h3 className={styles.name}>{recepie.name}</h3>

        <div className={styles.meta}>
          <div className={styles.row}>
            <span className={styles.label}>TIME:</span>
            <span className={styles.value}>{recepie.timeToCook}</span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>DIFFICULTY:</span>
            <span className={styles.value}>{recepie.difficulty}</span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>SERVINGS:</span>
            <span className={styles.value}>{recepie.servings}</span>
          </div>
        </div>

        {error && <p className={styles.error}>{error}</p>}
      </div>
    </article>
  );
}

function StarIcon({ filled }) {
  return (
    <svg width="42" height="42" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 17.3l-6.18 3.73 1.64-7.03L2 9.24l7.19-.61L12 2l2.81 6.63 7.19.61-5.46 4.76 1.64 7.03L12 17.3z"
        fill={filled ? "#f5c518" : "white"}
        stroke="#111"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function TinySpinner() {
  return <span className={styles.spinner} aria-label="Saving" />;
}
