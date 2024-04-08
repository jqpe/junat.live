import { Item, Root } from '@radix-ui/react-radio-group'

const RadioGroupItem = (props: { item: string; value: string }) => {
  const id = `radio-item-${props.item}`

  return (
    <div className="data-[checked=true]:bg-white text-center grid grid-cols-1 min-w-fit">
      <Item
        value={props.item}
        id={id}
        className="[grid-column-start:1] [grid-row-start:1] z-[0] focus:outline-none data-[state=checked]:bg-primary-500 rounded-full "
      />
      <label
        className="[grid-column-start:1] [grid-row-start:1] text-sm z-[1] px-2 py-0.5 pointer-events-none"
        htmlFor={id}
      >
        {props.value}
      </label>
    </div>
  )
}

export type RadioGroupProps<K extends string = string> = {
  defaultValue: K
  onValueChange: (value: K) => void
  values: Record<K, string>
  value?: K
  as?: React.ElementType
}

export const RadioGroup = (props: RadioGroupProps) => {
  const As: React.ElementType = props.as ?? 'div'

  return (
    <Root
      asChild
      value={props.value}
      defaultValue={props.defaultValue}
      onValueChange={props.onValueChange}
      className="flex rounded-full border-primary-500 border-[1px] max-w-max overflow-clip bg-gray-100 dark:bg-transparent"
    >
      <As>
        {Object.keys(props.values).map(item => (
          <RadioGroupItem key={item} item={item} value={props.values[item]} />
        ))}
      </As>
    </Root>
  )
}
