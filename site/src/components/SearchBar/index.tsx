import type { FormEvent, FormEventHandler, RefObject } from 'react'

import { createRef } from 'react'
import Search from '../../../public/icons/search.svg'

import styles from './SearchBar.module.scss'

export interface SearchBarProps {
  handleChange: (
    event: FormEvent<HTMLFormElement>,
    inputRef: RefObject<HTMLInputElement>
  ) => void
  handleSubmit: FormEventHandler<HTMLFormElement>
}

export default function SearchBar({
  handleChange,
  handleSubmit
}: SearchBarProps) {
  const inputRef = createRef<HTMLInputElement>()

  return (
    <nav className={styles.searchBar}>
      <form
        onChange={event => handleChange(event, inputRef)}
        onSubmit={handleSubmit}
        className={styles.searchForm}
      >
        <input type="text" ref={inputRef} placeholder="Hae asemaa nimellä" />
        <button type="submit" className={styles.submitButton}>
          <Search width="24" height="24" className={styles.searchIcon} />
        </button>
      </form>
    </nav>
  )
}
