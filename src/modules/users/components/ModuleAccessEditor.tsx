import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Info, Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useEffectiveAccess } from '../users.hooks';
import type { ModuleInput, ModuleState, PermissionState } from '../users.types';

interface ModuleAccessEditorProps {
  userId: string | undefined;
  onChange: (modules: ModuleInput[]) => void;
  disabled?: boolean;
}

type EditorState = Map<string, Set<string>>;

export function ModuleAccessEditor({
  userId,
  onChange,
  disabled = false,
}: ModuleAccessEditorProps) {
  const { data, isLoading, isError } = useEffectiveAccess(userId);

  const [state, setState] = useState<EditorState>(new Map());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!data) return;
    const map: EditorState = new Map();
    for (const mod of data.modules) {
      const perms = new Set<string>();
      for (const p of mod.permissions) {
        if (p.effective) perms.add(p.code);
      }
      if (perms.size > 0) {
        map.set(mod.moduleCode, perms);
      }
    }
    setState(map);
  }, [data]);

  useEffect(() => {
    if (!data) return;
    const modules: ModuleInput[] = [];
    for (const [moduleCode, perms] of state.entries()) {
      if (perms.size > 0) {
        modules.push({
          moduleCode,
          permissions: Array.from(perms),
        });
      }
    }
    const isSameAsDefault = isEqualWithDefault(modules, data.modules);
    onChange(isSameAsDefault ? [] : modules);
  }, [state, data, onChange]);

  const filteredModules = useMemo(() => {
    if (!data) return [];
    if (!search.trim()) return data.modules;
    const q = search.toLowerCase();
    return data.modules.filter(
      (m) =>
        m.moduleCode.toLowerCase().includes(q) ||
        m.moduleName.toLowerCase().includes(q) ||
        (m.moduleGroup ?? '').toLowerCase().includes(q),
    );
  }, [data, search]);

  const groupedModules = useMemo(() => {
    const groups = new Map<string, ModuleState[]>();
    for (const mod of filteredModules) {
      const key = mod.moduleGroup ?? 'Lainnya';
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(mod);
    }
    return Array.from(groups.entries());
  }, [filteredModules]);

  function toggleModule(mod: ModuleState) {
    if (disabled) return;
    setState((prev) => {
      const next = new Map(prev);
      const current = next.get(mod.moduleCode);
      if (current && current.size > 0) {
        next.delete(mod.moduleCode);
      } else {
        next.set(mod.moduleCode, new Set(mod.permissions.map((p) => p.code)));
      }
      return next;
    });
  }

  function togglePermission(mod: ModuleState, perm: PermissionState) {
    if (disabled) return;
    setState((prev) => {
      const next = new Map(prev);
      const current = new Set(next.get(mod.moduleCode) ?? []);
      if (current.has(perm.code)) {
        current.delete(perm.code);
      } else {
        current.add(perm.code);
      }
      if (current.size > 0) {
        next.set(mod.moduleCode, current);
      } else {
        next.delete(mod.moduleCode);
      }
      return next;
    });
  }

  function toggleExpand(code: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  }

  function expandAll() {
    setExpanded(new Set(filteredModules.map((m) => m.moduleCode)));
  }

  function collapseAll() {
    setExpanded(new Set());
  }

  if (!userId) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <div className="flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">Module access akan mengikuti role default.</p>
            <p className="mt-1 text-xs text-amber-700">
              Simpan user dulu, lalu edit untuk menyesuaikan module access secara spesifik.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-slate-500">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        <span className="text-sm">Memuat module access…</span>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        Gagal memuat module access.
      </div>
    );
  }

  if (data.isSuperAdmin) {
    return (
      <div className="rounded-lg border border-primary-200 bg-primary-50 px-4 py-3 text-sm text-primary-800">
        <div className="flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">Super Admin — akses penuh</p>
            <p className="mt-1 text-xs text-primary-700">
              User ini punya akses ke semua modul dan permission secara otomatis.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const totalModules = data.modules.length;
  const selectedModules = state.size;
  const overriddenCount = data.modules.filter((m) => m.overridden).length;

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span>
            Role:{' '}
            <span className="font-medium text-slate-800">
              {data.roles.join(', ') || '—'}
            </span>
          </span>
          <span>
            Modul dipilih:{' '}
            <span className="font-medium text-slate-800">
              {selectedModules} / {totalModules}
            </span>
          </span>
          {overriddenCount > 0 && (
            <span className="text-amber-600">
              <span className="font-medium">{overriddenCount}</span> override dari role
            </span>
          )}
        </div>
        <p className="mt-2 text-slate-500">
          Centang modul dan permission yang ingin diberikan. Kalau tidak diubah, user pakai default role.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari modul…"
          disabled={disabled}
          className="flex-1 min-w-[200px] rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
        />
        <button
          type="button"
          onClick={expandAll}
          disabled={disabled}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          Buka semua
        </button>
        <button
          type="button"
          onClick={collapseAll}
          disabled={disabled}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          Tutup semua
        </button>
      </div>

      <div className="max-h-96 space-y-2 overflow-y-auto rounded-lg border border-slate-200 bg-white p-2">
        {groupedModules.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-400">
            Tidak ada modul yang cocok.
          </p>
        )}

        {groupedModules.map(([groupLabel, modules]) => (
          <div key={groupLabel} className="space-y-1">
            <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              {groupLabel}
            </p>

            {modules.map((mod) => {
              const isChecked = state.has(mod.moduleCode);
              const isExpanded = expanded.has(mod.moduleCode);
              const permCount = state.get(mod.moduleCode)?.size ?? 0;

              return (
                <div
                  key={mod.moduleCode}
                  className={cn(
                    'rounded-md border transition',
                    isChecked
                      ? 'border-primary-200 bg-primary-50/50'
                      : 'border-slate-200 bg-white',
                  )}
                >
                  <div className="flex items-center gap-2 p-2">
                    <button
                      type="button"
                      onClick={() => toggleExpand(mod.moduleCode)}
                      className="grid h-6 w-6 shrink-0 place-items-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      aria-label={isExpanded ? 'Tutup' : 'Buka'}
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5" />
                      )}
                    </button>

                    <label className="flex flex-1 cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleModule(mod)}
                        disabled={disabled}
                        className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-2 focus:ring-primary-500"
                      />
                      <span className="text-sm font-medium text-slate-800">
                        {mod.moduleName}
                      </span>
                      <span className="text-xs text-slate-400">
                        ({mod.moduleCode})
                      </span>
                      {permCount > 0 && (
                        <span className="ml-auto rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-medium text-primary-700">
                          {permCount} perm
                        </span>
                      )}
                    </label>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-slate-100 px-3 py-2">
                      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                        {mod.permissions.map((perm) => (
                          <label
                            key={perm.permissionId}
                            className="flex cursor-pointer items-center gap-1.5 text-xs text-slate-600"
                          >
                            <input
                              type="checkbox"
                              checked={state.get(mod.moduleCode)?.has(perm.code) ?? false}
                              onChange={() => togglePermission(mod, perm)}
                              disabled={disabled}
                              className="h-3.5 w-3.5 rounded border-slate-300 text-primary-600 focus:ring-2 focus:ring-primary-500"
                            />
                            <span>{perm.name}</span>
                            {perm.override === 'grant' && (
                              <span className="text-[10px] text-emerald-600">+override</span>
                            )}
                            {perm.override === 'deny' && (
                              <span className="text-[10px] text-red-600">-override</span>
                            )}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function isEqualWithDefault(
  modules: ModuleInput[],
  serverModules: ModuleState[],
): boolean {
  const defaultMap = new Map<string, Set<string>>();
  for (const mod of serverModules) {
    const perms = new Set<string>();
    for (const p of mod.permissions) {
      if (p.effective) perms.add(p.code);
    }
    if (perms.size > 0) {
      defaultMap.set(mod.moduleCode, perms);
    }
  }
  if (modules.length !== defaultMap.size) return false;
  for (const mod of modules) {
    const def = defaultMap.get(mod.moduleCode);
    if (!def) return false;
    if (def.size !== mod.permissions.length) return false;
    for (const p of mod.permissions) {
      if (!def.has(p)) return false;
    }
  }
  return true;
}