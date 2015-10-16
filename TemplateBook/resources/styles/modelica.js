/* Patterns for Modelica keyword, component, string, and comment
   are defined in the form:
      var pattern = /(keyword-pattern)  |
                     (component-pattern)|
                     (string-pattern)   |
                     (comment-pattern)/
   Once, one of the patterns is detected, function markPattern(..) 
   is called and in this function the detected patterns are marked
   with "<span ...>found-pattern</span>" elements.  

   '|(^\\s*[\\w\\.]+)' +                     // components
*/
var pattern = new RegExp(
  '\\s*\\b(algorithm|discrete|model|redeclare|and|each|final|not|replaceable|annotation|else|flow|operator|return|elseif|for|or|stream|block|elsewhen|function|outer|then|break|encapsulated|if|output|class|end|import|package|type|connect|enumeration|in|parameter|when|connector|equation|initial|partial|while|constant|expandable|inner|protected|within|constrainedby|extends|input|public|der|external|loop|record)\\b' +   // keywords
  '|(^\\s*(\\w+(\\.\\w+)*|\\.\\w+(\\.\\w+)*))' +  // components
  '|(\\/\\*[\\s\\S]*?\\*\\/|\\/\\/.*?$)'       +  // comments
  '|(".*?")',                                     // strings
  'gm');

var equation = /equation|algorithm/;
var declaration = true;

function markPattern(str, keyword, component, dummy1, dummy2, comment, string) {
   if ( keyword ) {
      if ( declaration ) {
         if ( equation.test(keyword) ) {declaration = false;}
      }         
      return "<span class='keyword'>" + str + "</span>";
      
   } else if ( component ) {
      if ( declaration ) {
         return "<span class='component'>" + str + "</span>";
      } else {
         return str;
      }

   } else if ( string ) {
      return "<span class='string'>" + str + "</span>";    
      
   } else { // comment
      return "<span class='comment'>" + str + "</span>";
   }      
}

function highlight() {
  var modelicaElements = document.getElementsByClassName('Modelica');
  var equationElements = document.getElementsByClassName('ModelicaEquation');  
  var preElements      = document.getElementsByTagName('pre');
  var code, table, tr, td, parent, classType;
 
  for (var i=0; i<modelicaElements.length; i++) {
     /* Remove the first empty line, so change
          <... class="Modelica">
             model Test
        to
          <... class="Modelica">model Test
     */
     code = modelicaElements[i].innerHTML;        
     code = code.replace(/^\s*\n/, '');
        
     /* Change keywords/datatypes/strings/comments XXX to
          <span class='keyword/datatype/string/comment'>XXX</span>
     */
     declaration = true;
     modelicaElements[i].innerHTML = code.replace(pattern, markPattern);
  }

  for (var i=0; i<equationElements.length; i++) {
     declaration = false;
     equationElements[i].innerHTML = equationElements[i].innerHTML.replace(pattern, markPattern);
  }     
   
  var i = 0;
  while ( i < preElements.length ) {
     classType = preElements[i].getAttribute("class");
     
     if (  classType == "Modelica" || classType == "Box") {
        code = preElements[i].innerHTML;        
    
        /* Change
             <pre class="Modelica">
                ...
             </pre>
           to 
             <table>
               <tr>
                 <td class="Modelica">
                     ...
                 </td>
               </tr>
             </table>
        */
        table = document.createElement("table");
        tr    = document.createElement("tr");
        td    = document.createElement("td");
        td.setAttribute("class", classType);
        td.innerHTML = code;
        tr.appendChild(td);
        table.appendChild(tr);
        parent = preElements[i].parentNode;
        parent.replaceChild(table, preElements[i]);   
        
     } else if ( classType == "ModelicaNoBox" ) {
        code = preElements[i].innerHTML;        
        code = code.replace(/^\s*\n/, '');
        declaration = true;
        preElements[i].innerHTML = code.replace(pattern, markPattern); 
        i++;
        
     } else {
        i++;
     }
  }
}
document.addEventListener("DOMContentLoaded", highlight, false);