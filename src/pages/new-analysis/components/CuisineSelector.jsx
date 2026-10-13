import React, { useEffect, useMemo, useState } from "react";
import Select from "../../../components/ui/Select";
import Icon from "../../../components/AppIcon";
import { getCuisines } from "../../../lib/localData";

const CuisineSelector = ({ value, onChange, error }) => {
  const [loading, setLoading] = useState(false);
  const [cuisineOptions, setCuisineOptions] = useState([]);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let mounted = true;

    const fetchCuisines = async () => {
      try {
        setLoading(true);

        // ✅ Pull cuisines from computed stats table (best source of truth)
        const data = (await getCuisines()).map(category => ({ category }));

        // Unique categories
        const unique = Array.from(
          new Set((data || []).map((x) => String(x.category || "").trim()).filter(Boolean))
        );

        const options = unique.map((c) => ({
          value: c,      // ✅ IMPORTANT: exact DB category
          label: c,
          description: "Dataset-backed cuisine category",
        }));

        if (!mounted) return;
        setCuisineOptions(options);
      } catch (err) {
        if (mounted) setLoadError(err.message);
        console.error("Failed to load cuisines:", err);
        if (mounted) setCuisineOptions([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchCuisines();

    return () => {
      mounted = false;
    };
  }, []);

  const placeholderText = useMemo(() => {
    if (loading) return "Loading cuisine types...";
    return "Choose your cuisine specialty";
  }, [loading]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon name="ChefHat" size={20} className="text-primary" />
        <label className="text-sm font-medium text-foreground">
          Cuisine Type <span className="text-destructive">*</span>
        </label>
      </div>

      <Select
        options={cuisineOptions}
        value={value}
        onChange={onChange}
        placeholder={placeholderText}
        description="Select the primary cuisine type for your restaurant (dataset-powered)"
        error={error || loadError}
        required
        searchable
        className="w-full"
      />

      {loading && (
        <p className="text-xs text-muted-foreground">
          Fetching cuisine types from dataset...
        </p>
      )}
    </div>
  );
};

export default CuisineSelector;
