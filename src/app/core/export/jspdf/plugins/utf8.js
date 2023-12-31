(function (jsPDFAPI) {
    'use strict';
        var jsPDFAPI = jsPDF.API;
        
        var glyID = [0];
        var data;
      /**************************************************/
      /* function : toHex                               */
      /* comment : Replace str with a hex string.       */
      /**************************************************/
      function toHex(str) {
        var hex = '';
        for (var i = 0; i < str.length; i++) {
          hex += '' + str.charCodeAt(i).toString(16);
        }
        return hex;
      }
        
      /***************************************************************************************************/
      /* function : pdfEscape16                                                                          */
      /* comment : The character id of a 2-byte string is converted to a hexadecimal number by obtaining */
      /*   the corresponding glyph id and width, and then adding padding to the string.                  */
      /***************************************************************************************************/
          var pdfEscape16 = function (text, font) {
            var widths = font.metadata.Unicode.widths;;
            var padz = ["", "0", "00", "000", "0000"];
            var ar = [""];
            for (var i = 0, l = text.length, t; i < l; ++i) {
              t = font.metadata.characterToGlyph(text.charCodeAt(i))
              glyID.push(t);
              if (widths.indexOf(t) == -1) {
                widths.push(t);
                widths.push([parseInt(font.metadata.widthOfGlyph(t), 10)]);
              }
              if (t == '0') { //Spaces are not allowed in cmap.
                return ar.join("");
              } else {
                t = t.toString(16);
                ar.push(padz[4 - t.length], t);
              }
            }
            return ar.join("");
          };
        
        var identityHFunction = function (font, out, newObject) {
            
            if ((font.metadata instanceof TTFFont) && font.encoding === 'Identity-H') { //Tag with Identity-H
				var widths = font.metadata.Unicode.widths;
              var data = font.metadata.subset.encode(glyID);
              var pdfOutput = data;
              var pdfOutput2 = "";
              for (var i = 0; i < pdfOutput.length; i++) {
                pdfOutput2 += String.fromCharCode(pdfOutput[i]);
              }
              var fontTable = newObject();
              out('<<');
              out('/Length ' + pdfOutput2.length);
              out('/Length1 ' + pdfOutput2.length);
              out('>>');
              out('stream');
              out(pdfOutput2);
              out('endstream');
              out('endobj');
              var fontDescriptor = newObject();
              out('<<');
              out('/Type /FontDescriptor');
              out('/FontName /' + font.fontName);
              out('/FontFile2 ' + fontTable + ' 0 R');
              out('/FontBBox ' + PDFObject.convert(font.metadata.bbox));
              out('/Flags ' + font.metadata.flags);
              out('/StemV ' + font.metadata.stemV);
              out('/ItalicAngle ' + font.metadata.italicAngle);
              out('/Ascent ' + font.metadata.ascender);
              out('/Descent ' + font.metadata.decender);
              out('/CapHeight ' + font.metadata.capHeight);
              out('>>');
              out('endobj');
              var DescendantFonts = newObject();
              out('<</DW 1000/Subtype/CIDFontType2/CIDSystemInfo<</Supplement 0/Registry(Adobe)/Ordering(' + font.encoding + ')>>/Type/Font/BaseFont/' + font.fontName + '/FontDescriptor ' + fontDescriptor + ' 0 R/W' + PDFObject.convert(widths) + '/CIDToGIDMap/' + font.encoding + '>>');
              out('endobj');
              font.objectNumber = newObject();
              out('<</Subtype/Type0/Type/Font/BaseFont/' + font.fontName + '/Encoding/' + font.encoding + '/DescendantFonts[' + DescendantFonts + ' 0 R]>>');
              out('endobj');
              font.isAlreadyPutted = true;
            }
        }
        

        jsPDFAPI.events.push([ 
        	'putFont'
        	,function(args) {
        		identityHFunction(args.font, args.out, args.newObject);
        }]);
        
        
        var winAnsiEncodingFunction = function (font, out, newObject) {
            
            if ((font.metadata instanceof TTFFont) && font.encoding === 'WinAnsiEncoding') { //Tag with WinAnsi encoding
				var widths = font.metadata.Unicode.widths;
		   var data = font.metadata.rawData;
              var pdfOutput = data;
              var pdfOutput2 = "";
              for (var i = 0; i < pdfOutput.length; i++) {
                pdfOutput2 += String.fromCharCode(pdfOutput[i]);
              }
              var fontTable = newObject();
              out('<<');
              out('/Length ' + pdfOutput2.length);
              out('/Length1 ' + pdfOutput2.length);
              out('>>');
              out('stream');
              out(pdfOutput2);
              out('endstream');
              out('endobj');
              var fontDescriptor = newObject();
              out('<<');
              out('/Descent ' + font.metadata.decender);
              out('/CapHeight ' + font.metadata.capHeight);
              out('/StemV ' + font.metadata.stemV);
              out('/Type /FontDescriptor');
              out('/FontFile2 ' + fontTable + ' 0 R');
              out('/Flags 96');
              out('/FontBBox ' + PDFObject.convert(font.metadata.bbox));
              out('/FontName /' + font.fontName);
              out('/ItalicAngle ' + font.metadata.italicAngle);
              out('/Ascent ' + font.metadata.ascender);
              out('>>');
              out('endobj');
              font.objectNumber = newObject();
              for (var i = 0; i < font.metadata.hmtx.widths.length; i++) {
                font.metadata.hmtx.widths[i] = parseInt(font.metadata.hmtx.widths[i] * (1000 / font.metadata.head.unitsPerEm)); //Change the width of Em units to Point units.
              }
              out('<</Subtype/TrueType/Type/Font/BaseFont/' + font.fontName + '/FontDescriptor ' + fontDescriptor + ' 0 R' + '/Encoding/' + font.encoding + ' /FirstChar 29 /LastChar 255 /Widths ' + PDFObject.convert(font.metadata.hmtx.widths) + '>>');
              out('endobj');
              font.isAlreadyPutted = true;
            }
        }
        
        jsPDFAPI.events.push([ 
        	'putFont'
        	,function(args) {
        		winAnsiEncodingFunction(args.font, args.out, args.newObject);
        	}
        ]);
        
        var utf8TextFunction = function (args) {
            var text = args.text;
            var x = args.x;
            var y = args.y;
            var options = args.options || {};
            var tmp;
            var mutex = args.mutex || {};
            
            var pdfEscape = mutex.pdfEscape;
            var activeFontKey = mutex.activeFontKey;
            var fonts = mutex.fonts;
            var key, sum = 0,
              fontSize = mutex.activeFontSize, lineHeight = 0,
              axisCache;
    
            var str = '', 
            v = 0, 
            s = 0,
            tkey, widths, cmapConfirm;
            var strText = ''
            var attr;
            var key = activeFontKey;
            var encoding = fonts[key].encoding;
            
            if (fonts[key].encoding !== 'Identity-H') {
                return {
                    text : text,
                    x : x,
                    y : y,
                    options: options,
                    mutex: mutex
                };
            }
            var i = 0;
            strText = text;
            
            key = (attr) ? getFont(attr.font, attr.fontStyle) : activeFontKey;
            if (Object.prototype.toString.call(text) === '[object Array]') {
				strText = text[0];
			}
          for (s = 0; s < strText.length; s += 1) {
          if (fonts[key].metadata.hasOwnProperty('cmap')) {
			  cmapConfirm = fonts[key].metadata.cmap.unicode.codeMap[strText[s].charCodeAt(0)];
			  /*
			 if (Object.prototype.toString.call(text) === '[object Array]') {
                var i = 0;
               // for (i = 0; i < text.length; i += 1) {
                    if (Object.prototype.toString.call(text[s]) === '[object Array]') {
						cmapConfirm = fonts[key].metadata.cmap.unicode.codeMap[strText[s][0].charCodeAt(0)]; //Make sure the cmap has the corresponding glyph id
                    } else {
                        
                    }
                //}
				
            } else {
				cmapConfirm = fonts[key].metadata.cmap.unicode.codeMap[strText[s].charCodeAt(0)]; //Make sure the cmap has the corresponding glyph id
            }*/
          }
            if (!cmapConfirm) {
                if (strText[s].charCodeAt(0) < 256 && fonts[key].metadata.hasOwnProperty('Unicode')) {
                  str += strText[s];
                } else {
                  str += '';
                }
            } else {
            str += strText[s];
            }
          }
          var result = '';
          if ((parseInt(key.slice(1)) < 14) || encoding === 'WinAnsiEncoding') { //For the default 13 font
                result = toHex(pdfEscape(str, key));
              } else if (encoding === 'Identity-H') {
                  result = pdfEscape16(str, fonts[key]);
              }
              mutex.isHex = true;
            
            return {
                text : result,
                x : x,
                y : y,
                options: options,
                mutex: mutex
            };
        }
        
        var utf8EscapeFunction = function(parms) {
        	var text = parms.text,
            x = parms.x,
            y = parms.y,
            options = parms.options,
            mutex = parms.mutex
            var lang = options.lang;
            var tmpText = [];
            var tempPayLoad;
            var args = {
                    text : text,
                    x : x,
                    y : y,
                    options: options,
                    mutex: mutex
                };

            if (Object.prototype.toString.call(text) === '[object Array]') {
                var i = 0;
                for (i = 0; i < text.length; i += 1) {
                    if (Object.prototype.toString.call(text[i]) === '[object Array]') {
                        if (text[i].length === 3) {
                            tmpText.push([utf8TextFunction(Object.assign({}, args, {text: text[i][0]})).text, text[i][1], text[i][2]]);
                        } else {
                            tmpText.push(utf8TextFunction(Object.assign({}, args, {text: text[i]})).text);
                        }
                    } else {
                        tmpText.push(utf8TextFunction(Object.assign({}, args, {text: text})).text);
                    }
                }
                parms.text = tmpText;
                
            } else {
                parms.text = utf8TextFunction(Object.assign({}, args, {text: text})).text;
            }
        }

        jsPDFAPI.events.push([ 
        	'postProcessText'
        	,utf8EscapeFunction
        ]);
        
})(jsPDF);