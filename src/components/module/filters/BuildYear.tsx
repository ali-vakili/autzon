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


type buildYearPropType = {
  buildYears: {
    id: number;
    year: string;
  }[],
  defaultValue: string;
  setFilterOptions: Dispatch<SetStateAction<filterOptionsType>>
}


const BuildYear = ({ buildYears, setFilterOptions, defaultValue } : buildYearPropType) => {
  const handleBuildYearChange = (selectedYearId: string) => {
    setFilterOptions((prevOptions) => ({
      ...prevOptions,
      buildYearId: selectedYearId,
    }));
  };

  return (
    <div className="space-y-2">
      <Label>Build Year</Label>
      <Select defaultValue={defaultValue} value={defaultValue} onValueChange={(selectedYearId) => handleBuildYearChange(selectedYearId)}>
        <SelectTrigger className="h-9">
          <SelectValue placeholder="Select the car build year" />
        </SelectTrigger>
        <SelectContent className="h-40">
          {buildYears.map(buildYear => (
            <SelectItem key={buildYear.id} value={`${buildYear.id}`}>{buildYear.year}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default BuildYear