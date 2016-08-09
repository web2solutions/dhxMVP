
function appPDF(){
		  PDFViewerApplication = {
		  initialBookmark: document.location.hash.substring(1),
		  initialized: false,
		  fellback: false,
		  pdfDocument: null,
		  sidebarOpen: false,
		  printing: false,
		  /** @type {PDFViewer} */
		  pdfViewer: null,
		  /** @type {PDFThumbnailViewer} */
		  pdfThumbnailViewer: null,
		  /** @type {PDFRenderingQueue} */
		  pdfRenderingQueue: null,
		  /** @type {PDFPresentationMode} */
		  pdfPresentationMode: null,
		  /** @type {PDFDocumentProperties} */
		  pdfDocumentProperties: null,
		  pageRotation: 0,
		  updateScaleControls: true,
		  isInitialViewSet: false,
		  animationStartedPromise: null,
		  preferenceSidebarViewOnLoad: SidebarView.NONE,
		  preferencePdfBugEnabled: false,
		  preferenceShowPreviousViewOnLoad: true,
		  preferenceDefaultZoomValue: '',
		  isViewerEmbedded: (window.parent !== window),
		  url: '',
		
		  // called once when the document is loaded
		  initialize: function pdfViewInitialize() {
			var pdfRenderingQueue = new PDFRenderingQueue();
			pdfRenderingQueue.onIdle = this.cleanup.bind(this);
			this.pdfRenderingQueue = pdfRenderingQueue;
		
			var container = document.getElementById('viewerContainer');
			var viewer = document.getElementById('viewer');
			this.pdfViewer = new PDFViewer({
			  container: container,
			  viewer: viewer,
			  renderingQueue: pdfRenderingQueue,
			  linkService: this
			});
			pdfRenderingQueue.setViewer(this.pdfViewer);
		
			var thumbnailContainer = document.getElementById('thumbnailView');
			this.pdfThumbnailViewer = new PDFThumbnailViewer({
			  container: thumbnailContainer,
			  renderingQueue: pdfRenderingQueue,
			  linkService: this
			});
			pdfRenderingQueue.setThumbnailViewer(this.pdfThumbnailViewer);
		
			Preferences.initialize();
		
			this.findController = new PDFFindController({
			  pdfViewer: this.pdfViewer,
			  integratedFind: this.supportsIntegratedFind
			});
			this.pdfViewer.setFindController(this.findController);
		
			this.findBar = new PDFFindBar({
			  bar: document.getElementById('findbar'),
			  toggleButton: document.getElementById('viewFind'),
			  findField: document.getElementById('findInput'),
			  highlightAllCheckbox: document.getElementById('findHighlightAll'),
			  caseSensitiveCheckbox: document.getElementById('findMatchCase'),
			  findMsg: document.getElementById('findMsg'),
			  findStatusIcon: document.getElementById('findStatusIcon'),
			  findPreviousButton: document.getElementById('findPrevious'),
			  findNextButton: document.getElementById('findNext'),
			  findController: this.findController
			});
		
			this.findController.setFindBar(this.findBar);
		
			HandTool.initialize({
			  container: container,
			  toggleHandTool: document.getElementById('toggleHandTool')
			});
		
			this.pdfDocumentProperties = new PDFDocumentProperties({
			  overlayName: 'documentPropertiesOverlay',
			  closeButton: document.getElementById('documentPropertiesClose'),
			  fields: {
				'fileName': document.getElementById('fileNameField'),
				'fileSize': document.getElementById('fileSizeField'),
				'title': document.getElementById('titleField'),
				'author': document.getElementById('authorField'),
				'subject': document.getElementById('subjectField'),
				'keywords': document.getElementById('keywordsField'),
				'creationDate': document.getElementById('creationDateField'),
				'modificationDate': document.getElementById('modificationDateField'),
				'creator': document.getElementById('creatorField'),
				'producer': document.getElementById('producerField'),
				'version': document.getElementById('versionField'),
				'pageCount': document.getElementById('pageCountField')
			  }
			});
		
			SecondaryToolbar.initialize({
			  toolbar: document.getElementById('secondaryToolbar'),
			  toggleButton: document.getElementById('secondaryToolbarToggle'),
			  presentationModeButton:
				document.getElementById('secondaryPresentationMode'),
			  openFile: document.getElementById('secondaryOpenFile'),
			  print: document.getElementById('secondaryPrint'),
			  download: document.getElementById('secondaryDownload'),
			  viewBookmark: document.getElementById('secondaryViewBookmark'),
			  firstPage: document.getElementById('firstPage'),
			  lastPage: document.getElementById('lastPage'),
			  pageRotateCw: document.getElementById('pageRotateCw'),
			  pageRotateCcw: document.getElementById('pageRotateCcw'),
			  documentPropertiesButton: document.getElementById('documentProperties')
			});
		
			if (this.supportsFullscreen) {
			  var toolbar = SecondaryToolbar;
			  this.pdfPresentationMode = new PDFPresentationMode({
				container: container,
				viewer: viewer,
				pdfThumbnailViewer: this.pdfThumbnailViewer,
				contextMenuItems: [
				  { element: document.getElementById('contextFirstPage'),
					handler: toolbar.firstPageClick.bind(toolbar) },
				  { element: document.getElementById('contextLastPage'),
					handler: toolbar.lastPageClick.bind(toolbar) },
				  { element: document.getElementById('contextPageRotateCw'),
					handler: toolbar.pageRotateCwClick.bind(toolbar) },
				  { element: document.getElementById('contextPageRotateCcw'),
					handler: toolbar.pageRotateCcwClick.bind(toolbar) }
				]
			  });
			}
		
			PasswordPrompt.initialize({
			  overlayName: 'passwordOverlay',
			  passwordField: document.getElementById('password'),
			  passwordText: document.getElementById('passwordText'),
			  passwordSubmit: document.getElementById('passwordSubmit'),
			  passwordCancel: document.getElementById('passwordCancel')
			});
		
			var self = this;
			var initializedPromise = Promise.all([
			  Preferences.get('enableWebGL').then(function resolved(value) {
				PDFJS.disableWebGL = !value;
			  }),
			  Preferences.get('sidebarViewOnLoad').then(function resolved(value) {
				self.preferenceSidebarViewOnLoad = value;
			  }),
			  Preferences.get('pdfBugEnabled').then(function resolved(value) {
				self.preferencePdfBugEnabled = value;
			  }),
			  Preferences.get('showPreviousViewOnLoad').then(function resolved(value) {
				self.preferenceShowPreviousViewOnLoad = value;
			  }),
			  Preferences.get('defaultZoomValue').then(function resolved(value) {
				self.preferenceDefaultZoomValue = value;
			  }),
			  Preferences.get('disableTextLayer').then(function resolved(value) {
				if (PDFJS.disableTextLayer === true) {
				  return;
				}
				PDFJS.disableTextLayer = value;
			  }),
			  Preferences.get('disableRange').then(function resolved(value) {
				if (PDFJS.disableRange === true) {
				  return;
				}
				PDFJS.disableRange = value;
			  }),
			  Preferences.get('disableAutoFetch').then(function resolved(value) {
				PDFJS.disableAutoFetch = value;
			  }),
			  Preferences.get('disableFontFace').then(function resolved(value) {
				if (PDFJS.disableFontFace === true) {
				  return;
				}
				PDFJS.disableFontFace = value;
			  }),
			  Preferences.get('useOnlyCssZoom').then(function resolved(value) {
				PDFJS.useOnlyCssZoom = value;
			  })
			  // TODO move more preferences and other async stuff here
			]).catch(function (reason) { });
		
			return initializedPromise.then(function () {
			  PDFViewerApplication.initialized = true;
			});
		  },
		
		  zoomIn: function pdfViewZoomIn(ticks) {
			var newScale = this.pdfViewer.currentScale;
			do {
			  newScale = (newScale * DEFAULT_SCALE_DELTA).toFixed(2);
			  newScale = Math.ceil(newScale * 10) / 10;
			  newScale = Math.min(MAX_SCALE, newScale);
			} while (--ticks > 0 && newScale < MAX_SCALE);
			this.setScale(newScale, true);
		  },
		
		  zoomOut: function pdfViewZoomOut(ticks) {
			var newScale = this.pdfViewer.currentScale;
			do {
			  newScale = (newScale / DEFAULT_SCALE_DELTA).toFixed(2);
			  newScale = Math.floor(newScale * 10) / 10;
			  newScale = Math.max(MIN_SCALE, newScale);
			} while (--ticks > 0 && newScale > MIN_SCALE);
			this.setScale(newScale, true);
		  },
		
		  get currentScaleValue() {
			return this.pdfViewer.currentScaleValue;
		  },
		
		  get pagesCount() {
			return this.pdfDocument.numPages;
		  },
		
		  set page(val) {
			this.pdfViewer.currentPageNumber = val;
		  },
		
		  get page() {
			return this.pdfViewer.currentPageNumber;
		  },
		
		  get supportsPrinting() {
			var canvas = document.createElement('canvas');
			var value = 'mozPrintCallback' in canvas;
		
			return PDFJS.shadow(this, 'supportsPrinting', value);
		  },
		
		  get supportsFullscreen() {
			var doc = document.documentElement;
			var support = !!(doc.requestFullscreen || doc.mozRequestFullScreen ||
							 doc.webkitRequestFullScreen || doc.msRequestFullscreen);
		
			if (document.fullscreenEnabled === false ||
				document.mozFullScreenEnabled === false ||
				document.webkitFullscreenEnabled === false ||
				document.msFullscreenEnabled === false) {
			  support = false;
			}
			if (support && PDFJS.disableFullscreen === true) {
			  support = false;
			}
		
			return PDFJS.shadow(this, 'supportsFullscreen', support);
		  },
		
		  get supportsIntegratedFind() {
			var support = false;
		//#if (FIREFOX || MOZCENTRAL)
		//  support = FirefoxCom.requestSync('supportsIntegratedFind');
		//#endif
		
			return PDFJS.shadow(this, 'supportsIntegratedFind', support);
		  },
		
		  get supportsDocumentFonts() {
			var support = true;
		//#if (FIREFOX || MOZCENTRAL)
		//  support = FirefoxCom.requestSync('supportsDocumentFonts');
		//#endif
		
			return PDFJS.shadow(this, 'supportsDocumentFonts', support);
		  },
		
		  get supportsDocumentColors() {
			var support = true;
		//#if (FIREFOX || MOZCENTRAL)
		//  support = FirefoxCom.requestSync('supportsDocumentColors');
		//#endif
		
			return PDFJS.shadow(this, 'supportsDocumentColors', support);
		  },
		
		  get loadingBar() {
			var bar = new ProgressBar('#loadingBar', {});
		
			return PDFJS.shadow(this, 'loadingBar', bar);
		  },
		
		//#if (FIREFOX || MOZCENTRAL)
		  initPassiveLoading: function pdfViewInitPassiveLoading() {
			function FirefoxComDataRangeTransport(length, initialData) {
			  PDFJS.PDFDataRangeTransport.call(this, length, initialData);
			}
			FirefoxComDataRangeTransport.prototype =
			  Object.create(PDFJS.PDFDataRangeTransport.prototype);
			FirefoxComDataRangeTransport.prototype.requestDataRange =
				function FirefoxComDataRangeTransport_requestDataRange(begin, end) {
			  FirefoxCom.request('requestDataRange', { begin: begin, end: end });
			};
		
			var pdfDataRangeTransport;
		
			window.addEventListener('message', function windowMessage(e) {
			  if (e.source !== null) {
				// The message MUST originate from Chrome code.
				console.warn('Rejected untrusted message from ' + e.origin);
				return;
			  }
			  var args = e.data;
		
			  if (typeof args !== 'object' || !('pdfjsLoadAction' in args)) {
				return;
			  }
			  switch (args.pdfjsLoadAction) {
				case 'supportsRangedLoading':
				  pdfDataRangeTransport =
					new FirefoxComDataRangeTransport(args.length, args.data);
		
				  PDFViewerApplication.open(args.pdfUrl, 0, undefined,
											pdfDataRangeTransport);
		
				  if (args.length) {
					PDFViewerApplication.pdfDocumentProperties
										.setFileSize(args.length);
				  }
				  break;
				case 'range':
				  pdfDataRangeTransport.onDataRange(args.begin, args.chunk);
				  break;
				case 'rangeProgress':
				  pdfDataRangeTransport.onDataProgress(args.loaded);
				  break;
				case 'progressiveRead':
				  pdfDataRangeTransport.onDataProgressiveRead(args.chunk);
				  break;
				case 'progress':
				  PDFViewerApplication.progress(args.loaded / args.total);
				  break;
				case 'complete':
				  if (!args.data) {
					PDFViewerApplication.error(mozL10n.get('loading_error', null,
					  'An error occurred while loading the PDF.'), e);
					break;
				  }
				  PDFViewerApplication.open(args.data, 0);
				  break;
			  }
			});
			FirefoxCom.requestSync('initPassiveLoading', null);
		  },
		//#endif
		
		  setTitleUsingUrl: function pdfViewSetTitleUsingUrl(url) {
			this.url = url;
			try {
			  this.setTitle(decodeURIComponent(getFileName(url)) || url);
			} catch (e) {
			  // decodeURIComponent may throw URIError,
			  // fall back to using the unprocessed url in that case
			  this.setTitle(url);
			}
		  },
		
		  setTitle: function pdfViewSetTitle(title) {
			if (this.isViewerEmbedded) {
			  // Embedded PDF viewers should not be changing their parent page's title.
			  return;
			}
			document.title = title;
		//#if B2G
		//  document.getElementById('activityTitle').textContent = title;
		//#endif
		  },
		
		  close: function pdfViewClose() {
			var errorWrapper = document.getElementById('errorWrapper');
			errorWrapper.setAttribute('hidden', 'true');
		
			if (!this.pdfDocument) {
			  return;
			}
		
			this.pdfDocument.destroy();
			this.pdfDocument = null;
		
			this.pdfThumbnailViewer.setDocument(null);
			this.pdfViewer.setDocument(null);
		
			if (typeof PDFBug !== 'undefined') {
			  PDFBug.cleanup();
			}
		  },
		
		  // TODO(mack): This function signature should really be pdfViewOpen(url, args)
		  open: function pdfViewOpen(file, scale, password,
									 pdfDataRangeTransport, args) {
			if (this.pdfDocument) {
			  // Reload the preferences if a document was previously opened.
			  Preferences.reload();
			}
			this.close();
		
			var parameters = {password: password};
			if (typeof file === 'string') { // URL
			  this.setTitleUsingUrl(file);
			  parameters.url = file;
			} else if (file && 'byteLength' in file) { // ArrayBuffer
			  parameters.data = file;
			} else if (file.url && file.originalUrl) {
			  this.setTitleUsingUrl(file.originalUrl);
			  parameters.url = file.url;
			}
			if (args) {
			  for (var prop in args) {
				parameters[prop] = args[prop];
			  }
			}
		
			var self = this;
			self.loading = true;
			self.downloadComplete = false;
		
			var passwordNeeded = function passwordNeeded(updatePassword, reason) {
			  PasswordPrompt.updatePassword = updatePassword;
			  PasswordPrompt.reason = reason;
			  PasswordPrompt.open();
			};
		
			function getDocumentProgress(progressData) {
			  self.progress(progressData.loaded / progressData.total);
			}
		
			PDFJS.getDocument(parameters, pdfDataRangeTransport, passwordNeeded,
							  getDocumentProgress).then(
			  function getDocumentCallback(pdfDocument) {
				self.load(pdfDocument, scale);
				self.loading = false;
			  },
			  function getDocumentError(exception) {
				var message = exception && exception.message;
				var loadingErrorMessage = mozL10n.get('loading_error', null,
				  'An error occurred while loading the PDF.');
		
				if (exception instanceof PDFJS.InvalidPDFException) {
				  // change error message also for other builds
				  loadingErrorMessage = mozL10n.get('invalid_file_error', null,
													'Invalid or corrupted PDF file.');
				} else if (exception instanceof PDFJS.MissingPDFException) {
				  // special message for missing PDF's
				  loadingErrorMessage = mozL10n.get('missing_file_error', null,
													'Missing PDF file.');
				} else if (exception instanceof PDFJS.UnexpectedResponseException) {
				  loadingErrorMessage = mozL10n.get('unexpected_response_error', null,
													'Unexpected server response.');
				}
		//#if B2G
		//      window.alert(loadingErrorMessage);
		//      return window.close();
		//#endif
		
				var moreInfo = {
				  message: message
				};
				self.error(loadingErrorMessage, moreInfo);
				self.loading = false;
			  }
			);
		
			if (args && args.length) {
			  PDFViewerApplication.pdfDocumentProperties.setFileSize(args.length);
			}
		  },
		
		  download: function pdfViewDownload() {
			function downloadByUrl() {
			  downloadManager.downloadUrl(url, filename);
			}
		
			var url = this.url.split('#')[0];
			var filename = getPDFFileNameFromURL(url);
			var downloadManager = new DownloadManager();
			downloadManager.onerror = function (err) {
			  // This error won't really be helpful because it's likely the
			  // fallback won't work either (or is already open).
			  PDFViewerApplication.error('PDF failed to download.');
			};
		
			if (!this.pdfDocument) { // the PDF is not ready yet
			  downloadByUrl();
			  return;
			}
		
			if (!this.downloadComplete) { // the PDF is still downloading
			  downloadByUrl();
			  return;
			}
		
			this.pdfDocument.getData().then(
			  function getDataSuccess(data) {
				var blob = PDFJS.createBlob(data, 'application/pdf');
				downloadManager.download(blob, url, filename);
			  },
			  downloadByUrl // Error occurred try downloading with just the url.
			).then(null, downloadByUrl);
		  },
		
		  fallback: function pdfViewFallback(featureId) {
		//#if !PRODUCTION
			if (true) {
			  return;
			}
		//#endif
		//#if (FIREFOX || MOZCENTRAL)
			// Only trigger the fallback once so we don't spam the user with messages
			// for one PDF.
			if (this.fellback) {
			  return;
			}
			this.fellback = true;
			var url = this.url.split('#')[0];
			FirefoxCom.request('fallback', { featureId: featureId, url: url },
			  function response(download) {
				if (!download) {
				  return;
				}
				PDFViewerApplication.download();
			  });
		//#endif
		  },
		
		  navigateTo: function pdfViewNavigateTo(dest) {
			var destString = '';
			var self = this;
		
			var goToDestination = function(destRef) {
			  self.pendingRefStr = null;
			  // dest array looks like that: <page-ref> </XYZ|FitXXX> <args..>
			  var pageNumber = destRef instanceof Object ?
				self.pagesRefMap[destRef.num + ' ' + destRef.gen + ' R'] :
				(destRef + 1);
			  if (pageNumber) {
				if (pageNumber > self.pagesCount) {
				  pageNumber = self.pagesCount;
				}
				self.pdfViewer.scrollPageIntoView(pageNumber, dest);
		
				// Update the browsing history.
				PDFHistory.push({ dest: dest, hash: destString, page: pageNumber });
			  } else {
				self.pdfDocument.getPageIndex(destRef).then(function (pageIndex) {
				  var pageNum = pageIndex + 1;
				  self.pagesRefMap[destRef.num + ' ' + destRef.gen + ' R'] = pageNum;
				  goToDestination(destRef);
				});
			  }
			};
		
			var destinationPromise;
			if (typeof dest === 'string') {
			  destString = dest;
			  destinationPromise = this.pdfDocument.getDestination(dest);
			} else {
			  destinationPromise = Promise.resolve(dest);
			}
			destinationPromise.then(function(destination) {
			  dest = destination;
			  if (!(destination instanceof Array)) {
				return; // invalid destination
			  }
			  goToDestination(destination[0]);
			});
		  },
		
		  executeNamedAction: function pdfViewExecuteNamedAction(action) {
			// See PDF reference, table 8.45 - Named action
			switch (action) {
			  case 'GoToPage':
				document.getElementById('pageNumber').focus();
				break;
		
			  case 'GoBack':
				PDFHistory.back();
				break;
		
			  case 'GoForward':
				PDFHistory.forward();
				break;
		
			  case 'Find':
				if (!this.supportsIntegratedFind) {
				  this.findBar.toggle();
				}
				break;
		
			  case 'NextPage':
				this.page++;
				break;
		
			  case 'PrevPage':
				this.page--;
				break;
		
			  case 'LastPage':
				this.page = this.pagesCount;
				break;
		
			  case 'FirstPage':
				this.page = 1;
				break;
		
			  default:
				break; // No action according to spec
			}
		  },
		
		  getDestinationHash: function pdfViewGetDestinationHash(dest) {
			if (typeof dest === 'string') {
			  return this.getAnchorUrl('#' + escape(dest));
			}
			if (dest instanceof Array) {
			  var destRef = dest[0]; // see navigateTo method for dest format
			  var pageNumber = destRef instanceof Object ?
				this.pagesRefMap[destRef.num + ' ' + destRef.gen + ' R'] :
				(destRef + 1);
			  if (pageNumber) {
				var pdfOpenParams = this.getAnchorUrl('#page=' + pageNumber);
				var destKind = dest[1];
				if (typeof destKind === 'object' && 'name' in destKind &&
					destKind.name === 'XYZ') {
				  var scale = (dest[4] || this.currentScaleValue);
				  var scaleNumber = parseFloat(scale);
				  if (scaleNumber) {
					scale = scaleNumber * 100;
				  }
				  pdfOpenParams += '&zoom=' + scale;
				  if (dest[2] || dest[3]) {
					pdfOpenParams += ',' + (dest[2] || 0) + ',' + (dest[3] || 0);
				  }
				}
				return pdfOpenParams;
			  }
			}
			return '';
		  },
		
		  /**
		   * Prefix the full url on anchor links to make sure that links are resolved
		   * relative to the current URL instead of the one defined in <base href>.
		   * @param {String} anchor The anchor hash, including the #.
		   */
		  getAnchorUrl: function getAnchorUrl(anchor) {
		//#if (GENERIC || B2G)
			return anchor;
		//#endif
		//#if (FIREFOX || MOZCENTRAL)
		//  return this.url.split('#')[0] + anchor;
		//#endif
		//#if CHROME
		//  return location.href.split('#')[0] + anchor;
		//#endif
		  },
		
		  /**
		   * Show the error box.
		   * @param {String} message A message that is human readable.
		   * @param {Object} moreInfo (optional) Further information about the error
		   *                            that is more technical.  Should have a 'message'
		   *                            and optionally a 'stack' property.
		   */
		  error: function pdfViewError(message, moreInfo) {
			var moreInfoText = mozL10n.get('error_version_info',
			  {version: PDFJS.version || '?', build: PDFJS.build || '?'},
			  'PDF.js v{{version}} (build: {{build}})') + '\n';
			if (moreInfo) {
			  moreInfoText +=
				mozL10n.get('error_message', {message: moreInfo.message},
				'Message: {{message}}');
			  if (moreInfo.stack) {
				moreInfoText += '\n' +
				  mozL10n.get('error_stack', {stack: moreInfo.stack},
				  'Stack: {{stack}}');
			  } else {
				if (moreInfo.filename) {
				  moreInfoText += '\n' +
					mozL10n.get('error_file', {file: moreInfo.filename},
					'File: {{file}}');
				}
				if (moreInfo.lineNumber) {
				  moreInfoText += '\n' +
					mozL10n.get('error_line', {line: moreInfo.lineNumber},
					'Line: {{line}}');
				}
			  }
			}
		
		//#if !(FIREFOX || MOZCENTRAL)
			var errorWrapper = document.getElementById('errorWrapper');
			errorWrapper.removeAttribute('hidden');
		
			var errorMessage = document.getElementById('errorMessage');
			errorMessage.textContent = message;
		
			var closeButton = document.getElementById('errorClose');
			closeButton.onclick = function() {
			  errorWrapper.setAttribute('hidden', 'true');
			};
		
			var errorMoreInfo = document.getElementById('errorMoreInfo');
			var moreInfoButton = document.getElementById('errorShowMore');
			var lessInfoButton = document.getElementById('errorShowLess');
			moreInfoButton.onclick = function() {
			  errorMoreInfo.removeAttribute('hidden');
			  moreInfoButton.setAttribute('hidden', 'true');
			  lessInfoButton.removeAttribute('hidden');
			  errorMoreInfo.style.height = errorMoreInfo.scrollHeight + 'px';
			};
			lessInfoButton.onclick = function() {
			  errorMoreInfo.setAttribute('hidden', 'true');
			  moreInfoButton.removeAttribute('hidden');
			  lessInfoButton.setAttribute('hidden', 'true');
			};
			moreInfoButton.oncontextmenu = noContextMenuHandler;
			lessInfoButton.oncontextmenu = noContextMenuHandler;
			closeButton.oncontextmenu = noContextMenuHandler;
			moreInfoButton.removeAttribute('hidden');
			lessInfoButton.setAttribute('hidden', 'true');
			errorMoreInfo.value = moreInfoText;
		//#else
		//  console.error(message + '\n' + moreInfoText);
		//  this.fallback();
		//#endif
		  },
		
		  progress: function pdfViewProgress(level) {
			var percent = Math.round(level * 100);
			// When we transition from full request to range requests, it's possible
			// that we discard some of the loaded data. This can cause the loading
			// bar to move backwards. So prevent this by only updating the bar if it
			// increases.
			if (percent > this.loadingBar.percent || isNaN(percent)) {
			  this.loadingBar.percent = percent;
		
			  // When disableAutoFetch is enabled, it's not uncommon for the entire file
			  // to never be fetched (depends on e.g. the file structure). In this case
			  // the loading bar will not be completely filled, nor will it be hidden.
			  // To prevent displaying a partially filled loading bar permanently, we
			  // hide it when no data has been loaded during a certain amount of time.
			  if (PDFJS.disableAutoFetch && percent) {
				if (this.disableAutoFetchLoadingBarTimeout) {
				  clearTimeout(this.disableAutoFetchLoadingBarTimeout);
				  this.disableAutoFetchLoadingBarTimeout = null;
				}
				this.loadingBar.show();
		
				this.disableAutoFetchLoadingBarTimeout = setTimeout(function () {
				  this.loadingBar.hide();
				  this.disableAutoFetchLoadingBarTimeout = null;
				}.bind(this), DISABLE_AUTO_FETCH_LOADING_BAR_TIMEOUT);
			  }
			}
		  },
		
		  load: function pdfViewLoad(pdfDocument, scale) {
			var self = this;
			scale = scale || UNKNOWN_SCALE;
		
			this.findController.reset();
		
			this.pdfDocument = pdfDocument;
		
			this.pdfDocumentProperties.setDocumentAndUrl(pdfDocument, this.url);
		
			var downloadedPromise = pdfDocument.getDownloadInfo().then(function() {
			  self.downloadComplete = true;
			  self.loadingBar.hide();
			});
		
			var pagesCount = pdfDocument.numPages;
			document.getElementById('numPages').textContent =
			  mozL10n.get('page_of', {pageCount: pagesCount}, 'of {{pageCount}}');
			document.getElementById('pageNumber').max = pagesCount;
		
			var id = this.documentFingerprint = pdfDocument.fingerprint;
			var store = this.store = new ViewHistory(id);
		
			var pdfViewer = this.pdfViewer;
			pdfViewer.currentScale = scale;
			pdfViewer.setDocument(pdfDocument);
			var firstPagePromise = pdfViewer.firstPagePromise;
			var pagesPromise = pdfViewer.pagesPromise;
			var onePageRendered = pdfViewer.onePageRendered;
		
			this.pageRotation = 0;
			this.isInitialViewSet = false;
			this.pagesRefMap = pdfViewer.pagesRefMap;
		
			this.pdfThumbnailViewer.setDocument(pdfDocument);
		
			firstPagePromise.then(function(pdfPage) {
			  downloadedPromise.then(function () {
				var event = document.createEvent('CustomEvent');
				event.initCustomEvent('documentload', true, true, {});
				window.dispatchEvent(event);
			  });
		
			  self.loadingBar.setWidth(document.getElementById('viewer'));
		
			  if (!PDFJS.disableHistory && !self.isViewerEmbedded) {
				// The browsing history is only enabled when the viewer is standalone,
				// i.e. not when it is embedded in a web page.
				if (!self.preferenceShowPreviousViewOnLoad && window.history.state) {
				  window.history.replaceState(null, '');
				}
				PDFHistory.initialize(self.documentFingerprint, self);
			  }
		
			  store.initializedPromise.then(function resolved() {
				var storedHash = null;
				if (self.preferenceShowPreviousViewOnLoad &&
					store.get('exists', false)) {
				  var pageNum = store.get('page', '1');
				  var zoom = self.preferenceDefaultZoomValue ||
							 store.get('zoom', self.pdfViewer.currentScale);
				  var left = store.get('scrollLeft', '0');
				  var top = store.get('scrollTop', '0');
		
				  storedHash = 'page=' + pageNum + '&zoom=' + zoom + ',' +
							   left + ',' + top;
				} else if (self.preferenceDefaultZoomValue) {
				  storedHash = 'page=1&zoom=' + self.preferenceDefaultZoomValue;
				}
				self.setInitialView(storedHash, scale);
		
				// Make all navigation keys work on document load,
				// unless the viewer is embedded in a web page.
				if (!self.isViewerEmbedded) {
				  self.pdfViewer.focus();
				}
			  }, function rejected(reason) {
				console.error(reason);
				self.setInitialView(null, scale);
			  });
			});
		
			pagesPromise.then(function() {
			  if (self.supportsPrinting) {
				pdfDocument.getJavaScript().then(function(javaScript) {
				  if (javaScript.length) {
					console.warn('Warning: JavaScript is not supported');
					self.fallback(PDFJS.UNSUPPORTED_FEATURES.javaScript);
				  }
				  // Hack to support auto printing.
				  var regex = /\bprint\s*\(/g;
				  for (var i = 0, ii = javaScript.length; i < ii; i++) {
					var js = javaScript[i];
					if (js && regex.test(js)) {
					  setTimeout(function() {
						window.print();
					  });
					  return;
					}
				  }
				});
			  }
			});
		
			// outline depends on pagesRefMap
			var promises = [pagesPromise, this.animationStartedPromise];
			Promise.all(promises).then(function() {
			  pdfDocument.getOutline().then(function(outline) {
				var container = document.getElementById('outlineView');
				self.outline = new PDFOutlineView({
				  container: container,
				  outline: outline,
				  linkService: self
				});
				self.outline.render();
				document.getElementById('viewOutline').disabled = !outline;
		
				if (!outline && !container.classList.contains('hidden')) {
				  self.switchSidebarView('thumbs');
				}
				if (outline &&
					self.preferenceSidebarViewOnLoad === SidebarView.OUTLINE) {
				  self.switchSidebarView('outline', true);
				}
			  });
			  pdfDocument.getAttachments().then(function(attachments) {
				var container = document.getElementById('attachmentsView');
				self.attachments = new PDFAttachmentView({
				  container: container,
				  attachments: attachments,
				  downloadManager: new DownloadManager()
				});
				self.attachments.render();
				document.getElementById('viewAttachments').disabled = !attachments;
		
				if (!attachments && !container.classList.contains('hidden')) {
				  self.switchSidebarView('thumbs');
				}
				if (attachments &&
					self.preferenceSidebarViewOnLoad === SidebarView.ATTACHMENTS) {
				  self.switchSidebarView('attachments', true);
				}
			  });
			});
		
			if (self.preferenceSidebarViewOnLoad === SidebarView.THUMBS) {
			  Promise.all([firstPagePromise, onePageRendered]).then(function () {
				self.switchSidebarView('thumbs', true);
			  });
			}
		
			pdfDocument.getMetadata().then(function(data) {
			  var info = data.info, metadata = data.metadata;
			  self.documentInfo = info;
			  self.metadata = metadata;
		
			  // Provides some basic debug information
			  console.log('PDF ' + pdfDocument.fingerprint + ' [' +
						  info.PDFFormatVersion + ' ' + (info.Producer || '-').trim() +
						  ' / ' + (info.Creator || '-').trim() + ']' +
						  ' (PDF.js: ' + (PDFJS.version || '-') +
						  (!PDFJS.disableWebGL ? ' [WebGL]' : '') + ')');
		
			  var pdfTitle;
			  if (metadata && metadata.has('dc:title')) {
				var title = metadata.get('dc:title');
				// Ghostscript sometimes return 'Untitled', sets the title to 'Untitled'
				if (title !== 'Untitled') {
				  pdfTitle = title;
				}
			  }
		
			  if (!pdfTitle && info && info['Title']) {
				pdfTitle = info['Title'];
			  }
		
			  if (pdfTitle) {
				self.setTitle(pdfTitle + ' - ' + document.title);
			  }
		
			  if (info.IsAcroFormPresent) {
				console.warn('Warning: AcroForm/XFA is not supported');
				self.fallback(PDFJS.UNSUPPORTED_FEATURES.forms);
			  }
		
		//#if !PRODUCTION
			  if (true) {
				return;
			  }
		//#endif
		//#if (FIREFOX || MOZCENTRAL)
			  var versionId = String(info.PDFFormatVersion).slice(-1) | 0;
			  var generatorId = 0;
			  var KNOWN_GENERATORS = [
				'acrobat distiller', 'acrobat pdfwriter', 'adobe livecycle',
				'adobe pdf library', 'adobe photoshop', 'ghostscript', 'tcpdf',
				'cairo', 'dvipdfm', 'dvips', 'pdftex', 'pdfkit', 'itext', 'prince',
				'quarkxpress', 'mac os x', 'microsoft', 'openoffice', 'oracle',
				'luradocument', 'pdf-xchange', 'antenna house', 'aspose.cells', 'fpdf'
			  ];
			  if (info.Producer) {
				KNOWN_GENERATORS.some(function (generator, s, i) {
				  if (generator.indexOf(s) < 0) {
					return false;
				  }
				  generatorId = i + 1;
				  return true;
				}.bind(null, info.Producer.toLowerCase()));
			  }
			  var formType = !info.IsAcroFormPresent ? null : info.IsXFAPresent ?
							 'xfa' : 'acroform';
			  FirefoxCom.request('reportTelemetry', JSON.stringify({
				type: 'documentInfo',
				version: versionId,
				generator: generatorId,
				formType: formType
			  }));
		//#endif
			});
		  },
		
		  setInitialView: function pdfViewSetInitialView(storedHash, scale) {
			this.isInitialViewSet = true;
		
			// When opening a new file (when one is already loaded in the viewer):
			// Reset 'currentPageNumber', since otherwise the page's scale will be wrong
			// if 'currentPageNumber' is larger than the number of pages in the file.
			document.getElementById('pageNumber').value =
			  this.pdfViewer.currentPageNumber = 1;
		
			if (PDFHistory.initialDestination) {
			  this.navigateTo(PDFHistory.initialDestination);
			  PDFHistory.initialDestination = null;
			} else if (this.initialBookmark) {
			  this.setHash(this.initialBookmark);
			  PDFHistory.push({ hash: this.initialBookmark }, !!this.initialBookmark);
			  this.initialBookmark = null;
			} else if (storedHash) {
			  this.setHash(storedHash);
			} else if (scale) {
			  this.setScale(scale, true);
			  this.page = 1;
			}
		
			if (this.pdfViewer.currentScale === UNKNOWN_SCALE) {
			  // Scale was not initialized: invalid bookmark or scale was not specified.
			  // Setting the default one.
			  this.setScale(DEFAULT_SCALE, true);
			}
		  },
		
		  cleanup: function pdfViewCleanup() {
			this.pdfViewer.cleanup();
			this.pdfThumbnailViewer.cleanup();
			this.pdfDocument.cleanup();
		  },
		
		  forceRendering: function pdfViewForceRendering() {
			this.pdfRenderingQueue.printing = this.printing;
			this.pdfRenderingQueue.isThumbnailViewEnabled = this.sidebarOpen;
			this.pdfRenderingQueue.renderHighestPriority();
		  },
		
		  setHash: function pdfViewSetHash(hash) {
			if (!this.isInitialViewSet) {
			  this.initialBookmark = hash;
			  return;
			}
			if (!hash) {
			  return;
			}
		
			if (hash.indexOf('=') >= 0) {
			  var params = this.parseQueryString(hash);
			  // borrowing syntax from "Parameters for Opening PDF Files"
			  if ('nameddest' in params) {
				PDFHistory.updateNextHashParam(params.nameddest);
				this.navigateTo(params.nameddest);
				return;
			  }
			  var pageNumber, dest;
			  if ('page' in params) {
				pageNumber = (params.page | 0) || 1;
			  }
			  if ('zoom' in params) {
				// Build the destination array.
				var zoomArgs = params.zoom.split(','); // scale,left,top
				var zoomArg = zoomArgs[0];
				var zoomArgNumber = parseFloat(zoomArg);
		
				if (zoomArg.indexOf('Fit') === -1) {
				  // If the zoomArg is a number, it has to get divided by 100. If it's
				  // a string, it should stay as it is.
				  dest = [null, { name: 'XYZ' },
						  zoomArgs.length > 1 ? (zoomArgs[1] | 0) : null,
						  zoomArgs.length > 2 ? (zoomArgs[2] | 0) : null,
						  (zoomArgNumber ? zoomArgNumber / 100 : zoomArg)];
				} else {
				  if (zoomArg === 'Fit' || zoomArg === 'FitB') {
					dest = [null, { name: zoomArg }];
				  } else if ((zoomArg === 'FitH' || zoomArg === 'FitBH') ||
							 (zoomArg === 'FitV' || zoomArg === 'FitBV')) {
					dest = [null, { name: zoomArg },
							zoomArgs.length > 1 ? (zoomArgs[1] | 0) : null];
				  } else if (zoomArg === 'FitR') {
					if (zoomArgs.length !== 5) {
					  console.error('pdfViewSetHash: ' +
									'Not enough parameters for \'FitR\'.');
					} else {
					  dest = [null, { name: zoomArg },
							  (zoomArgs[1] | 0), (zoomArgs[2] | 0),
							  (zoomArgs[3] | 0), (zoomArgs[4] | 0)];
					}
				  } else {
					console.error('pdfViewSetHash: \'' + zoomArg +
								  '\' is not a valid zoom value.');
				  }
				}
			  }
			  if (dest) {
				this.pdfViewer.scrollPageIntoView(pageNumber || this.page, dest);
			  } else if (pageNumber) {
				this.page = pageNumber; // simple page
			  }
			  if ('pagemode' in params) {
				if (params.pagemode === 'thumbs' || params.pagemode === 'bookmarks' ||
					params.pagemode === 'attachments') {
				  this.switchSidebarView((params.pagemode === 'bookmarks' ?
										  'outline' : params.pagemode), true);
				} else if (params.pagemode === 'none' && this.sidebarOpen) {
				  document.getElementById('sidebarToggle').click();
				}
			  }
			} else if (/^\d+$/.test(hash)) { // page number
			  this.page = hash;
			} else { // named destination
			  PDFHistory.updateNextHashParam(unescape(hash));
			  this.navigateTo(unescape(hash));
			}
		  },
		
		  refreshThumbnailViewer: function pdfViewRefreshThumbnailViewer() {
			var pdfViewer = this.pdfViewer;
			var thumbnailViewer = this.pdfThumbnailViewer;
		
			// set thumbnail images of rendered pages
			var pagesCount = pdfViewer.pagesCount;
			for (var pageIndex = 0; pageIndex < pagesCount; pageIndex++) {
			  var pageView = pdfViewer.getPageView(pageIndex);
			  if (pageView && pageView.renderingState === RenderingStates.FINISHED) {
				var thumbnailView = thumbnailViewer.getThumbnail(pageIndex);
				thumbnailView.setImage(pageView);
			  }
			}
		
			thumbnailViewer.scrollThumbnailIntoView(this.page);
		  },
		
		  switchSidebarView: function pdfViewSwitchSidebarView(view, openSidebar) {
			if (openSidebar && !this.sidebarOpen) {
			  document.getElementById('sidebarToggle').click();
			}
			var thumbsView = document.getElementById('thumbnailView');
			var outlineView = document.getElementById('outlineView');
			var attachmentsView = document.getElementById('attachmentsView');
		
			var thumbsButton = document.getElementById('viewThumbnail');
			var outlineButton = document.getElementById('viewOutline');
			var attachmentsButton = document.getElementById('viewAttachments');
		
			switch (view) {
			  case 'thumbs':
				var wasAnotherViewVisible = thumbsView.classList.contains('hidden');
		
				thumbsButton.classList.add('toggled');
				outlineButton.classList.remove('toggled');
				attachmentsButton.classList.remove('toggled');
				thumbsView.classList.remove('hidden');
				outlineView.classList.add('hidden');
				attachmentsView.classList.add('hidden');
		
				this.forceRendering();
		
				if (wasAnotherViewVisible) {
				  this.pdfThumbnailViewer.ensureThumbnailVisible(this.page);
				}
				break;
		
			  case 'outline':
				thumbsButton.classList.remove('toggled');
				outlineButton.classList.add('toggled');
				attachmentsButton.classList.remove('toggled');
				thumbsView.classList.add('hidden');
				outlineView.classList.remove('hidden');
				attachmentsView.classList.add('hidden');
		
				if (outlineButton.getAttribute('disabled')) {
				  return;
				}
				break;
		
			  case 'attachments':
				thumbsButton.classList.remove('toggled');
				outlineButton.classList.remove('toggled');
				attachmentsButton.classList.add('toggled');
				thumbsView.classList.add('hidden');
				outlineView.classList.add('hidden');
				attachmentsView.classList.remove('hidden');
		
				if (attachmentsButton.getAttribute('disabled')) {
				  return;
				}
				break;
			}
		  },
		
		  // Helper function to parse query string (e.g. ?param1=value&parm2=...).
		  parseQueryString: function pdfViewParseQueryString(query) {
			var parts = query.split('&');
			var params = {};
			for (var i = 0, ii = parts.length; i < ii; ++i) {
			  var param = parts[i].split('=');
			  var key = param[0].toLowerCase();
			  var value = param.length > 1 ? param[1] : null;
			  params[decodeURIComponent(key)] = decodeURIComponent(value);
			}
			return params;
		  },
		
		  beforePrint: function pdfViewSetupBeforePrint() {
			if (!this.supportsPrinting) {
			  var printMessage = mozL10n.get('printing_not_supported', null,
				  'Warning: Printing is not fully supported by this browser.');
			  this.error(printMessage);
			  return;
			}
		
			var alertNotReady = false;
			var i, ii;
			if (!this.pagesCount) {
			  alertNotReady = true;
			} else {
			  for (i = 0, ii = this.pagesCount; i < ii; ++i) {
				if (!this.pdfViewer.getPageView(i).pdfPage) {
				  alertNotReady = true;
				  break;
				}
			  }
			}
			if (alertNotReady) {
			  var notReadyMessage = mozL10n.get('printing_not_ready', null,
				  'Warning: The PDF is not fully loaded for printing.');
			  window.alert(notReadyMessage);
			  return;
			}
		
			this.printing = true;
			this.forceRendering();
		
			var body = document.querySelector('body');
			body.setAttribute('data-mozPrintCallback', true);
		
			if (!this.hasEqualPageSizes) {
			  console.warn('Not all pages have the same size. The printed result ' +
				  'may be incorrect!');
			}
		
			// Insert a @page + size rule to make sure that the page size is correctly
			// set. Note that we assume that all pages have the same size, because
			// variable-size pages are not supported yet (at least in Chrome & Firefox).
			// TODO(robwu): Use named pages when size calculation bugs get resolved
			// (e.g. https://crbug.com/355116) AND when support for named pages is
			// added (http://www.w3.org/TR/css3-page/#using-named-pages).
			// In browsers where @page + size is not supported (such as Firefox,
			// https://bugzil.la/851441), the next stylesheet will be ignored and the
			// user has to select the correct paper size in the UI if wanted.
			this.pageStyleSheet = document.createElement('style');
			var pageSize = this.pdfViewer.getPageView(0).pdfPage.getViewport(1);
			this.pageStyleSheet.textContent =
			  // "size:<width> <height>" is what we need. But also add "A4" because
			  // Firefox incorrectly reports support for the other value.
			  '@supports ((size:A4) and (size:1pt 1pt)) {' +
			  '@page { size: ' + pageSize.width + 'pt ' + pageSize.height + 'pt;}' +
			  // The canvas and each ancestor node must have a height of 100% to make
			  // sure that each canvas is printed on exactly one page.
			  '#printContainer {height:100%}' +
			  '#printContainer > div {width:100% !important;height:100% !important;}' +
			  '}';
			body.appendChild(this.pageStyleSheet);
		
			for (i = 0, ii = this.pagesCount; i < ii; ++i) {
			  this.pdfViewer.getPageView(i).beforePrint();
			}
		
		//#if !PRODUCTION
			if (true) {
			  return;
			}
		//#endif
		//#if (FIREFOX || MOZCENTRAL)
			FirefoxCom.request('reportTelemetry', JSON.stringify({
			  type: 'print'
			}));
		//#endif
		  },
		
		  // Whether all pages of the PDF have the same width and height.
		  get hasEqualPageSizes() {
			var firstPage = this.pdfViewer.getPageView(0);
			for (var i = 1, ii = this.pagesCount; i < ii; ++i) {
			  var pageView = this.pdfViewer.getPageView(i);
			  if (pageView.width !== firstPage.width ||
				  pageView.height !== firstPage.height) {
				return false;
			  }
			}
			return true;
		  },
		
		  afterPrint: function pdfViewSetupAfterPrint() {
			var div = document.getElementById('printContainer');
			while (div.hasChildNodes()) {
			  div.removeChild(div.lastChild);
			}
		
			if (this.pageStyleSheet && this.pageStyleSheet.parentNode) {
			  this.pageStyleSheet.parentNode.removeChild(this.pageStyleSheet);
			  this.pageStyleSheet = null;
			}
		
			this.printing = false;
			this.forceRendering();
		  },
		
		  setScale: function (value, resetAutoSettings) {
			this.updateScaleControls = !!resetAutoSettings;
			this.pdfViewer.currentScaleValue = value;
			this.updateScaleControls = true;
		  },
		
		  rotatePages: function pdfViewRotatePages(delta) {
			var pageNumber = this.page;
			this.pageRotation = (this.pageRotation + 360 + delta) % 360;
			this.pdfViewer.pagesRotation = this.pageRotation;
			this.pdfThumbnailViewer.pagesRotation = this.pageRotation;
		
			this.forceRendering();
		
			this.pdfViewer.scrollPageIntoView(pageNumber);
		  },
		
		  requestPresentationMode: function pdfViewRequestPresentationMode() {
			if (!this.pdfPresentationMode) {
			  return;
			}
			this.pdfPresentationMode.request();
		  },
		
		  /**
		   * @param {number} delta - The delta value from the mouse event.
		   */
		  scrollPresentationMode: function pdfViewScrollPresentationMode(delta) {
			if (!this.pdfPresentationMode) {
			  return;
			}
			this.pdfPresentationMode.mouseScroll(delta);
		  }
		};
		
		//#if GENERIC
		window.PDFView = PDFViewerApplication; // obsolete name, using it as an alias

}
str_template = '<div id="outerContainer"> <div id="sidebarContainer"> <div id="toolbarSidebar"> <div class="splitToolbarButton toggled"> <button id="viewThumbnail" class="toolbarButton group toggled" title="Show Thumbnails" tabindex="2" data-l10n-id="thumbs"> <span data-l10n-id="thumbs_label">Thumbnails</span> </button> <button id="viewOutline" class="toolbarButton group" title="Show Document Outline" tabindex="3" data-l10n-id="outline"> <span data-l10n-id="outline_label">Document Outline</span> </button> <button id="viewAttachments" class="toolbarButton group" title="Show Attachments" tabindex="4" data-l10n-id="attachments"> <span data-l10n-id="attachments_label">Attachments</span> </button> </div> </div> <div id="sidebarContent"> <div id="thumbnailView"> </div> <div id="outlineView" class="hidden"> </div> <div id="attachmentsView" class="hidden"> </div> </div> </div> <!-- sidebarContainer --> <div id="mainContainer"> <div class="findbar hidden doorHanger hiddenSmallView" id="findbar"> <label for="findInput" class="toolbarLabel" data-l10n-id="find_label">Find:</label> <input id="findInput" class="toolbarField" tabindex="91"> <div class="splitToolbarButton"> <button class="toolbarButton findPrevious" title="" id="findPrevious" tabindex="92" data-l10n-id="find_previous"> <span data-l10n-id="find_previous_label">Previous</span> </button> <div class="splitToolbarButtonSeparator"></div> <button class="toolbarButton findNext" title="" id="findNext" tabindex="93" data-l10n-id="find_next"> <span data-l10n-id="find_next_label">Next</span> </button> </div> <input type="checkbox" id="findHighlightAll" class="toolbarField"> <label for="findHighlightAll" class="toolbarLabel" tabindex="94" data-l10n-id="find_highlight">Highlight all</label> <input type="checkbox" id="findMatchCase" class="toolbarField"> <label for="findMatchCase" class="toolbarLabel" tabindex="95" data-l10n-id="find_match_case_label">Match case</label> <span id="findMsg" class="toolbarLabel"></span> </div> <!-- findbar --> <div id="secondaryToolbar" class="secondaryToolbar hidden doorHangerRight"> <div id="secondaryToolbarButtonContainer"> <button id="secondaryPresentationMode" class="secondaryToolbarButton presentationMode visibleLargeView" title="Switch to Presentation Mode" tabindex="51" data-l10n-id="presentation_mode"> <span data-l10n-id="presentation_mode_label">Presentation Mode</span> </button> <button id="secondaryOpenFile" class="secondaryToolbarButton openFile visibleLargeView" title="Open File" tabindex="52" data-l10n-id="open_file"> <span data-l10n-id="open_file_label">Open</span> </button> <button id="secondaryPrint" class="secondaryToolbarButton print visibleMediumView" title="Print" tabindex="53" data-l10n-id="print"> <span data-l10n-id="print_label">Print</span> </button> <button id="secondaryDownload" class="secondaryToolbarButton download visibleMediumView" title="Download" tabindex="54" data-l10n-id="download"> <span data-l10n-id="download_label">Download</span> </button> <a href="#" id="secondaryViewBookmark" class="secondaryToolbarButton bookmark visibleSmallView" title="Current view (copy or open in new window)" tabindex="55" data-l10n-id="bookmark"> <span data-l10n-id="bookmark_label">Current View</span> </a> <div class="horizontalToolbarSeparator visibleLargeView"></div> <button id="firstPage" class="secondaryToolbarButton firstPage" title="Go to First Page" tabindex="56" data-l10n-id="first_page"> <span data-l10n-id="first_page_label">Go to First Page</span> </button> <button id="lastPage" class="secondaryToolbarButton lastPage" title="Go to Last Page" tabindex="57" data-l10n-id="last_page"> <span data-l10n-id="last_page_label">Go to Last Page</span> </button> <div class="horizontalToolbarSeparator"></div> <button id="pageRotateCw" class="secondaryToolbarButton rotateCw" title="Rotate Clockwise" tabindex="58" data-l10n-id="page_rotate_cw"> <span data-l10n-id="page_rotate_cw_label">Rotate Clockwise</span> </button> <button id="pageRotateCcw" class="secondaryToolbarButton rotateCcw" title="Rotate Counterclockwise" tabindex="59" data-l10n-id="page_rotate_ccw"> <span data-l10n-id="page_rotate_ccw_label">Rotate Counterclockwise</span> </button> <div class="horizontalToolbarSeparator"></div> <button id="toggleHandTool" class="secondaryToolbarButton handTool" title="Enable hand tool" tabindex="60" data-l10n-id="hand_tool_enable"> <span data-l10n-id="hand_tool_enable_label">Enable hand tool</span> </button> <div class="horizontalToolbarSeparator"></div> <button id="documentProperties" class="secondaryToolbarButton documentProperties" title="Document Properties…" tabindex="61" data-l10n-id="document_properties"> <span data-l10n-id="document_properties_label">Document Properties…</span> </button> </div> </div> <!-- secondaryToolbar --> <div class="toolbar"> <div id="toolbarContainer"> <div id="toolbarViewer"> <div id="toolbarViewerLeft"> <button id="sidebarToggle" class="toolbarButton" title="Toggle Sidebar" tabindex="11" data-l10n-id="toggle_sidebar"> <span data-l10n-id="toggle_sidebar_label">Toggle Sidebar</span> </button> <div class="toolbarButtonSpacer"></div> <button id="viewFind" class="toolbarButton group hiddenSmallView" title="Find in Document" tabindex="12" data-l10n-id="findbar"> <span data-l10n-id="findbar_label">Find</span> </button> <div class="splitToolbarButton"> <button class="toolbarButton pageUp" title="Previous Page" id="previous" tabindex="13" data-l10n-id="previous"> <span data-l10n-id="previous_label">Previous</span> </button> <div class="splitToolbarButtonSeparator"></div> <button class="toolbarButton pageDown" title="Next Page" id="next" tabindex="14" data-l10n-id="next"> <span data-l10n-id="next_label">Next</span> </button> </div> <label id="pageNumberLabel" class="toolbarLabel" for="pageNumber" data-l10n-id="page_label">Page: </label> <input type="number" id="pageNumber" class="toolbarField pageNumber" value="1" size="4" min="1" tabindex="15"> <span id="numPages" class="toolbarLabel"></span> </div> <div id="toolbarViewerRight"> <button id="presentationMode" class="toolbarButton presentationMode hiddenLargeView" title="Switch to Presentation Mode" tabindex="31" data-l10n-id="presentation_mode"> <span data-l10n-id="presentation_mode_label">Presentation Mode</span> </button> <button id="openFile" class="toolbarButton openFile hiddenLargeView" title="Open File" tabindex="32" data-l10n-id="open_file"> <span data-l10n-id="open_file_label">Open</span> </button> <button id="print" class="toolbarButton print hiddenMediumView" title="Print" tabindex="33" data-l10n-id="print"> <span data-l10n-id="print_label">Print</span> </button> <button id="download" class="toolbarButton download hiddenMediumView" title="Download" tabindex="34" data-l10n-id="download"> <span data-l10n-id="download_label">Download</span> </button> <a href="#" id="viewBookmark" class="toolbarButton bookmark hiddenSmallView" title="Current view (copy or open in new window)" tabindex="35" data-l10n-id="bookmark"> <span data-l10n-id="bookmark_label">Current View</span> </a> <div class="verticalToolbarSeparator hiddenSmallView"></div> <button id="secondaryToolbarToggle" class="toolbarButton" title="Tools" tabindex="36" data-l10n-id="tools"> <span data-l10n-id="tools_label">Tools</span> </button> </div> <div class="outerCenter"> <div class="innerCenter" id="toolbarViewerMiddle"> <div class="splitToolbarButton"> <button id="zoomOut" class="toolbarButton zoomOut" title="Zoom Out" tabindex="21" data-l10n-id="zoom_out"> <span data-l10n-id="zoom_out_label">Zoom Out</span> </button> <div class="splitToolbarButtonSeparator"></div> <button id="zoomIn" class="toolbarButton zoomIn" title="Zoom In" tabindex="22" data-l10n-id="zoom_in"> <span data-l10n-id="zoom_in_label">Zoom In</span> </button> </div> <span id="scaleSelectContainer" class="dropdownToolbarButton"> <select id="scaleSelect" title="Zoom" tabindex="23" data-l10n-id="zoom"> <option id="pageAutoOption" title="" value="auto" selected="selected" data-l10n-id="page_scale_auto">Automatic Zoom</option> <option id="pageActualOption" title="" value="page-actual" data-l10n-id="page_scale_actual">Actual Size</option> <option id="pageFitOption" title="" value="page-fit" data-l10n-id="page_scale_fit">Fit Page</option> <option id="pageWidthOption" title="" value="page-width" data-l10n-id="page_scale_width">Full Width</option> <option id="customScaleOption" title="" value="custom"></option> <option title="" value="0.5" data-l10n-id="page_scale_percent" data-l10n-args=\'{ "scale": 50 }\'>50%</option> <option title="" value="0.75" data-l10n-id="page_scale_percent" data-l10n-args=\'{ "scale": 75 }\'>75%</option> <option title="" value="1" data-l10n-id="page_scale_percent" data-l10n-args=\'{ "scale": 100 }\'>100%</option> <option title="" value="1.25" data-l10n-id="page_scale_percent" data-l10n-args=\'{ "scale": 125 }\'>125%</option> <option title="" value="1.5" data-l10n-id="page_scale_percent" data-l10n-args=\'{ "scale": 150 }\'>150%</option> <option title="" value="2" data-l10n-id="page_scale_percent" data-l10n-args=\'{ "scale": 200 }\'>200%</option> <option title="" value="3" data-l10n-id="page_scale_percent" data-l10n-args=\'{ "scale": 300 }\'>300%</option> <option title="" value="4" data-l10n-id="page_scale_percent" data-l10n-args=\'{ "scale": 400 }\'>400%</option> </select> </span> </div> </div> </div> <div id="loadingBar"> <div class="progress"> <div class="glimmer"> </div> </div> </div> </div> </div> <menu type="context" id="viewerContextMenu"> <menuitem id="contextFirstPage" label="First Page" data-l10n-id="first_page"></menuitem> <menuitem id="contextLastPage" label="Last Page" data-l10n-id="last_page"></menuitem> <menuitem id="contextPageRotateCw" label="Rotate Clockwise" data-l10n-id="page_rotate_cw"></menuitem> <menuitem id="contextPageRotateCcw" label="Rotate Counter-Clockwise" data-l10n-id="page_rotate_ccw"></menuitem> </menu> <div id="viewerContainer" tabindex="0"> <div id="viewer" class="pdfViewer"></div> </div> <div id="errorWrapper" hidden=\'true\'> <div id="errorMessageLeft"> <span id="errorMessage"></span> <button id="errorShowMore" data-l10n-id="error_more_info"> More Information </button> <button id="errorShowLess" data-l10n-id="error_less_info" hidden=\'true\'> Less Information </button> </div> <div id="errorMessageRight"> <button id="errorClose" data-l10n-id="error_close"> Close </button> </div> <div class="clearBoth"></div> <textarea id="errorMoreInfo" hidden=\'true\' readonly="readonly"></textarea> </div> </div> <!-- mainContainer --> <div id="overlayContainer" class="hidden"> <div id="passwordOverlay" class="container hidden"> <div class="dialog"> <div class="row"> <p id="passwordText" data-l10n-id="password_label">Enter the password to open this PDF file:</p> </div> <div class="row"> <input type="password" id="password" class="toolbarField" /> </div> <div class="buttonRow"> <button id="passwordCancel" class="overlayButton"><span data-l10n-id="password_cancel">Cancel</span></button> <button id="passwordSubmit" class="overlayButton"><span data-l10n-id="password_ok">OK</span></button> </div> </div> </div> <div id="documentPropertiesOverlay" class="container hidden"> <div class="dialog"> <div class="row"> <span data-l10n-id="document_properties_file_name">File name:</span> <p id="fileNameField">-</p> </div> <div class="row"> <span data-l10n-id="document_properties_file_size">File size:</span> <p id="fileSizeField">-</p> </div> <div class="separator"></div> <div class="row"> <span data-l10n-id="document_properties_title">Title:</span> <p id="titleField">-</p> </div> <div class="row"> <span data-l10n-id="document_properties_author">Author:</span> <p id="authorField">-</p> </div> <div class="row"> <span data-l10n-id="document_properties_subject">Subject:</span> <p id="subjectField">-</p> </div> <div class="row"> <span data-l10n-id="document_properties_keywords">Keywords:</span> <p id="keywordsField">-</p> </div> <div class="row"> <span data-l10n-id="document_properties_creation_date">Creation Date:</span> <p id="creationDateField">-</p> </div> <div class="row"> <span data-l10n-id="document_properties_modification_date">Modification Date:</span> <p id="modificationDateField">-</p> </div> <div class="row"> <span data-l10n-id="document_properties_creator">Creator:</span> <p id="creatorField">-</p> </div> <div class="separator"></div> <div class="row"> <span data-l10n-id="document_properties_producer">PDF Producer:</span> <p id="producerField">-</p> </div> <div class="row"> <span data-l10n-id="document_properties_version">PDF Version:</span> <p id="versionField">-</p> </div> <div class="row"> <span data-l10n-id="document_properties_page_count">Page Count:</span> <p id="pageCountField">-</p> </div> <div class="buttonRow"> <button id="documentPropertiesClose" class="overlayButton"><span data-l10n-id="document_properties_close">Close</span></button> </div> </div> </div> </div> <!-- overlayContainer --> </div> <!-- outerContainer --> <div id="printContainer"></div>';