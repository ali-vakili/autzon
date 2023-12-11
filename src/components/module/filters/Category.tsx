import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select"
import { Dispatch, SetStateAction } from "react";
import { filterOptionsType } from "@/components/template/car/AllCars";


type categoryPropType = {
  categories: {
    id: number;
    category: string;
    abbreviation: string | null;
  }[]
  defaultValue: string;
  setFilterOptions: Dispatch<SetStateAction<filterOptionsType>>
}


const Category = ({ categories, setFilterOptions, defaultValue } : categoryPropType) => {
  const handleCategoryChange = (selectedYearId: string) => {
    setFilterOptions((prevOptions) => ({
      ...prevOptions,
      category_id: selectedYearId,
    }));
  };

  return (
    <div className="space-y-2">
      <Label>Category</Label>
      <Select defaultValue={defaultValue} value={defaultValue} onValueChange={(selectedYearId) => handleCategoryChange(selectedYearId)}>
        <SelectTrigger className="h-9">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent className="h-40">
        {categories.map(category => (
          <SelectItem key={category.id} value={`${category.id}`}>
            {category.category}&nbsp;
            {category.abbreviation && (
              <p className="text-gray-400 inline">
                - {category.abbreviation}
              </p>
            )}
          </SelectItem>
        ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default Category