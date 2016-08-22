/*global $dhx, dhtmlx */

$dhx.ui.viewer = {
	pdf : function( path ){
		var y = document.createElement("div");
			y.style.height = "100%";
			y.style.width = "100%";

			y.id = new Date().getTime();
			var dhx_pdf_window = new $dhx.ui.window({
				id: new Date().getTime() - 1000,
				left: 100,
				top: 100,
				width: 800,
				height: 500
			});
			dhx_pdf_window.button('park').hide();
			//dhx_pdf_window.button('minmax').hide();
			dhx_pdf_window.button('stick').hide();
			dhx_pdf_window.setText("PDF preview - " + path);
			var dhx_pdf_status_bar = dhx_pdf_window.attachStatusBar();
			dhx_pdf_status_bar.setText('Press ctrl+p (cmd+p Mac) to print it');
			//y.style.display = "none";
			document.body.appendChild(y);
			var m = "form_" + y.id;
			y.innerHTML = '<iframe name="pdfFrame" width="100%" height="100%" frameborder="0"></iframe><form style="display:none;" id="' + m +
				'" method="post" action="' + $dhx.ui.cdn_address + 'dhx/ui/pdfjs/web/viewer.php?pdf_name=' + path + '" accept-charset="utf-8"  enctype="application/x-www-form-urlencoded" target="pdfFrame"></form>';
			dhx_pdf_window.attachObject(y.id);
			//document.getElementById(m).firstChild.value = encodeURIComponent(A(r).replace("\u2013", "-") + g() + s());
			document.getElementById(m).submit();
	},
	image : function( path ){
		var y = document.createElement("div");
			y.style.height = "100%";
			y.style.width = "100%";

			y.id = new Date().getTime();
			var dhx_pdf_window = new $dhx.ui.window({
				id: new Date().getTime() - 1000,
				left: 100,
				top: 100,
				width: 800,
				height: 500
			});
			dhx_pdf_window.button('park').hide();
			//dhx_pdf_window.button('minmax').hide();
			dhx_pdf_window.button('stick').hide();
			dhx_pdf_window.setText("Image preview - " + path);
			var dhx_pdf_status_bar = dhx_pdf_window.attachStatusBar();
			dhx_pdf_status_bar.setText('Press ctrl+p (cmd+p Mac) to print it');
			//y.style.display = "none";
			document.body.appendChild(y);
			var m = "form_" + y.id;
			y.innerHTML = '<iframe src="' + path + '" name="imageFrame' + path + '" width="100%" height="100%" frameborder="0"></iframe>';
			dhx_pdf_window.attachObject(y.id);
			//document.getElementById(m).firstChild.value = encodeURIComponent(A(r).replace("\u2013", "-") + g() + s());
			//document.getElementById(m).submit();
	}
};

