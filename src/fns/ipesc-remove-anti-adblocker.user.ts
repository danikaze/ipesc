// ==UserScript==
// @name         Simracing GP utils
// @namespace    srgp.danikaze
// @version      1.0.0
// @description  Avoid the anti ad-blocker in SimRacing GP
// @author       danikaze
// @source       https://github.com/danikaze/ipesc
// @updateURL    https://gist.github.com/danikaze/1f803cac51248068ae4b42a62416a1b1/raw/be30561cd0d5e900f403d39befa5af522209965d/ipesc-remove-anti-adblocker.user.js
// @downloadURL  https://gist.github.com/danikaze/1f803cac51248068ae4b42a62416a1b1/raw/be30561cd0d5e900f403d39befa5af522209965d/ipesc-remove-anti-adblocker.user.js
// @match        https://app.simracing.gp/*
// @icon         https://app.simracing.gp/favicon.ico
// @run-at       document-start
// @noframes
// @grant        unsafeWindow
// ==/UserScript==

import { removeAntiAdBlocker } from 'utils/sgp/remove-anti-adblocker';

printEnabledMsg();
removeAntiAdBlocker();

function printEnabledMsg() {
  const reset = 'color: navy;';
  const msg = ['%c  S%cR%cGP%c utilities enabled!'].join('\n');
  console.log(
    msg,
    'border-left: 8px solid navy; color: red; font-weight: bold',
    'color: orange; font-weight: bold',
    'font-weight: bold; color:black',
    reset
  );
}
