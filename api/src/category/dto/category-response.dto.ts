export class CategoryResponseDto {
  id: string;
  userId: string;
  name: string;
  icon: string | null;
  color: string | null;
  description: string | null;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}
