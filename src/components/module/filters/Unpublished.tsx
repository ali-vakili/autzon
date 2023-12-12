import { Checkbox } from "@/components/ui/checkbox"
import { Dispatch, SetStateAction } from "react";
import { filterOptionsType } from "@/components/template/car/AllCars";


type unpublishedPropType = {
  defaultValue: boolean;
  setFilterOptions: Dispatch<SetStateAction<filterOptionsType>>
}

const Unpublished = ({ defaultValue, setFilterOptions }: unpublishedPropType) => {
  const handleUnpublishedChange = (checkValue: boolean) => {
    setFilterOptions((prevOptions) => ({
      ...prevOptions,
      unpublished: !checkValue,
    }));
  };

  return (
    <div className="items-top flex space-x-2">
      <Checkbox checked={!defaultValue} onCheckedChange={(value) => handleUnpublishedChange(!!value)}/>
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor="terms1"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Unpublished
        </label>
        <p className="text-sm text-muted-foreground">
          Cars that you have not published.
        </p>
      </div>
    </div>
  )
}

export default Unpublished