import { Checkbox } from "@/components/ui/checkbox"

const Published = () => {
  return (
    <div className="items-top flex space-x-2">
      <Checkbox id="terms1" />
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor="terms1"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Published
        </label>
        <p className="text-sm text-muted-foreground">
          Cars that you have published.
        </p>
      </div>
    </div>
  )
}

export default Published