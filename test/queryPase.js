var QueryParse=(function() {
                var pub={};
                pub.cell_align_right_class="text-right";
                pub.cell_align_center_class="text-center";
                pub.cell_align_left_class="";      
                pub.cell_align_right_style="text-align:right";
                pub.cell_align_center_style="text-align:center";
                pub.cell_align_left_style="text-align:left";                          
                pub.table_start='<table id="outputTable" class="tablesortorder table table-bordered float-center  outputTable table-striped ">';    
                pub.table_end='</table>';          
                pub.recordcount=0;       
                pub.maxrows=50;
                pub.parsejsonquerydata=function(data,OutDiv,dosort,startrow,maxrows,pag_link_id) {                                              
                                var column_align_arr=[];                                              
                                var colcount=0;
                                OutDiv.empty();
                                pub.maxrows=maxrows;
                                var outdivcontent="";                                                    
                                $.each( data, function( key, val ) {                                                                                           
                                                if (key=="column_align") {
                                                                $.each(data.column_align,function(tmpkey,align_flag) {                               
                                                                                column_align_arr.push(align_flag);                                                                         
                                                                });                                                           
                                                }                                                              
                                                if (key=="colheaders") {
                                                                //alert("hellow");
                                                                outdivcontent +='<thead><tr>';
                                                                var counter=0;
                                                                $.each(data.colheaders,function(tmpkey,colname) {                      
                                                                                var alignclass=getalignclass(column_align_arr,counter);
                                                                                var alignstyle=getalignstyle(column_align_arr,counter);
                                                                                outdivcontent +='<th class="success ' + alignclass +  '"'  + ' style="' +   alignstyle   +  '">'  + colname + "</th>";                  
                                                                                counter++;
                                                                                //alert(colname);
                                                                                colcount=counter;
                                                                });           
                                                                outdivcontent +='</tr></thead>';
                                                }
                                                
                                                if (key=="recordcount") 
                                                                pub.recordcount=parseInt(val);                
                                                if (key=='records') {
                                                                outdivcontent +='<tbody>';                                                        
                                                                $.each( data.records, function( rkey, rval ) {                        
                                                                                
                                                                                var counter=0;
                                                                                var rowtype=rval.rowtype;
                                                                                var totalclass="";
                                                                                if (rowtype=="total")
                                                                                                totalclass=" textAsLink";
                                                                                else if (rowtype.length) {
                                                                                                outdivcontent += '<tr style="background-color:' +  rowtype + ' ">';                                
                                                                                }              
                                                                                else        
                                                                                                outdivcontent += '<tr>';                                
                                                                                $.each( rval.row, function( rowkey, cellval ) {                                                                                                                                                                                                      
                                                                                                var alignclass=getalignclass(column_align_arr,counter);                                                                                 
                                                                                                outdivcontent += '<td class="' + alignclass +  totalclass +  '">' +  cellval + "</td>";                                                                                                                                                                                                                                                           
                                                                                                counter++;
                                                                                });                                                                           
                                                                                if (counter < colcount) {
                                                                                                var colspan_cols=colcount - counter;
                                                                                                for (var x=0; x < colspan_cols; x++) 
                                                                                                                outdivcontent += '<td> </td>'; 
                                                                                }
                                                                                                
                                                                                outdivcontent +='</tr>';
                                                                });                                                                           
                                                                outdivcontent +='</tbody>';                                                                      
                                                }                                              
                                });
                                outdivcontent +='<tfooter>';                                                                     
                                if (pub.recordcount == 0) {
                                                outdivcontent="<tr><td>No records found for search criteria.</td></tr>";
                                }
                                else {
                                                outdivcontent +='<tr><td colspan="' + colcount + '"><b>' +  pub.recordcount  + '</b> Records</td></tr>';                                                                       
                                                if (pub.recordcount > maxrows) {
                                                                paginatestring=getPaginator(pub.recordcount,startrow,maxrows,pag_link_id);
                                                                outdivcontent +='<tr><td colspan="'  + colcount + '">' +  paginatestring + '</td></tr>';                                                                      
                                                }              
                                }              
                                outdivcontent +='</tfooter>';                                   
                                OutDiv.append(outdivcontent);
                                if (dosort)
                                                OutDiv.tablesorter();                                     
                };             
                function getalignclass(column_align_arr,column_align_arr_index) {
                                var alignclass=pub.cell_align_left_class; //default to left
                                if (column_align_arr_index < column_align_arr.length) {
                                                var align_flag=column_align_arr[column_align_arr_index];
                                                if (align_flag==2)
                                                                alignclass=pub.cell_align_right_class;
                                                if (align_flag==1)              
                                                                alignclass=pub.cell_align_center_class;
                                }
                                return   alignclass;
                }
                function getPaginator(recordcount,startrow,maxrows,pag_link_id) {
                                var paginatestring="";
                                var nextRecs=startrow + maxrows;
                                console.info("nextRecs at begin= " + nextRecs);
                                console.info("startrow at begin= " + startrow);
                                console.info("maxrows at begin= " + maxrows);
                                var prevRecs=startrow - maxrows;
                                if (prevRecs < 0)
                                                prevRecs=0;
                                if (nextRecs > recordcount)
                                                nextRecs=0;
                                console.info("nextRecs after if = " + nextRecs);
                                var firstGroupPage=1;
                                var endGroupPage= Math.ceil(recordcount/maxrows); 
                                var ThisGroupPage=Math.ceil(startrow/maxrows);
                                var pageIsLinked=false;
                                var goToPage=0;
                                if (prevRecs > 0)
                                                paginatestring +='<a href="#" class="' + pag_link_id + '" goToPage="' + prevRecs + '">PREV</a> ';
                                for (var I=firstGroupPage; I <= endGroupPage; I++ ) {
                                                if (I <= endGroupPage && I != ThisGroupPage) 
                                                                pageIsLinked=true;
                                                else
                                                                pageIsLinked=false;
                                                paginatestring +=' | '; 
                                                if (pageIsLinked) {
                                                                goToPage=I*maxrows-maxrows +1
                                                                paginatestring +=' <a href="#" goToPage="' + goToPage + '" class="' + pag_link_id + '">' + I  + '</a>';                                                 
                                                }
                                                else 
                                                                paginatestring +=' ' + I  + ' ';                          
                                                
                                }
                                if (nextRecs > 0)               
                                                paginatestring +=' |  <a class="' + pag_link_id + '" goToPage="' + nextRecs + '" href="#">NEXT</a> ';
                                var message="startrow= " + startrow + "  maxrows= "  + maxrows + " recordcount= " + recordcount + " endgroup= " + endGroupPage + " ThisGroupPage= " +  ThisGroupPage +  "  nextRecs= " + nextRecs;
                                
                                console.info(message); //gives an info message with an 'i' in front of the message
                                
                                return paginatestring;
                }
                
                 
                 
                function getalignstyle(column_align_arr,column_align_arr_index) {
                                var alignclass=pub.cell_align_left_style; //default to left
                                if (column_align_arr_index < column_align_arr.length) {
                                                var align_flag=column_align_arr[column_align_arr_index];
                                                if (align_flag==2)
                                                                alignclass=pub.cell_align_right_style;
                                                if (align_flag==1)              
                                                                alignclass=pub.cell_align_center_style;
                                }
                                return   alignclass;
                }
                
                 
                return pub; 
}());





