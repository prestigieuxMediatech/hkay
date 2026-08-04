"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProductVariantOptionsManager({ productId }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const [groupName, setGroupName] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newPrice, setNewPrice] = useState("");

  useEffect(() => {
    if (productId) loadOptions();
  }, [productId]);

  const existingGroups = useMemo(() => {
    return [...new Set(options.map((o) => o.group_name))];
  }, [options]);

  const grouped = useMemo(() => {
    const map = new Map();
    for (const opt of options) {
      if (!map.has(opt.group_name)) map.set(opt.group_name, []);
      map.get(opt.group_name).push(opt);
    }
    return map;
  }, [options]);

  async function loadOptions() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/products/${productId}/variant-options`,
        { cache: "no-store" }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load variant options");
      }

      setOptions(data.options || []);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function addValue(event) {
    event.preventDefault();
    if (!groupName.trim() || !newValue.trim()) return;

    setBusy(true);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/products/${productId}/variant-options`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            group_name: groupName.trim(),
            value: newValue.trim(),
            price: newPrice ? Number(newPrice) : null,
          }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add value");
      }

      setNewValue("");
      setNewPrice("");
      await loadOptions();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function toggleActive(option) {
    setError("");

    try {
      const response = await fetch(
        `/api/admin/products/${productId}/variant-options/${option.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_active: !option.is_active }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update value");
      }

      await loadOptions();
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  }

  async function deleteValue(optionId) {
    if (!confirm("Remove this value?")) return;
    setError("");

    try {
      const response = await fetch(
        `/api/admin/products/${productId}/variant-options/${optionId}`,
        { method: "DELETE" }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to remove value");
      }

      await loadOptions();
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  }

  async function deleteGroup(group) {
    if (!confirm(`Remove the entire "${group}" variant group and all its values?`)) return;
    setError("");

    try {
      const response = await fetch(
        `/api/admin/products/${productId}/variant-options/group?group_name=${encodeURIComponent(group)}`,
        { method: "DELETE" }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to remove group");
      }

      await loadOptions();
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  }

  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500">
        Other variants
      </h2>

      {error ? (
        <div className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {error}
        </div>
      ) : null}

      <div className="space-y-4">
        {loading ? (
          <p className="text-sm text-stone-500">Loading variants...</p>
        ) : grouped.size ? (
          [...grouped.entries()].map(([group, values]) => (
            <div key={group} className="rounded-xl border border-stone-200">
              <div className="flex items-center justify-between border-b border-stone-200 px-4 py-2">
                <p className="text-sm font-semibold text-stone-800">{group}</p>
                <button
                  type="button"
                  onClick={() => deleteGroup(group)}
                  className="text-xs text-stone-400 hover:text-rose-600"
                >
                  Remove group
                </button>
              </div>

              <div className="divide-y divide-stone-200">
                {values.map((v) => (
                  <div
                    key={v.id}
                    className="flex items-center justify-between gap-4 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-stone-800">{v.value}</p>
                      {v.price != null ? (
                        <p className="text-xs text-stone-500">
                          +₹{v.price}
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
                        onClick={() => deleteValue(v.id)}
                        className="rounded-full border border-stone-200 p-1.5 text-stone-500 hover:text-rose-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="rounded-xl border border-stone-200 p-4 text-sm text-stone-500">
            No other variants added yet. Add one below — e.g. group "Foil Color" with values Plain, Gold, Silver.
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-2">
        <div className="min-w-40 flex-1">
          <label className="mb-1 block text-xs font-medium text-stone-700">
            Variant name
          </label>
          <Input
            value={groupName}
            onChange={(event) => setGroupName(event.target.value)}
            placeholder="e.g. Foil Color"
            list="existing-variant-groups"
          />
          <datalist id="existing-variant-groups">
            {existingGroups.map((g) => (
              <option key={g} value={g} />
            ))}
          </datalist>
        </div>

        <div className="min-w-32 flex-1">
          <label className="mb-1 block text-xs font-medium text-stone-700">
            Value
          </label>
          <Input
            value={newValue}
            onChange={(event) => setNewValue(event.target.value)}
            placeholder="e.g. Gold"
          />
        </div>

        <div className="w-32">
          <label className="mb-1 block text-xs font-medium text-stone-700">
            Price adj. (optional)
          </label>
          <Input
            type="number"
            step="0.01"
            value={newPrice}
            onChange={(event) => setNewPrice(event.target.value)}
            placeholder="0"
          />
        </div>

        <Button
          type="button"
          onClick={addValue}
          disabled={busy || !groupName.trim() || !newValue.trim()}
        >
          <Plus className="mr-1 size-4" />
          Add
        </Button>
      </div>
    </div>
  );
}