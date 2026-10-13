import React, { useEffect, useMemo, useState } from "react";
import Select from "../../../components/ui/Select";
import Icon from "../../../components/AppIcon";
import { getLocations } from "../../../lib/localData";

const LocationSelector = ({ value, onChange, error }) => {
  const [loading, setLoading] = useState(false);
  const [localityOptions, setLocalityOptions] = useState([]);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let mounted = true;

    const fetchLocalities = async () => {
      try {
        setLoading(true);

        const data = (await getLocations()).map(locality => ({ locality }));

        const options =
          (data || [])
            .map((x) => String(x.locality || "").trim())
            .filter(Boolean)
            .map((loc) => ({
              value: loc,   // ✅ IMPORTANT: value = exact DB locality
              label: loc,
              description: "Dataset-backed Mumbai locality",
            })) || [];

        if (!mounted) return;
        setLocalityOptions(options);
      } catch (err) {
        if (mounted) setLoadError(err.message);
        console.error("Failed to load localities:", err);
        if (mounted) setLocalityOptions([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchLocalities();

    return () => {
      mounted = false;
    };
  }, []);

  const placeholderText = useMemo(() => {
    if (loading) return "Loading Mumbai localities...";
    return "Choose your target location";
  }, [loading]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon name="MapPin" size={20} className="text-primary" />
        <label className="text-sm font-medium text-foreground">
          Select Mumbai Location <span className="text-destructive">*</span>
        </label>
      </div>

      <Select
        options={localityOptions}
        value={value}
        onChange={onChange}
        placeholder={placeholderText}
        description="Select the Mumbai locality where you plan to open your restaurant (dataset-powered)"
        error={error || loadError}
        required
        searchable
        className="w-full"
      />

      {loading && (
        <p className="text-xs text-muted-foreground">
          Fetching localities from dataset...
        </p>
      )}
    </div>
  );
};

export default LocationSelector;
