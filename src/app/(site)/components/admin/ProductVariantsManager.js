"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const STANDARD_STRAP_SIZES = [
  { variant_label: "18mm", variant_type: "straight" },
  { variant_label: "19mm", variant_type: "straight" },
  { variant_label: "20mm", variant_type: "straight" },
  { variant_label: "21mm", variant_type: "straight" },
  { variant_label: "22mm", variant_type: "straight" },
  { variant_label: "23mm", variant_type: "straight" },
  { variant_label: "24mm", variant_type: "straight" },
  { variant_label: "18/16mm", variant_type: "tapered" },
  { variant_label: "19/16mm", variant_type: "tapered" },
  { variant_label: "20/16mm", variant_type: "tapered" },
  { variant_label: "20/18mm", variant_type: "tapered" },
  { variant_label: "21/18mm", variant_type: "tapered" },
  { variant_label: "22/18mm", variant_type: "tapered" },
  { variant_label: "22/20mm", variant_type: "tapered" },
  { variant_label: "23/20mm", variant_type: "tapered" },
  { variant_label: "24/20mm", variant_type: "tapered" },
  { variant_label: "24/22mm", variant_type: "tapered" },
];

export default function ProductVariantsManager({ productId }) {
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const [newLabel, setNewLabel] = useState("");
  const [newType, setNewType] = useState("straight");
  const [newPrice, setNewPrice] = useState("");

  useEffect(() => {
    if (productId) loadVariants();
  }, [productId]);

  async function loadVariants() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/products/${productId}/variants`,
        { cache: "no-store" }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load variants");
      }

      setVariants(data.variants || []);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function loadStandardSizes() {
    setBusy(true);
    setError("");

    const existingLabels = new Set(variants.map((v) => v.variant_label));
    const toAdd = STANDARD_STRAP_SIZES.filter(
      (s) => !existingLabels.has(s.variant_label)
    );

    if (!toAdd.length) {
      setError("All standard sizes are already added.");
      setBusy(false);
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/products/${productId}/variants`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ variants: toAdd }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add standard sizes");
      }

      await loadVariants();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function addCustomVariant(event) {
    event.preventDefault();
    if (!newLabel.trim()) return;

    setBusy(true);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/products/${productId}/variants`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            variant_label: newLabel.trim(),
            variant_type: newType,
            price: newPrice ? Number(newPrice) : null,
          }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add size");
      }

      setNewLabel("");
      setNewPrice("");
      await loadVariants();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function toggleActive(variant) {
    setError("");

    try {
      const response = await fetch(
        `/api/admin/products/${productId}/variants/${variant.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_active: !variant.is_active }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update size");
      }

      await loadVariants();
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  }

  async function deleteVariant(variantId) {
    if (!confirm("Remove this size?")) return;
    setError("");

    try {
      const response = await fetch(
        `/api/admin/products/${productId}/variants/${variantId}`,
        { method: "DELETE" }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to remove size");
      }

      await loadVariants();
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
          Size variants
        </h2>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={loadStandardSizes}
          disabled={busy}
        >
          Load standard strap sizes
        </Button>
      </div>

      {error ? (
        <div className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {error}
        </div>
      ) : null}

      <div className="rounded-xl border border-stone-200">
        {loading ? (
          <p className="p-4 text-sm text-stone-500">Loading sizes...</p>
        ) : variants.length ? (
          <div className="divide-y divide-stone-200">
            {variants.map((v) => (
              <div
                key={v.id}
                className="flex items-center justify-between gap-4 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-stone-800">
                    {v.variant_label}{" "}
                    <span className="text-xs font-normal text-stone-400">
                      ({v.variant_type})
                    </span>
                  </p>
                  {v.price != null ? (
                    <p className="text-xs text-stone-500">
                      ₹{v.price} (overrides base price)
                    </p>
                  ) : null}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleActive(v)}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      v.is_active
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-stone-100 text-stone-500"
                    }`}
                  >
                    {v.is_active ? "Active" : "Hidden"}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteVariant(v.id)}
                    className="rounded-full border border-stone-200 p-1.5 text-stone-500 hover:text-rose-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="p-4 text-sm text-stone-500">
            No sizes added yet. Use “Load standard strap sizes” or add one
            below.
          </p>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-end gap-2">
        <div className="flex-1 min-w-[120px]">
          <label className="mb-1 block text-xs font-medium text-stone-700">
            Size label
          </label>
          <Input
            value={newLabel}
            onChange={(event) => setNewLabel(event.target.value)}
            placeholder="e.g. 20mm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-stone-700">
            Type
          </label>
          <select
            value={newType}
            onChange={(event) => setNewType(event.target.value)}
            className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-stone-400"
          >
            <option value="straight">Straight</option>
            <option value="tapered">Tapered</option>
          </select>
        </div>

        <div className="w-32">
          <label className="mb-1 block text-xs font-medium text-stone-700">
            Price (optional)
          </label>
          <Input
            type="number"
            step="0.01"
            value={newPrice}
            onChange={(event) => setNewPrice(event.target.value)}
            placeholder="Same as base"
          />
        </div>

        <Button
          type="button"
          onClick={addCustomVariant}
          disabled={busy || !newLabel.trim()}
        >
          <Plus className="mr-1 size-4" />
          Add
        </Button>
      </div>
    </div>
  );
}