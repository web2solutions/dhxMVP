$dhx.ui.viewer={pdf:function(e){var t=document.createElement("div");t.style.height="100%",t.style.width="100%",t.id=(new Date).getTime();var i=new $dhx.ui.window({id:(new Date).getTime()-1e3,left:100,top:100,width:800,height:500});i.button("park").hide(),i.button("stick").hide(),i.setText("PDF preview - "+e);var d=i.attachStatusBar();d.setText("Press ctrl+p (cmd+p Mac) to print it"),document.body.appendChild(t);var a="form_"+t.id;t.innerHTML='<iframe name="pdfFrame" width="100%" height="100%" frameborder="0"></iframe><form style="display:none;" id="'+a+'" method="post" action="'+$dhx.ui.cdn_address+"dhx/ui/pdfjs/web/viewer.php?pdf_name="+e+'" accept-charset="utf-8"  enctype="application/x-www-form-urlencoded" target="pdfFrame"></form>',i.attachObject(t.id),document.getElementById(a).submit()},image:function(e){var t=document.createElement("div");t.style.height="100%",t.style.width="100%",t.id=(new Date).getTime();var i=new $dhx.ui.window({id:(new Date).getTime()-1e3,left:100,top:100,width:800,height:500});i.button("park").hide(),i.button("stick").hide(),i.setText("Image preview - "+e);var d=i.attachStatusBar();d.setText("Press ctrl+p (cmd+p Mac) to print it"),document.body.appendChild(t);"form_"+t.id;t.innerHTML='<iframe src="'+e+'" name="imageFrame'+e+'" width="100%" height="100%" frameborder="0"></iframe>',i.attachObject(t.id)}};