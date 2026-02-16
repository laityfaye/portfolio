import api from './axios';

/** Prix publics (sans auth) - pour affichage sur landing, inscription, etc. */
export const pricingApi = {
  getPublic: async () => {
    const response = await api.get('/public/pricing');
    return response.data;
  },
};

/** Retourne le montant et la devise du modèle "Portfolio 1 an" à partir de la liste publique */
export function getPortfolioPrice(pricingData) {
  const list = pricingData?.data ?? [];
  const model = list.find((m) => m.slug === 'portfolio_1y') || list[0];
  const amount = model?.amount ?? 2500;
  const currency = model?.currency ?? 'FCFA';
  return { amount: Number(amount), currency, formatted: `${Number(amount).toLocaleString('fr-FR')} ${currency}` };
}

/** Prix à afficher : priorité au montant fixé sur le portfolio, sinon prix du modèle (template), sinon tarif par défaut */
export function getDisplayPrice(portfolio, pricingData) {
  if (portfolio?.amount != null && Number(portfolio.amount) >= 0) {
    const amount = Number(portfolio.amount);
    const currency = portfolio.currency || 'FCFA';
    return { amount, currency, formatted: `${amount.toLocaleString('fr-FR')} ${currency}` };
  }
  const list = pricingData?.data ?? [];
  if (portfolio?.template && list.length > 0) {
    const model = list.find((m) => m.template === portfolio.template);
    if (model) {
      const amount = Number(model.amount);
      const currency = model.currency ?? 'FCFA';
      return { amount, currency, formatted: `${amount.toLocaleString('fr-FR')} ${currency}` };
    }
  }
  return getPortfolioPrice(pricingData);
}
