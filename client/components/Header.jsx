import React from 'react';
import styles from './css/Header.css';

const Header = (props) => (
    <div className={styles.asbar}>
      <div className={styles.asheader}>
        <div className={styles.astopbar}>
          <h1 className={styles.aslistingName} >{props.listing.name}</h1>
        </div>
        <div className={styles.asbybar}>

          <div className={styles.asstar}>
            <svg viewBox="0 0 1000 1000" className={styles.asstarIcon}><path d="M972 380c9 28 2 50-20 67L725 619l87 280c11 39-18 75-54 75-12 0-23-4-33-12L499 790 273 962a58 58 0 0 1-78-12 50 50 0 0 1-8-51l86-278L46 447c-21-17-28-39-19-67 8-24 29-40 52-40h280l87-279c7-23 28-39 52-39 25 0 47 17 54 41l87 277h280c24 0 45 16 53 40z"></path></svg>
          </div>

          <div className={styles.asreviews}>
            <div className={styles.asrating}>
              {props.listing.rating = 5 ? '5.0' : props.listing.rating}
            </div>
            <div className={styles.asrevtotal}>{`(${props.listing.reviews})`}</div>
          </div>

          <div className={styles.asspacer}>·</div>

          <div className={styles.aslocation}>
            <text>{props.listing.location}</text>
          </div>

          <div className={styles.asbuttons}>
            <div className={styles.asshare}>
              <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" className={styles.asarrowIcon}><g fill="none"><path d="M27 18v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-9"></path><path d="M16 3v23V3z"></path><path d="M6 13l9.293-9.293a1 1 0 0 1 1.414 0L26 13"></path></g></svg>
              <text>Share</text>
            </div>
            <div className={styles.assave}>
              <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" className={styles.asheartIcon}><path d="m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z"></path></svg>
              <text>Save</text>
            </div>
          </div>

        </div>
      </div>
    </div>
);

export default Header;
