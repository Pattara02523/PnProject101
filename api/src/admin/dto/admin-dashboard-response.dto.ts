export class AdminDashboardResponseDto {
  users: {
    total: number;
    active: number;
    suspended: number;
  };
  portfolios: {
    total: number;
  };
  investments: {
    total: number;
    active: number;
    sold: number;
  };
  transactions: {
    total: number;
  };
  announcements: {
    total: number;
    published: number;
  };
}
