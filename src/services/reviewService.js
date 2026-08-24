// ============================================================
// Review Service — CRUD with localStorage
// Connected to Admin Dashboard for moderation
// ============================================================

const REVIEWS_KEY = 'starving_reviews';

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]');
  } catch {
    return [];
  }
};

const save = (reviews) => {
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
  window.dispatchEvent(new CustomEvent('starving:reviews_updated'));
};

export const reviewService = {
  getAll: () => [...load()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),

  getApproved: () => load()
    .filter(r => r.status === 'approved')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),

  getPending: () => load().filter(r => r.status === 'pending'),

  getStats: () => {
    const all = load();
    const approved = all.filter(r => r.status === 'approved');
    const totalRating = approved.reduce((sum, r) => sum + r.rating, 0);
    return {
      total: all.length,
      approved: approved.length,
      pending: all.filter(r => r.status === 'pending').length,
      rejected: all.filter(r => r.status === 'rejected').length,
      avgRating: approved.length > 0 ? (totalRating / approved.length).toFixed(1) : '0.0',
    };
  },

  submit: (reviewData) => {
    const reviews = load();
    const review = {
      id: `REV-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      ...reviewData,
      status: 'pending', // pending, approved, rejected
      createdAt: new Date().toISOString(),
    };
    reviews.unshift(review);
    save(reviews);
    window.dispatchEvent(new CustomEvent('starving:new_review', { detail: review }));

    // BroadcastChannel for cross-tab
    try {
      if ('BroadcastChannel' in window) {
        const ch = new BroadcastChannel('starving_reviews_channel');
        ch.postMessage({ type: 'NEW_REVIEW', review });
        ch.close();
      }
    } catch { /* ignore */ }

    return review;
  },

  approve: (id) => {
    const reviews = load();
    const idx = reviews.findIndex(r => r.id === id);
    if (idx === -1) return null;
    reviews[idx].status = 'approved';
    reviews[idx].reviewedAt = new Date().toISOString();
    save(reviews);
    return reviews[idx];
  },

  reject: (id) => {
    const reviews = load();
    const idx = reviews.findIndex(r => r.id === id);
    if (idx === -1) return null;
    reviews[idx].status = 'rejected';
    reviews[idx].reviewedAt = new Date().toISOString();
    save(reviews);
    return reviews[idx];
  },

  delete: (id) => {
    const reviews = load().filter(r => r.id !== id);
    save(reviews);
    return true;
  },

  // Toggle featured
  toggleFeatured: (id) => {
    const reviews = load();
    const idx = reviews.findIndex(r => r.id === id);
    if (idx === -1) return null;
    reviews[idx].isFeatured = !reviews[idx].isFeatured;
    save(reviews);
    return reviews[idx];
  },

  getFeatured: () => load()
    .filter(r => r.status === 'approved' && r.isFeatured)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
};
