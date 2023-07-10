/**
 *
 * @param page
 * @param perPage
 * @param total
 *
 * @returns
 */
 const paginate = (page: number = 1, perPage: number = 25, total: number): { next: number | null; current: number; prev: number | null } => {
  const sumOfPages = Math.ceil(total / perPage);
  return {
    current: page || 1,
    prev: page > 1 ? page - 1 : null,
    next: page < sumOfPages ? page + 1 : null
  };
}

export { paginate }
