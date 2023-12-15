import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select"
import { Dispatch, SetStateAction } from "react";


type seatsPropType = {
  carSeats: {
    id: number;
    seats: string;
    seats_count: string;
  }[],
  defaultValue: string;
  setFilterOptions: Dispatch<SetStateAction<any>>
}


const Seats = ({ carSeats, setFilterOptions, defaultValue } : seatsPropType) => {
  const handleSeatsChange = (selectedYearId: string) => {
    setFilterOptions((prevOptions: any) => ({
      ...prevOptions,
      care_seats_id: selectedYearId,
    }));
  };

  return (
    <div className="space-y-2">
      <Label>Seats</Label>
      <Select defaultValue={defaultValue} value={defaultValue} onValueChange={(selectedYearId) => handleSeatsChange(selectedYearId)}>
        <SelectTrigger className="h-9">
          <SelectValue placeholder="Select a car seats" />
        </SelectTrigger>
        <SelectContent className="h-40">
        {carSeats.map(seat => (
          <SelectItem key={seat.id} value={`${seat.id}`}>{seat.seats}</SelectItem>
        ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default Seats