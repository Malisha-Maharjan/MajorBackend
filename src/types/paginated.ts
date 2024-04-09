export type paginated = {
  current_page: number;
  take: number;
  next_page?: number | undefined | string;
  previous_link: string;
  next_link: string;
  data: {};
};
