import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select"
import { Dispatch, SetStateAction } from "react";


type colorPropType = {
  colors: {
    id: number;
    color_name: string;
    color_code: string;
  }[]
  defaultValue: string;
  setFilterOptions: Dispatch<SetStateAction<any>>
}


const Color = ({ colors, setFilterOptions, defaultValue } : colorPropType) => {
  const handleColorChange = (selectedYearId: string) => {
    setFilterOptions((prevOptions: any) => ({
      ...prevOptions,
      color_id: selectedYearId,
    }));
  };

  return (
    <div className="space-y-2">
      <Label>Color</Label>
      <Select defaultValue={defaultValue} value={defaultValue} onValueChange={(selectedYearId) => handleColorChange(selectedYearId)}>
        <SelectTrigger className="h-9">
          <SelectValue placeholder="Select a color" />
        </SelectTrigger>
        <SelectContent className="h-40">
        {colors.map(color => (
          <SelectItem key={color.id} value={`${color.id}`}><div className="inline-block h-4 w-4 rounded-full me-2 border border-muted align-middle" style={{backgroundColor: `${color.color_code}`}}></div>{color.color_name}</SelectItem>
        ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default Color