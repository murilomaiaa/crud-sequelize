/* eslint-disable prettier/prettier */
type FilterUserDTO =
  | number
  | {
    email?: string;
    name?: string;
    birthday?: Date;
    city?: string;
    state?: string;
  }

export default FilterUserDTO;
