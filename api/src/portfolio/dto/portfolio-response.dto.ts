export class PortfolioResponseDto {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  isFavorite: boolean;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    investments: number;
  };
}
