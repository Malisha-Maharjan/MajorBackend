export type ApiResponse<T> =
  | {
      status: "error";
      error: {
        [x: string]: string[] | undefined;
      };
    }
  | {
      status: "success";
      data?: T | undefined;
    };
