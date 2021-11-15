/*!
 * encoding-japanese v1.0.30 - Convert or detect character encoding in JavaScript
 * Copyright (c) 2013-2018 polygon planet <polygon.planet.aqua@gmail.com>
 * https://github.com/polygonplanet/encoding.js
 * @license MIT
 */

//
// UTF-16 (JavaScript Unicode array) to SJIS
//
function UNICODEToSJIS(data) {
    return UTF8ToSJIS(UNICODEToUTF8(data));
}
exports.UNICODEToSJIS = UNICODEToSJIS;

//
// UTF-16 (JavaScript Unicode array) to UTF-8
//
function UNICODEToUTF8(data) {
    var results = [];
    var i = 0;
    var len = data && data.length;
    var c, second;

    //console.log('UNICODEToUTF8 data=' + data + ', len=' + len);
    for (; i < len; i++) {
        c = data[i];

        // high surrogate
        if (c >= 0xD800 && c <= 0xDBFF && i + 1 < len) {
            second = data[i + 1];
            // low surrogate
            if (second >= 0xDC00 && second <= 0xDFFF) {
                c = (c - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
                i++;
            }
        }

        if (c < 0x80) {
            results[results.length] = c;
        } else if (c < 0x800) {
            results[results.length] = 0xC0 | ((c >> 6) & 0x1F);
            results[results.length] = 0x80 | (c & 0x3F);
        } else if (c < 0x10000) {
            results[results.length] = 0xE0 | ((c >> 12) & 0xF);
            results[results.length] = 0x80 | ((c >> 6) & 0x3F);
            results[results.length] = 0x80 | (c & 0x3F);
        } else if (c < 0x200000) {
            results[results.length] = 0xF0 | ((c >> 18) & 0xF);
            results[results.length] = 0x80 | ((c >> 12) & 0x3F);
            results[results.length] = 0x80 | ((c >> 6) & 0x3F);
            results[results.length] = 0x80 | (c & 0x3F);
        }
    }
    //console.log('UNICODEToUTF8 results.length=' + results.length);
    return results;
}
exports.UNICODEToUTF8 = UNICODEToUTF8;

//
// UTF-8 to SJIS
//
function UTF8ToSJIS(data) {
    //console.log('UTF8ToSJIS data=' + data);
    var config = require('./config');
    var EncodingTable = require('./encoding-table');

    var results = [];
    var i = 0;
    var len = data && data.length;
    var b, b1, b2, utf8, jis;
    //console.log('UTF8ToSJIS len=' + len);

    for (; i < len; i++) {
        b = data[i];
        //console.log('i='+ i + ', b='+ b);
        if (b >= 0x80) {
            if (b <= 0xDF) {
                // 2 bytes
                utf8 = (b << 8) + data[++i];
            } else {
                // 3 bytes
                utf8 = (b << 16) +
                (data[++i] << 8) +
                (data[++i] & 0xFF);
            }

            jis = EncodingTable.UTF8_TO_JIS_TABLE[utf8];
            //console.log('b='+ b + ', utf8='+ utf8 + ', jis=' + jis);
            if (jis === void 0) {
                results[results.length] = config.UNKNOWN_CHARACTER;
            } else {
                if (jis < 0xFF) {
                    results[results.length] = jis + 0x80;
                } else {
                    if (jis > 0x10000) {
                        jis -= 0x10000;
                    }

                    b1 = jis >> 8;
                    b2 = jis & 0xFF;
                    if (b1 & 0x01) {
                        b1 >>= 1;
                        if (b1 < 0x2F) {
                            b1 += 0x71;
                        } else {
                            b1 -= 0x4F;
                        }

                        if (b2 > 0x5F) {
                            b2 += 0x20;
                        } else {
                            b2 += 0x1F;
                        }
                    } else {
                        b1 >>= 1;
                        if (b1 <= 0x2F) {
                            b1 += 0x70;
                        } else {
                            b1 -= 0x50;
                        }
                        b2 += 0x7E;
                    }
                    results[results.length] = b1 & 0xFF;
                    results[results.length] = b2 & 0xFF;
                }
            }
        } else {
            //console.log('results.length=' + results.length + ', data[i]=' + data[i]);
            results[results.length] = data[i] & 0xFF;
            //console.log('results.length=' + results.length + ', results[results.length-1]' + results[results.length-1]);
        }
    }

    return results;
}
exports.UTF8ToSJIS = UTF8ToSJIS;

/*
//
// SJIS To UTF-8
//
function SJISToUTF8(data) {
    var config = require('./config');
    var EncodingTable = require('./encoding-table');

    config.init_JIS_TO_UTF8_TABLE();

    var results = [];
    var i = 0;
    var len = data && data.length;
    var b, b1, b2, u2, u3, jis, utf8;

    for (; i < len; i++) {
        b = data[i];
        if (b >= 0xA1 && b <= 0xDF) {
            b2 = b - 0x40;
            u2 = 0xBC | ((b2 >> 6) & 0x03);
            u3 = 0x80 | (b2 & 0x3F);

            results[results.length] = 0xEF;
            results[results.length] = u2 & 0xFF;
            results[results.length] = u3 & 0xFF;
        } else if (b >= 0x80) {
            b1 = b << 1;
            b2 = data[++i];

            if (b2 < 0x9F) {
                if (b1 < 0x13F) {
                    b1 -= 0xE1;
                } else {
                    b1 -= 0x61;
                }

                if (b2 > 0x7E) {
                    b2 -= 0x20;
                } else {
                    b2 -= 0x1F;
                }
            } else {
                if (b1 < 0x13F) {
                    b1 -= 0xE0;
                } else {
                    b1 -= 0x60;
                }
                b2 -= 0x7E;
            }

            b1 &= 0xFF;
            jis = (b1 << 8) + b2;

            utf8 = EncodingTable.JIS_TO_UTF8_TABLE[jis];
            if (utf8 === void 0) {
                results[results.length] = config.UNKNOWN_CHARACTER;
            } else {
                if (utf8 < 0xFFFF) {
                    results[results.length] = utf8 >> 8 & 0xFF;
                    results[results.length] = utf8 & 0xFF;
                } else {
                    results[results.length] = utf8 >> 16 & 0xFF;
                    results[results.length] = utf8 >> 8 & 0xFF;
                    results[results.length] = utf8 & 0xFF;
                }
            }
        } else {
            results[results.length] = data[i] & 0xFF;
        }
    }
    return results;
}
exports.SJISToUTF8 = SJISToUTF8;
*/

//
// JavaScript Unicode array
//
function isUNICODE(data) {
    var i = 0;
    var len = data && data.length;
    var c;

    for (; i < len; i++) {
        c = data[i];
        if (c < 0 || c > 0x10FFFF) {
            return false;
        }
    }
    return true;
}
exports.isUNICODE = isUNICODE;

//
// Shift-JIS (SJIS)
//
function isSJIS(data) {
    var i = 0;
    var len = data && data.length;
    var b;

    while (i < len && data[i] > 0x80) {
        if (data[i++] > 0xFF) {
            return false;
        }
    }

    for (; i < len; i++) {
        b = data[i];
        if (b <= 0x80 || (0xA1 <= b && b <= 0xDF)) {
            continue;
        }
        if (b === 0xA0 || b > 0xEF || i + 1 >= len) {
            return false;
        }
        b = data[++i];
        if (b < 0x40 || b === 0x7F || b > 0xFC) {
            return false;
        }
    }
    return true;
}
exports.isSJIS = isSJIS;

//
// UTF-8
//
function isUTF8(data) {
    var i = 0;
    var len = data && data.length;
    var b;

    for (; i < len; i++) {
        b = data[i];
        if (b > 0xFF) {
            return false;
        }

        if (b === 0x09 || b === 0x0A || b === 0x0D ||
            (b >= 0x20 && b <= 0x7E)) {
            continue;
        }

        if (b >= 0xC2 && b <= 0xDF) {
            if (i + 1 >= len || data[i + 1] < 0x80 || data[i + 1] > 0xBF) {
                return false;
            }
            i++;
        } else if (b === 0xE0) {
            if (i + 2 >= len ||
                data[i + 1] < 0xA0 || data[i + 1] > 0xBF ||
                data[i + 2] < 0x80 || data[i + 2] > 0xBF) {
                    return false;
            }
            i += 2;
        } else if ((b >= 0xE1 && b <= 0xEC) ||
                    b === 0xEE || b === 0xEF) {
            if (i + 2 >= len ||
                data[i + 1] < 0x80 || data[i + 1] > 0xBF ||
                data[i + 2] < 0x80 || data[i + 2] > 0xBF) {
                    return false;
            }
            i += 2;
        } else if (b === 0xED) {
            if (i + 2 >= len ||
                data[i + 1] < 0x80 || data[i + 1] > 0x9F ||
                data[i + 2] < 0x80 || data[i + 2] > 0xBF) {
              return false;
            }
            i += 2;
        } else if (b === 0xF0) {
            if (i + 3 >= len ||
                data[i + 1] < 0x90 || data[i + 1] > 0xBF ||
                data[i + 2] < 0x80 || data[i + 2] > 0xBF ||
                data[i + 3] < 0x80 || data[i + 3] > 0xBF) {
                return false;
            }
            i += 3;
        } else if (b >= 0xF1 && b <= 0xF3) {
            if (i + 3 >= len ||
                data[i + 1] < 0x80 || data[i + 1] > 0xBF ||
                data[i + 2] < 0x80 || data[i + 2] > 0xBF ||
                data[i + 3] < 0x80 || data[i + 3] > 0xBF) {
                return false;
            }
            i += 3;
        } else if (b === 0xF4) {
            if (i + 3 >= len ||
                data[i + 1] < 0x80 || data[i + 1] > 0x8F ||
                data[i + 2] < 0x80 || data[i + 2] > 0xBF ||
                data[i + 3] < 0x80 || data[i + 3] > 0xBF) {
                return false;
            }
            i += 3;
        } else {
            return false;
        }
    }

    return true;
}
exports.isUTF8 = isUTF8;
