import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select"
import { Dispatch, SetStateAction } from "react";


type fuelTypePropType = {
  fuelTypes: {
    id: number;
    type: string;
  }[],
  defaultValue: string;
  setFilterOptions: Dispatch<SetStateAction<any>>
}


const FuelType = ({ fuelTypes, setFilterOptions, defaultValue } : fuelTypePropType) => {
  const handleFuelTypeChange = (selectedYearId: string) => {
    setFilterOptions((prevOptions: any) => ({
      ...prevOptions,
      fuel_type_id: selectedYearId,
    }));
  };
  return (
    <div className="space-y-2">
      <Label>Fuel Type</Label>
      <Select defaultValue={defaultValue} value={defaultValue} onValueChange={(selectedYearId) => handleFuelTypeChange(selectedYearId)}>
        <SelectTrigger className="h-9">
          <SelectValue placeholder="Select a fuel type" />
        </SelectTrigger>
        <SelectContent className="h-40">
        {fuelTypes.map(fuelType => (
          <SelectItem key={fuelType.id} value={`${fuelType.id}`}>{fuelType.type}</SelectItem>
        ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default FuelType