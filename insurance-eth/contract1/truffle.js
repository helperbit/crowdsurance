/* 
 *  Helperbit: a p2p donation platform (crowdsurance)
 *  Copyright (C) 2016-2021  Davide Gessa (gessadavide@gmail.com)
 *  
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *  
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *  
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>
 */

module.exports = {
  build: {
    "index.html": "index.html",
    "app.js": [
      "javascripts/app.js",
      "javascripts/status.js",
      "javascripts/overview.js",
      "javascripts/events.js",
      "javascripts/insure.js",
      "javascripts/raise.js",
      "javascripts/admin.js"
    ],
    "app.css": [
      "stylesheets/fonts.css",
      "stylesheets/app.css"
    ],
    "images/": "images/",
    "fonts/": "fonts/",
    "views/": "views/",
    "bower_components/": "bower_components/"
  },
  rpc: {
    host: "localhost",
    port: 8545
  },
  networks: {
      dev: {
        network_id: "default"
      }
  }
};
