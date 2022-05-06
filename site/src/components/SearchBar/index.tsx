import type {
  FocusEventHandler,
  FormEvent,
  FormEventHandler,
  RefObject
} from 'react'

import { createRef } from 'react'
import Search from '../../../public/icons/search.svg'

import styles from './SearchBar.module.scss'

export interface SearchBarProps {
  handleChange: (
    event: FormEvent<HTMLFormElement>,
    inputRef: RefObject<HTMLInputElement>
  ) => void
  handleSubmit: FormEventHandler<HTMLFormElement>
  handleFocus: FocusEventHandler<HTMLFormElement>
  placeholder: string
  ariaLabel: string
}

export default function SearchBar({
  handleChange,
  handleSubmit,
  handleFocus,
  placeholder,
  ariaLabel
}: SearchBarProps) {
  const inputRef = createRef<HTMLInputElement>()

  return (
    <nav className={styles.searchBar}>
      <form
        onFocus={event => handleFocus(event)}
        onChange={event => handleChange(event, inputRef)}
        onSubmit={handleSubmit}
        className={styles.searchForm}
      >
        <input type="text" ref={inputRef} placeholder={placeholder} />
        <button
          type="submit"
          className={styles.submitButton}
          aria-label={ariaLabel}
        >
          <Search width="24" height="24" className={styles.searchIcon} />
        </button>
      </form>
    </nav>
  )
}
