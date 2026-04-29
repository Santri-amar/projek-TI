export function extractList(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    // Handle API format: { success: true, message: "...", data: [...] }
    if (payload.success === true && Array.isArray(payload.data)) {
      return payload.data;
    }

    const value = payload;

    if (Array.isArray(value.data)) {
      return value.data;
    }

    if (value.data && typeof value.data === "object") {
      const nested = value.data;

      if (Array.isArray(nested.items)) {
        return nested.items;
      }

      if (Array.isArray(nested.rows)) {
        return nested.rows;
      }
    }
  }

  return [];
}

export function extractData(payload) {
  if (payload && typeof payload === "object") {
    if (payload.success === true && payload.data !== undefined) {
      return payload.data;
    }
    return payload;
  }
  return null;
}

export function formatNumber(value) {
  return new Intl.NumberFormat("id-ID").format(value);
}

export function formatPercent(value) {
  return `${Math.max(0, Math.min(100, Math.round(value)))}%`;
}

export function formatRelativeTime(dateInput) {
  if (!dateInput) {
    return "Baru saja";
  }

  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) {
    return "Baru saja";
  }

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return "Baru saja";
  if (diffMinutes < 60) return `${diffMinutes} menit lalu`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} jam lalu`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays} hari lalu`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths} bulan lalu`;

  const diffYears = Math.floor(diffMonths / 12);
  return `${diffYears} tahun lalu`;
}

export function sortByDateDesc(items, getter) {
  return [...items].sort((a, b) => {
    const aTime = new Date(getter(a) || 0).getTime();
    const bTime = new Date(getter(b) || 0).getTime();
    return bTime - aTime;
  });
}
