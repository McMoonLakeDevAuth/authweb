/*
 * Copyright (C) 2016-Present The MoonLake (mcmoonlake@hotmail.com)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var express = require('express')
var router = express.Router();

var register = require('./register');
router.route('/register').get(register.get).post(register.post);

router.post('/authenticate', require('./authenticate'));
router.post('/refresh', require('./refresh'));
router.post('/validate', require('./validate'));
router.post('/invalidate', require('./invalidate'));
router.post('/signout', require('./signout'));

module.exports = router;
