import { MouseEvent, useEffect, useState } from 'react';
import { a, config, useSpring } from '@react-spring/web';
import {useDrag} from "@use-gesture/react";
import React from 'react';

const width = 300;

export default function Header() {

    const[menuOpen,setMenuOpen] = useState(false);
    const[mobDevice,setMobDevice] = useState(false);

    const [{ x }, api] = useSpring(() => ({ x: width }))

    const open = ({ canceled } : { canceled: boolean}) => {
      // when cancel is true, it means that the user passed the upwards threshold
      // so we change the spring config to create a nice wobbly effect
      api.start({ x: 0, immediate: false, config: canceled ? config.wobbly : config.stiff })

    }
    const close = (velocity = 0) => {
      api.start({ x: width, immediate: false, config: { ...config.stiff, velocity} })

    }

    const bind = useDrag(
      ({ last, velocity: [vx, ], direction: [dx, ], offset: [ox, ], cancel, canceled }) => {

        // if the user drags up passed a threshold, then we cancel
        // the drag so that the sheet resets to its open position
        if (ox < -20) cancel()

        // when the user releases the sheet, we check whether it passed
        // the threshold for it to close, or if we reset it to its open positino
        if (last) {
          // console.log('ox: ' + ox);
          if(ox > width * 0.5 || (vx > 0.5 && dx > 0)) {
            setMenuOpen(false);
            close(vx)
            enableBg();
          } else {
            setMenuOpen(true)
            open({ canceled })
            disableBg();
          }
        }
        // when the user keeps dragging, we just move the sheet according to
        // the cursor position
        else api.start({ x: ox, immediate: true })
      },
      { from: () => [0, x.get()], filterTaps: true, bounds: { top: 0 }, rubberband: true }
    );

    useEffect(() => {
      // listening on window width to set menu open/closed respectively
      if (typeof window != 'undefined') {
        if(window.innerWidth > 600) setMenuOpen(true);
        window.addEventListener('resize', windowWidth);
      }
      function windowWidth() {
        if (window.innerWidth > 600) {
          setMobDevice(false);
        } else {
          setMobDevice(true);
        }
      }
      return () => window.removeEventListener('resize', windowWidth);
    });

    return (
    <>
        <section className="col-span-2 md:text-right md:fixed md:left-16 p-4 z-40"> 
        <div className="flex flex-col md:gap-16 gap-4">
        <div className='flex flex-row justify-between items-center' id="topHeader">
            <div className={`text-4xl font-bold ${mobDevice && menuOpen  ? "blur-md" : "blur-none"}`}>
              Header
            </div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
              strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 sm:h-0 z-50"
              onClick={(e) => toggleMenu(e)}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
          </svg>
        </div>
      
        <a.div style={{ right: -width + x.get(), x }} 
                {...bind()} className={`sm:hidden backdrop-blur-none blur-none touch-none fixed md:flex flex-col gap-4 text-md font-bold text-left md:text-left 
                         md:fixed md:left-auto md:top-auto top-0 h-screen md:h-auto md:w-auto p-4 md:p-0 z-40 w-[300px]
                        bg-gray-300 md:bg-inherit pt-24 md:pt-0`} id="navbar">
          <ul>
            <li>
            <a onClick={closeMenu}>home</a>
            </li>
            <li>
            <a onClick={closeMenu}>contact</a>
            </li>
            <li>
            <a onClick={closeMenu}>services</a>
            </li>
            <li>
            <a onClick={closeMenu}>portfolio</a>
            </li>
            <li>
            <a onClick={closeMenu}>blog</a>
            </li>
            <li>
            <a onClick={closeMenu}>theme: light</a>
            </li>
            <li>
              Hi, username
            </li>
          </ul>
        </a.div>

        <div className='text-md font-bold hidden sm:block'>
        <ul>
            <li>
                home
            </li>
            <li>
                contact
            </li>
            <li>
                services
            </li>
            <li>
                portfolio (coming soon)
            </li>
            <li>
                blog
            </li>
            <li>
              theme: light
            </li>
            <li>
                Hi, username
            </li>
          </ul>
          </div>

        </div>
      </section>
      </>

    )

    function toggleMenu(event: MouseEvent) {
      console.log('menuOpen: ' +menuOpen);
      setMenuOpen(prev => !prev);
      if(!menuOpen) {
        console.log('opening menu ')
        open({canceled: false});
        disableBg();
      } else {
        console.log('closing menu');
        close()
        enableBg();
      }
      console.log(document.getElementById("navbar"));
    }

    function closeMenu() {
      setMenuOpen(false);
      close(1);
      enableBg();
    }

    function disableBg() {
      const element = document.querySelector("body");
      element?.classList.add("noscroll");
    }

    function enableBg() {
      const element = document.querySelector("body");
      element?.classList.remove("noscroll");
    }
    
  }

