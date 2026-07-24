import { useQuery } from 'react-query';
import {
	adminGetCivicJurisdictionTotals,
	adminListCivicObligations,
	adminListCivicPayments,
	adminListJurisdictionWallets
} from '../apiRoutes';

/**
 * Civic-Tax admin visibility (2026-07-24) — Admin Web App items 19-22.
 * jurisdictionKeyPrefix format is COUNTRY_STATE_LGA.
 */
export function useAdminJurisdictionWallets(jurisdictionKeyPrefix) {
	return useQuery(
		['admin_jurisdiction_wallets', jurisdictionKeyPrefix],
		() => adminListJurisdictionWallets(jurisdictionKeyPrefix),
		{ staleTime: 15000 }
	);
}

export function useAdminCivicObligations({ country, state, lga, status, page = 1, limit = 20 } = {}) {
	return useQuery(
		['admin_civic_obligations', { country, state, lga, status, page, limit }],
		() => adminListCivicObligations({ country, state, lga, status, page, limit }),
		{ keepPreviousData: true, staleTime: 15000 }
	);
}

export function useAdminCivicPayments({ country, state, lga, page = 1, limit = 20 } = {}) {
	return useQuery(
		['admin_civic_payments', { country, state, lga, page, limit }],
		() => adminListCivicPayments({ country, state, lga, page, limit }),
		{ keepPreviousData: true, staleTime: 15000 }
	);
}

export function useAdminCivicJurisdictionTotals({ country, state, lga } = {}) {
	return useQuery(
		['admin_civic_jurisdiction_totals', { country, state, lga }],
		() => adminGetCivicJurisdictionTotals({ country, state, lga }),
		{ staleTime: 15000 }
	);
}
