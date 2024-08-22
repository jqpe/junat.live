import { Item, Root } from '@radix-ui/react-radio-group'
import { cx } from 'cva'

const RadioGroupItem = (props: { item: string; value: string }) => {
  const id = `radio-item-${props.item}`

  return (
    <div className="grid min-w-fit grid-cols-1 text-center data-[checked=true]:bg-white">
      <Item
        value={props.item}
        id={id}
        className={cx(
          'z-[0] rounded-full [grid-column-start:1]',
          '[grid-row-start:1] focus-visible:outline-none data-[state=checked]:bg-primary-500',
        )}
      />
      <label
        className={cx(
          'pointer-events-none z-[1] px-2 py-0.5 text-sm [grid-column-start:1] [grid-row-start:1]',
        )}
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
      className={cx(
        'flex rounded-full border-[1px] border-primary-500',
        'max-w-max overflow-clip bg-gray-100 dark:bg-transparent',
        'ring-primary-500 has-[:focus-visible]:ring-[1px]',
      )}
    >
      <As>
        {Object.keys(props.values).map(item => (
          <RadioGroupItem key={item} item={item} value={props.values[item]!} />
        ))}
      </As>
    </Root>
  )
}
