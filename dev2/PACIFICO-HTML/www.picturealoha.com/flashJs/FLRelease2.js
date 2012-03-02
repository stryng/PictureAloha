/*
www.flashrelease.com
Freeware solution to IE activex restriction
*/
var MSG_EvenArgs = 'The %s function requires an even number of arguments.'
                 + '\nArguments should be in the form "atttributeName","attributeValue",...';
var MSG_SrcRequired = "The %s function requires that a movie src be passed in as one of the arguments.";
function AC_AddExtension(args, paramName, extension)
{
  var currArg, paramVal, queryStr, endStr;
  for (var i=0; i < args.length; i=i+2){
    currArg = args[i].toLowerCase();    
    if (currArg == paramName.toLowerCase() && args.length > i+1) {
      paramVal = args[i+1];
      queryStr = "";
      var indQueryStr = args[i+1].indexOf('?');
      if (indQueryStr != -1){
        paramVal = args[i+1].substring(0, indQueryStr);
        queryStr = args[i+1].substr(indQueryStr);
      }
      endStr = "";
      if (paramVal.length > extension.length)
        endStr = paramVal.substr(paramVal.length - extension.length);
      if (endStr.toLowerCase() != extension.toLowerCase()) {
        args[i+1] = paramVal + extension + queryStr;
      }
    }
  }
}
function AC_GetCodebase(baseURL, defaultVersion, args)
{
  var codebase = baseURL + defaultVersion;
  for (var i=0; i < args.length; i=i+2) {
    currArg = args[i].toLowerCase();    
    if (currArg == "codebase" && args.length > i+1) {
      if (args[i+1].indexOf("http://") == 0) {
        codebase = args[i+1];
      }
      else {
        codebase = baseURL + args[i+1];
      }
    }
  }
	
  return codebase;	
}

function AC_checkArgs(args,callingFn){
  var retVal = true;
  if (parseFloat(args.length/2) != parseInt(args.length/2)){
    alert(sprintf(MSG_EvenArgs,callingFn));
    retVal = false;
  }
  return retVal;
}
function AC_GenerateObj(callingFn, useXHTML, classid, codebase, pluginsPage, mimeType, args){
  if (!AC_checkArgs(args,callingFn)){
    return;
  }
  var tagStr = '';
  var currArg = '';
  var closer = (useXHTML) ? '/>' : '>';
  var srcFound = false;
  var embedStr = '<embed';
  var paramStr = '';
  var embedNameAttr = '';
  var objStr = '<object classid="' + classid + '" codebase="' + codebase + '"';
  for (var i=0; i < args.length; i=i+2){
    currArg = args[i].toLowerCase();    
    if (currArg == "src"){
      if (callingFn.indexOf("RunSW") != -1){
        paramStr += '<param name="' + args[i] + '" value="' + args[i+1] + '"' + closer + '\n';
        embedStr += ' ' + args[i] + '="' + args[i+1] + '"';
        srcFound = true;
      }
      else if (!srcFound){
        paramStr += '<param name="movie" value="' + args[i+1] + '"' + closer + '\n'; 
        embedStr += ' ' + args[i] + '="' + args[i+1] + '"';
        srcFound = true;
      }
    }
    else if (currArg == "movie"){
      if (!srcFound){
        paramStr += '<param name="' + args[i] + '" value="' + args[i+1] + '"' + closer + '\n'; 
        embedStr += ' src="' + args[i+1] + '"';
        srcFound = true;
      }
    }
    else if (   currArg == "width" 
              || currArg == "height" 
              || currArg == "align" 
              || currArg == "vspace" 
              || currArg == "hspace" 
              || currArg == "class" 
              || currArg == "title" 
              || currArg == "accesskey" 
              || currArg == "tabindex"){
      objStr += ' ' + args[i] + '="' + args[i+1] + '"';
      embedStr += ' ' + args[i] + '="' + args[i+1] + '"';
    }
    else if (currArg == "id"){
      objStr += ' ' + args[i] + '="' + args[i+1] + '"';
      if (embedNameAttr == "")
        embedNameAttr = ' name="' + args[i+1] + '"';
    }
    else if (currArg == "name"){
      objStr += ' ' + args[i] + '="' + args[i+1] + '"';
      embedNameAttr = ' ' + args[i] + '="' + args[i+1] + '"';
    }    
    else if (currArg == "codebase"){
    }    
      else{
      paramStr += '<param name="' + args[i] + '" value="' + args[i+1] + '"' + closer + '\n'; 
      embedStr += ' ' + args[i] + '="' + args[i+1] + '"';
    }
  }
  if (!srcFound){
    alert(AC_sprintf(MSG_SrcRequired,callingFn));
    return;
  }

  if (embedNameAttr)
    embedStr += embedNameAttr;	
  if (pluginsPage)
    embedStr += ' pluginspage="' + pluginsPage + '"';
  if (mimeType)
    embedStr += ' type="' + mimeType + '"';
  objStr += '>\n';
  embedStr += '></embed>\n'; 
  tagStr = objStr + paramStr + embedStr + "</object>\n"; 
  document.write(tagStr);
}
