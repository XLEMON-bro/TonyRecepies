import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RecepieCard.module.scss";

async function addToFavouriteMockApi(recepieId, makeFavourite) {
  await new Promise((r) => setTimeout(r, 500));

  return { ok: true, status: 200, data: { recepieId, isFavourite: makeFavourite } };
}

export default function RecepieCard({ recepie, onFavouriteChanged }) {
  const navigate = useNavigate();

  const [isFavourite, setIsFavourite] = useState(!!recepie.favorite);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  function openDetails() {
    navigate(`/recepie/${recepie.id}`);
  }

  async function onStarClick(e) {
    e.stopPropagation();
    e.preventDefault();

    // ignore clicks while saving
    if (isSaving) return;

    setIsSaving(true);
    setError("");

    const nextDesired = !isFavourite; // user intention

    try {
      const res = await addToFavouriteMockApi(recepie.id, nextDesired);

      if (!isMountedRef.current) return;

      if (res.ok && res.status === 200) {
        setIsFavourite(nextDesired);
        onFavouriteChanged?.(recepie.id, nextDesired);
      } else {
        setError(`Failed to update favourite (status: ${res.status})`);
      }
    } catch (err) {
      if (!isMountedRef.current) return;

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
      aria-label={`Open recipe ${recepie.title}`}>

      <button
        type="button"
        className={styles.starButton}
        onClick={onStarClick}
        aria-pressed={isFavourite}
        aria-label={isFavourite ? "Remove from favourites" : "Add to favourites"}
        title={isFavourite ? "Favourite" : "Not favourite"}
        disabled={isSaving}
      >
        {isSaving ? <TinySpinner /> : <StarIcon filled={isFavourite} />}
      </button>

      <div className={styles.imageWrap}>
        <img
          className={styles.image}
          src={recepie.mainImageUrl}
          alt={recepie.title}
          loading="lazy"
        />
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>{recepie.title}</h3>

        <div className={styles.meta}>
          <div className={styles.row}>
            <span className={styles.label}>TIME:</span>
            <span className={styles.value}>{recepie.cookingTime}h</span>
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