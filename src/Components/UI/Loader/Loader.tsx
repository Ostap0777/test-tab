import React from 'react'
import styles from '../Loader/loader.module.scss'

export default function Loader() {
  return (
	<div className={styles.loader}>
	<div className={styles.spinner}></div>
 </div>
  )
}