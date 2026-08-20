const API_URL = import.meta.env.VITE_API_URL;
const MOCK_USER_EMAIL = import.meta.env.VITE_MOCK_USER_EMAIL;

const buildHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (MOCK_USER_EMAIL) {
    headers["X-Mock-User"] = MOCK_USER_EMAIL;
  }

  return headers;
};

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getCurrentWeekRange = (): { from: string; to: string } => {
  const today = new Date();
  const day = today.getDay();
  const diff = day === 0 ? 6 : day - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - diff);

  return {
    from: formatDate(monday),
    to: formatDate(today),
  };
};

export type ApplicationRequestStat = {
  applicationId: number
  applicationName: string
  count: number
  percentage: number
};

export type RequestsByApplicationResponse = {
  from: string;
  to: string;
  total: number;
  entries: ApplicationRequestStat[];
};

export type WeeklyRequestStat = {
  weekNumber: number
  year: number
  weekStart: string
  count: number
  slaReachedCount: number
};

export type WeeklyRequestsResponse = {
  from: string;
  to: string;
  entries: WeeklyRequestStat[];
};

const getLastEightWeeksRange = (): { from: string; to: string } => {
  const today = new Date();
  const day = today.getDay();
  const diff = day === 0 ? 6 : day - 1;
  const currentMonday = new Date(today);
  currentMonday.setDate(today.getDate() - diff);

  const startDate = new Date(currentMonday);
  startDate.setDate(currentMonday.getDate() - 56); // 8 weeks before current week

  const endDate = new Date(currentMonday);
  endDate.setDate(currentMonday.getDate() - 1); // end of last week

  return {
    from: formatDate(startDate),
    to: formatDate(endDate),
  };
};

const getLast30DaysRange = (): { from: string; to: string } => {
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  return {
    from: formatDate(thirtyDaysAgo),
    to: formatDate(today),
  };
};

export type MeanResolutionTimeResponse = {
  meanTime: number;
};

export type SlaComplianceResponse = {
  from: string;
  to: string;
  entries: unknown[];
  averageComplianceRate: number;
};

export type LastTwoWeeksEntry = {
  weekNumber: number
  year: number
  weekStart: string
  count: number
  slaRate: number
}

export type LastTwoWeeksResponse = {
  from: string;
  to: string;
  entries: LastTwoWeeksEntry[];
  slaRateEvolution: number;
  ticketCountEvolution: number;
};

export const reportService = {
  getRequestsByApplication: async (from?: string, to?: string): Promise<ApplicationRequestStat[]> => {
    const { from: defaultFrom, to: defaultTo } = getCurrentWeekRange();

    const params = new URLSearchParams();
    params.set("from", from ?? defaultFrom);
    params.set("to", to ?? defaultTo);

    const queryString = params.toString();
    const url = `${API_URL}/rapports/requests-by-application?${queryString}`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: buildHeaders(),
    });

    if (!response.ok) {
      throw new Error("REQUESTS_BY_APPLICATION_FETCH_FAILED");
    }

    const data: RequestsByApplicationResponse = await response.json();
    return data.entries;
  },

  getWeeklyRequests: async (from?: string, to?: string): Promise<WeeklyRequestStat[]> => {
    const { from: defaultFrom, to: defaultTo } = getLastEightWeeksRange();

    const params = new URLSearchParams();
    params.set("from", from ?? defaultFrom);
    params.set("to", to ?? defaultTo);

    const queryString = params.toString();
    const url = `${API_URL}/rapports/weekly-requests?${queryString}`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: buildHeaders(),
    });

    if (!response.ok) {
      throw new Error("WEEKLY_REQUESTS_FETCH_FAILED");
    }

    const data: WeeklyRequestsResponse = await response.json();
    return data.entries;
  },

  getMeanResolutionTime: async (from?: string, to?: string): Promise<number> => {
    const { from: defaultFrom, to: defaultTo } = getLast30DaysRange();

    const params = new URLSearchParams();
    params.set("from", from ?? defaultFrom);
    params.set("to", to ?? defaultTo);

    const queryString = params.toString();
    const url = `${API_URL}/rapports/mean-resolution-time?${queryString}`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: buildHeaders(),
    });

    if (!response.ok) {
      throw new Error("MEAN_RESOLUTION_TIME_FETCH_FAILED");
    }

    const data: MeanResolutionTimeResponse = await response.json();
    return data.meanTime;
  },

  getSlaCompliance: async (from?: string, to?: string, idClasseService?: number): Promise<number> => {
    const { from: defaultFrom, to: defaultTo } = getCurrentWeekRange();

    const params = new URLSearchParams();
    params.set("from", from ?? defaultFrom);
    params.set("to", to ?? defaultTo);

    if (idClasseService !== undefined && idClasseService !== null) {
      params.set("idClasseService", String(idClasseService));
    }

    const queryString = params.toString();
    const url = `${API_URL}/rapports/sla-compliance?${queryString}`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: buildHeaders(),
    });

    if (!response.ok) {
      throw new Error("SLA_COMPLIANCE_FETCH_FAILED");
    }

    const data: SlaComplianceResponse = await response.json();
    return data.averageComplianceRate;
  },

  getLastTwoWeeks: async (): Promise<LastTwoWeeksResponse> => {
    const url = `${API_URL}/rapports/last-two-weeks`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: buildHeaders(),
    });

    if (!response.ok) {
      throw new Error("LAST_TWO_WEEKS_FETCH_FAILED");
    }

    return response.json();
  },
};
