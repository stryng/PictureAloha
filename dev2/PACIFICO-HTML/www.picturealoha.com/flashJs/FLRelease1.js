/*
www.flashrelease.com
Freeware solution to IE activex restriction
*/

function AC_RunFlContentX()
{
  AC_AddExtension(arguments, "movie", ".swf");
  AC_AddExtension(arguments, "src", ".swf");
  var codebase = AC_GetCodebase
                 (  "http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version="
                  , "7,0,0,0", arguments 
                 );
	
  AC_GenerateObj
  (  "AC_RunFlContentX()", true, "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"
   , codebase
   , "http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash"
   , "application/x-shockwave-flash", arguments
  );	
}