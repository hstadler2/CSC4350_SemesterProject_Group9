import React from 'react'
import { QuickLink } from '../content'

const Footer = () => {
    const currentYear = new Date().getFullYear()

  return (
    <footer className='footer'>
        {/* <div className='footer-main'>
            <div className='footer-content'>
                <h3>MediTrack</h3>
                <p>Healthcare management for you!</p>
            </div> */}

            {/* quick links section */}
            {/* <div className='footer-links'>
                <h4>Quick Links</h4>
                <ul>
                    {QuickLink.map((link, index) => (
                    <li key={index}>
                        <a href={link.href}>
                            {link.text}
                        </a>
                    </li> 
                    ))}
                </ul>
            </div>
        </div> */}

        {/* Add contact section? */}
        
        {/* footer bottom */}
        <div className='footer-bottom'>
            <p>&copy; {currentYear} MediTrack. All rights reserved.</p>
        </div>
    </footer>
  )
}

export default Footer