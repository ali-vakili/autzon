export type generalCarsFilter = {
  buildYearId: string;
  model_id: string;
  category_id: string;
  fuel_type_id: string;
  care_seats_id: string;
}

export type agentFilterOptionsType = {
  published: boolean,
  unpublished: boolean,
  color_id: string;
} & generalCarsFilter

export type rentalCarsFilterOptionsType = generalCarsFilter;

export type saleCarsFilterOptionsType = {
  color_id: string;
} & generalCarsFilter;

export type totalFilterOptions = agentFilterOptionsType & rentalCarsFilterOptionsType & saleCarsFilterOptionsType