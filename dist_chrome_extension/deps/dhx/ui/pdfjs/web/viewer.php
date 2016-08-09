<!DOCTYPE html>
<html dir="ltr" mozdisallowselectionprint moznomarginboxes>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <meta name="google" content="notranslate">
    <title>PDF</title>
    <link rel="stylesheet" href="viewer.css"/>
    <link rel="resource" type="application/l10n" href="locale.properties"/>

	<script src="../../../shim.js"></script>
	<script src="../../../dhx.js"></script>
    <script src="../../../dhx.Request.js"></script>
    
    <script src="../../../dhx.ui.js"></script>
    <script src="../../../shim.js"></script>
    <script src="functions.js"></script>
    <script>
		var DEFAULT_URL = '<?php echo $_GET['pdf_name']; ?>';
		var DEFAULT_SCALE_DELTA = 1.1;
		var MIN_SCALE = 0.25;
		var MAX_SCALE = 10.0;
		var VIEW_HISTORY_MEMORY = 20;
		var SCALE_SELECT_CONTAINER_PADDING = 8;
		var SCALE_SELECT_PADDING = 22;
		var PAGE_NUMBER_LOADING_INDICATOR = 'visiblePageIsLoading';
		var DISABLE_AUTO_FETCH_LOADING_BAR_TIMEOUT = 5000;
		var mozL10n = document.mozL10n || document.webL10n;
		var PDFViewerApplication = null;
		var str_template = '';
	 	document.addEventListener('DOMContentLoaded', function (event) {
			if (window.location.host.indexOf('web2.eti.br') != -1) {
				$dhx.environment = "test";
				$dhx.ui.cdn_address = '//mac.web2.eti.br/';
			}
			else {
				$dhx.environment = "production";
			}
			var dependencies = [
				$dhx.ui.cdn_address + "dhx/ui/pdfjs/external/webL10n/l10n.js"
				, $dhx.ui.cdn_address + "dhx/ui/pdfjs/src/shared/util.js"
				, $dhx.ui.cdn_address + "dhx/ui/pdfjs/src/display/api.js"
				, $dhx.ui.cdn_address + "dhx/ui/pdfjs/src/display/metadata.js"
				, $dhx.ui.cdn_address + "dhx/ui/pdfjs/src/display/canvas.js"
				, $dhx.ui.cdn_address + "dhx/ui/pdfjs/src/display/webgl.js"
				, $dhx.ui.cdn_address + "dhx/ui/pdfjs/src/display/pattern_helper.js"
				, $dhx.ui.cdn_address + "dhx/ui/pdfjs/src/display/font_loader.js"
				, $dhx.ui.cdn_address + "dhx/ui/pdfjs/src/display/annotation_helper.js"
				, $dhx.ui.cdn_address + "dhx/ui/pdfjs/web/ui_utils.js"
				, $dhx.ui.cdn_address + "dhx/ui/pdfjs/web/default_preferences.js"
				, $dhx.ui.cdn_address + "dhx/ui/pdfjs/web/preferences.js"
				, $dhx.ui.cdn_address + "dhx/ui/pdfjs/web/download_manager.js"
				, $dhx.ui.cdn_address + "dhx/ui/pdfjs/web/view_history.js"
				, $dhx.ui.cdn_address + "dhx/ui/pdfjs/web/pdf_rendering_queue.js"
				, $dhx.ui.cdn_address + "dhx/ui/pdfjs/web/pdf_page_view.js"
				, $dhx.ui.cdn_address + "dhx/ui/pdfjs/web/text_layer_builder.js"
				, $dhx.ui.cdn_address + "dhx/ui/pdfjs/web/annotations_layer_builder.js"
				, $dhx.ui.cdn_address + "dhx/ui/pdfjs/web/pdf_viewer.js"
				, $dhx.ui.cdn_address + "dhx/ui/pdfjs/web/pdf_thumbnail_view.js"
				, $dhx.ui.cdn_address + "dhx/ui/pdfjs/web/pdf_thumbnail_viewer.js"
				, $dhx.ui.cdn_address + "dhx/ui/pdfjs/web/pdf_outline_view.js"
				, $dhx.ui.cdn_address + "dhx/ui/pdfjs/web/pdf_attachment_view.js"
				, $dhx.ui.cdn_address + "dhx/ui/pdfjs/web/pdf_find_bar.js"
				, $dhx.ui.cdn_address + "dhx/ui/pdfjs/web/pdf_find_controller.js"
				, $dhx.ui.cdn_address + "dhx/ui/pdfjs/web/pdf_history.js"
				, $dhx.ui.cdn_address + "dhx/ui/pdfjs/web/secondary_toolbar.js"
				, $dhx.ui.cdn_address + "dhx/ui/pdfjs/web/pdf_presentation_mode.js"
				, $dhx.ui.cdn_address + "dhx/ui/pdfjs/web/grab_to_pan.js"
				, $dhx.ui.cdn_address + "dhx/ui/pdfjs/web/hand_tool.js"
				, $dhx.ui.cdn_address + "dhx/ui/pdfjs/web/overlay_manager.js"
				, $dhx.ui.cdn_address + "dhx/ui/pdfjs/web/password_prompt.js"
				, $dhx.ui.cdn_address + "dhx/ui/pdfjs/web/pdf_document_properties.js"
				, $dhx.ui.cdn_address + "dhx/ui/pdfjs/web/debugger.js"
				, $dhx.ui.cdn_address + "dhx/ui/pdfjs/web/appPDF.js"
			];
			$dhx.ui.require(dependencies, function () {
				PDFJS.workerSrc = '../src/worker_loader.js';
				PDFJS.imageResourcesPath = './images/';
				PDFJS.cMapUrl = '../external/bcmaps/';
				PDFJS.cMapPacked = true;
				mozL10n = document.mozL10n || document.webL10n;
				appPDF();
				(function animationStartedClosure() {
					PDFViewerApplication.animationStartedPromise = new Promise(
						function (resolve) {
							window.requestAnimationFrame(resolve);
					});
				})();
				document.body.innerHTML = str_template;
				webViewerLoad(event)
			});
		}, true);
    </script>
  </head>
  <body tabindex="1" class="loadingInProgress"></body>
</html>