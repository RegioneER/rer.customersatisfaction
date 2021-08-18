/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = // eslint-disable-next-line no-unused-vars
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) {
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if (parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var script = document.createElement("script");
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		if (null) script.crossOrigin = null;
/******/ 		document.head.appendChild(script);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest(requestTimeout) {
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if (typeof XMLHttpRequest === "undefined") {
/******/ 				return reject(new Error("No browser support"));
/******/ 			}
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch (err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if (request.readyState !== 4) return;
/******/ 				if (request.status === 0) {
/******/ 					// timeout
/******/ 					reject(
/******/ 						new Error("Manifest request to " + requestPath + " timed out.")
/******/ 					);
/******/ 				} else if (request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if (request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch (e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "5102ccb16c261b7df0a8";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_selfInvalidated: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 			invalidate: function() {
/******/ 				this._selfInvalidated = true;
/******/ 				switch (hotStatus) {
/******/ 					case "idle":
/******/ 						hotUpdate = {};
/******/ 						hotUpdate[moduleId] = modules[moduleId];
/******/ 						hotSetStatus("ready");
/******/ 						break;
/******/ 					case "ready":
/******/ 						hotApplyInvalidatedModule(moduleId);
/******/ 						break;
/******/ 					case "prepare":
/******/ 					case "check":
/******/ 					case "dispose":
/******/ 					case "apply":
/******/ 						(hotQueuedInvalidatedModules =
/******/ 							hotQueuedInvalidatedModules || []).push(moduleId);
/******/ 						break;
/******/ 					default:
/******/ 						// ignore requests in error states
/******/ 						break;
/******/ 				}
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash, hotQueuedInvalidatedModules;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus(hotApplyInvalidatedModules() ? "ready" : "idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "history";
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 		return hotApplyInternal(options);
/******/ 	}
/******/
/******/ 	function hotApplyInternal(options) {
/******/ 		hotApplyInvalidatedModules();
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (
/******/ 					!module ||
/******/ 					(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 				)
/******/ 					continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted &&
/******/ 				// removed self-accepted modules should not be required
/******/ 				appliedUpdate[moduleId] !== warnUnexpectedRequire &&
/******/ 				// when called invalidate self-accepting is not possible
/******/ 				!installedModules[moduleId].hot._selfInvalidated
/******/ 			) {
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					parents: installedModules[moduleId].parents.slice(),
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		if (hotUpdateNewHash !== undefined) {
/******/ 			hotCurrentHash = hotUpdateNewHash;
/******/ 			hotUpdateNewHash = undefined;
/******/ 		}
/******/ 		hotUpdate = undefined;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = item.parents;
/******/ 			hotCurrentChildModule = moduleId;
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		if (hotQueuedInvalidatedModules) {
/******/ 			return hotApplyInternal(options).then(function(list) {
/******/ 				outdatedModules.forEach(function(moduleId) {
/******/ 					if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 				});
/******/ 				return list;
/******/ 			});
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	function hotApplyInvalidatedModules() {
/******/ 		if (hotQueuedInvalidatedModules) {
/******/ 			if (!hotUpdate) hotUpdate = {};
/******/ 			hotQueuedInvalidatedModules.forEach(hotApplyInvalidatedModule);
/******/ 			hotQueuedInvalidatedModules = undefined;
/******/ 			return true;
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApplyInvalidatedModule(moduleId) {
/******/ 		if (!Object.prototype.hasOwnProperty.call(hotUpdate, moduleId))
/******/ 			hotUpdate[moduleId] = modules[moduleId];
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: ENOENT: no such file or directory, open '/Users/cekk/work/rer/regione-er-5/src/rer.customersatisfaction/node_modules/axios/index.js'");

/***/ }),

/***/ "./node_modules/date-fns/esm/format/index.js":
/*!***************************************************!*\
  !*** ./node_modules/date-fns/esm/format/index.js ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: ENOENT: no such file or directory, open '/Users/cekk/work/rer/regione-er-5/src/rer.customersatisfaction/node_modules/date-fns/esm/format/index.js'");

/***/ }),

/***/ "./node_modules/file-saver/dist/FileSaver.min.js":
/*!*******************************************************!*\
  !*** ./node_modules/file-saver/dist/FileSaver.min.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: ENOENT: no such file or directory, open '/Users/cekk/work/rer/regione-er-5/src/rer.customersatisfaction/node_modules/file-saver/dist/FileSaver.min.js'");

/***/ }),

/***/ "./node_modules/prop-types/index.js":
/*!******************************************!*\
  !*** ./node_modules/prop-types/index.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: ENOENT: no such file or directory, open '/Users/cekk/work/rer/regione-er-5/src/rer.customersatisfaction/node_modules/prop-types/index.js'");

/***/ }),

/***/ "./node_modules/react-data-table-component/dist/index.cjs.js":
/*!*******************************************************************!*\
  !*** ./node_modules/react-data-table-component/dist/index.cjs.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: ENOENT: no such file or directory, open '/Users/cekk/work/rer/regione-er-5/src/rer.customersatisfaction/node_modules/react-data-table-component/dist/index.cjs.js'");

/***/ }),

/***/ "./node_modules/react-dom/index.js":
/*!*****************************************!*\
  !*** ./node_modules/react-dom/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: ENOENT: no such file or directory, open '/Users/cekk/work/rer/regione-er-5/src/rer.customersatisfaction/node_modules/react-dom/index.js'");

/***/ }),

/***/ "./node_modules/react-select/dist/react-select.esm.js":
/*!************************************************************!*\
  !*** ./node_modules/react-select/dist/react-select.esm.js ***!
  \************************************************************/
/*! exports provided: createFilter, defaultTheme, mergeStyles, components, default, NonceProvider */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: ENOENT: no such file or directory, open '/Users/cekk/work/rer/regione-er-5/src/rer.customersatisfaction/node_modules/react-select/dist/react-select.esm.js'");

/***/ }),

/***/ "./node_modules/react/index.js":
/*!*************************************!*\
  !*** ./node_modules/react/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: ENOENT: no such file or directory, open '/Users/cekk/work/rer/regione-er-5/src/rer.customersatisfaction/node_modules/react/index.js'");

/***/ }),

/***/ "./node_modules/webpack-dev-server/client/index.js?http://localhost:3000":
/*!*********************************************************!*\
  !*** (webpack)-dev-server/client?http://localhost:3000 ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: ENOENT: no such file or directory, open '/Users/cekk/work/rer/regione-er-5/src/rer.customersatisfaction/node_modules/webpack-dev-server/client/index.js'");

/***/ }),

/***/ "./node_modules/webpack/hot/dev-server.js":
/*!***********************************!*\
  !*** (webpack)/hot/dev-server.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: ENOENT: no such file or directory, open '/Users/cekk/work/rer/regione-er-5/src/rer.customersatisfaction/node_modules/webpack/hot/dev-server.js'");

/***/ }),

/***/ "./src/rer/customersatisfaction/browser/static/react/javascripts/ApiContext.js":
/*!*************************************************************************************!*\
  !*** ./src/rer/customersatisfaction/browser/static/react/javascripts/ApiContext.js ***!
  \*************************************************************************************/
/*! exports provided: ApiContext, ApiProvider, ApiConsumer, DEFAULT_B_SIZE, DEFAULT_SORT_ON, DEFAULT_SORT_ORDER, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ApiContext", function() { return ApiContext; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ApiProvider", function() { return ApiProvider; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ApiConsumer", function() { return ApiConsumer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_B_SIZE", function() { return DEFAULT_B_SIZE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_SORT_ON", function() { return DEFAULT_SORT_ON; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_SORT_ORDER", function() { return DEFAULT_SORT_ORDER; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_apiFetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/apiFetch */ "./src/rer/customersatisfaction/browser/static/react/javascripts/utils/apiFetch.js");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }




var ApiContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createContext({});
var ApiProvider = ApiContext.Provider;
var ApiConsumer = ApiContext.Consumer;
var DEFAULT_B_SIZE = 25;
var DEFAULT_SORT_ON = 'last_vote';
var DEFAULT_SORT_ORDER = 'descending';

function ApiWrapper(_ref) {
  var endpoint = _ref.endpoint,
      children = _ref.children,
      canDelete = _ref.canDelete;

  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])({}),
      _useState2 = _slicedToArray(_useState, 2),
      data = _useState2[0],
      setData = _useState2[1];

  var _useState3 = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(null),
      _useState4 = _slicedToArray(_useState3, 2),
      portalUrl = _useState4[0],
      setPortalUrl = _useState4[1];

  var _useState5 = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(null),
      _useState6 = _slicedToArray(_useState5, 2),
      apiErrors = _useState6[0],
      setApiErrors = _useState6[1];

  var _useState7 = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(false),
      _useState8 = _slicedToArray(_useState7, 2),
      loading = _useState8[0],
      setLoading = _useState8[1];

  var _useState9 = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(DEFAULT_B_SIZE),
      _useState10 = _slicedToArray(_useState9, 2),
      b_size = _useState10[0],
      setB_size = _useState10[1];

  var _useState11 = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(DEFAULT_SORT_ON),
      _useState12 = _slicedToArray(_useState11, 2),
      sort_on = _useState12[0],
      setSort_on = _useState12[1];

  var _useState13 = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(DEFAULT_SORT_ORDER),
      _useState14 = _slicedToArray(_useState13, 2),
      sort_order = _useState14[0],
      setSort_order = _useState14[1];

  var handleApiResponse = function handleApiResponse(res) {
    if ((res === null || res === void 0 ? void 0 : res.status) == 204 || (res === null || res === void 0 ? void 0 : res.status) == 200) {//ok
    } else {
      setApiErrors(res ? {
        status: res.status,
        statusText: res.statusText
      } : {
        status: '404',
        statusText: ''
      });
    }
  };

  var fetchApi = function fetchApi() {
    var b_start = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var query = arguments.length > 1 ? arguments[1] : undefined;

    if (portalUrl) {
      setLoading(true);
      Object(_utils_apiFetch__WEBPACK_IMPORTED_MODULE_2__["default"])({
        url: portalUrl + '/@' + endpoint,
        params: _objectSpread({
          b_size: b_size,
          b_start: b_start,
          sort_on: sort_on,
          sort_order: sort_order
        }, query),
        method: 'GET'
      }).then(function (data) {
        if (data === undefined) {
          setApiErrors({
            status: 500,
            statusText: 'Error'
          });
          setLoading(false);
          return;
        }

        handleApiResponse(data);
        setData(data.data);
        setLoading(false);
      })["catch"](function (error) {
        setLoading(false);

        if (error && error.response) {
          setApiErrors({
            status: error.response.status,
            statusText: error.message
          });
        }
      });
    }
  };

  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(function () {
    var portalUrl = document.querySelector('body').getAttribute('data-portal-url');

    if (!portalUrl) {
      return;
    }

    setPortalUrl(portalUrl);
  }, []);
  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(function () {
    if (portalUrl) {
      fetchApi();
    }
  }, [portalUrl, b_size, sort_on, sort_order]);

  var handlePageChange = function handlePageChange(page) {
    fetchApi(b_size * (page - 1));
  };

  var setSorting = function setSorting(column, order) {
    setSort_on(column);
    setSort_order(order === 'asc' ? 'ascending' : 'descending');
  };

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ApiProvider, {
    value: {
      fetchApi: fetchApi,
      data: data,
      portalUrl: portalUrl,
      handleApiResponse: handleApiResponse,
      setB_size: setB_size,
      b_size: b_size,
      setSorting: setSorting,
      sort_on: sort_on,
      sort_order: sort_order,
      handlePageChange: handlePageChange,
      apiErrors: apiErrors,
      setApiErrors: setApiErrors,
      loading: loading,
      endpoint: endpoint,
      canDelete: canDelete
    }
  }, children);
}

ApiWrapper.propTypes = {
  children: prop_types__WEBPACK_IMPORTED_MODULE_1__["object"]
};
/* harmony default export */ __webpack_exports__["default"] = (ApiWrapper);

/***/ }),

/***/ "./src/rer/customersatisfaction/browser/static/react/javascripts/TranslationsContext.js":
/*!**********************************************************************************************!*\
  !*** ./src/rer/customersatisfaction/browser/static/react/javascripts/TranslationsContext.js ***!
  \**********************************************************************************************/
/*! exports provided: TranslationsContext, TranslationsProvider, TranslationsConsumer, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TranslationsContext", function() { return TranslationsContext; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TranslationsProvider", function() { return TranslationsProvider; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TranslationsConsumer", function() { return TranslationsConsumer; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_2__);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }




var TranslationsContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createContext({});
var TranslationsProvider = TranslationsContext.Provider;
var TranslationsConsumer = TranslationsContext.Consumer;

function TranslationsWrapper(_ref) {
  var children = _ref.children;

  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])({}),
      _useState2 = _slicedToArray(_useState, 2),
      translations = _useState2[0],
      setTranslations = _useState2[1];

  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(function () {
    var catalogUrl = document.querySelector('body').getAttribute('data-i18ncatalogurl');

    if (!catalogUrl) {
      return;
    }

    var language = document.querySelector('html').getAttribute('lang');

    if (!language) {
      language = 'en';
    }

    var domain = 'rer.customersatisfaction';
    axios__WEBPACK_IMPORTED_MODULE_2___default()({
      method: 'GET',
      url: catalogUrl,
      params: {
        domain: domain,
        language: language
      }
    }).then(function (_ref2) {
      var data = _ref2.data;
      setTranslations(_objectSpread(_objectSpread({}, data), {}, {
        language: language
      }));
    })["catch"](function (error) {
      // handle error
      console.log(error);
    });
  }, []);

  var getTranslationFor = function getTranslationFor(msgid, defaultMsg) {
    var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    if (!translations[msgid]) {
      return defaultMsg;
    }

    return translations[msgid].replace(/(\${variable})/g, value);
  };

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(TranslationsProvider, {
    value: getTranslationFor
  }, children);
}

TranslationsWrapper.propTypes = {
  children: prop_types__WEBPACK_IMPORTED_MODULE_1__["object"]
};
/* harmony default export */ __webpack_exports__["default"] = (TranslationsWrapper);

/***/ }),

/***/ "./src/rer/customersatisfaction/browser/static/react/javascripts/history/App.js":
/*!**************************************************************************************!*\
  !*** ./src/rer/customersatisfaction/browser/static/react/javascripts/history/App.js ***!
  \**************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _TranslationsContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../TranslationsContext */ "./src/rer/customersatisfaction/browser/static/react/javascripts/TranslationsContext.js");
/* harmony import */ var _ApiContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../ApiContext */ "./src/rer/customersatisfaction/browser/static/react/javascripts/ApiContext.js");
/* harmony import */ var _Menu_Menu__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Menu/Menu */ "./src/rer/customersatisfaction/browser/static/react/javascripts/history/Menu/Menu.jsx");
/* harmony import */ var _CustomerSatisfactionList__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./CustomerSatisfactionList */ "./src/rer/customersatisfaction/browser/static/react/javascripts/history/CustomerSatisfactionList/index.jsx");
/* harmony import */ var _App_less__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./App.less */ "./src/rer/customersatisfaction/browser/static/react/javascripts/history/App.less");
/* harmony import */ var _App_less__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_App_less__WEBPACK_IMPORTED_MODULE_5__);
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }








var App = function App(_ref) {
  var canDelete = _ref.canDelete;

  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(null),
      _useState2 = _slicedToArray(_useState, 2),
      user = _useState2[0],
      setUser = _useState2[1];

  var endpoint = 'customer-satisfaction';
  var children = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Menu_Menu__WEBPACK_IMPORTED_MODULE_3__["default"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_CustomerSatisfactionList__WEBPACK_IMPORTED_MODULE_4__["default"], null));
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_TranslationsContext__WEBPACK_IMPORTED_MODULE_1__["default"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_ApiContext__WEBPACK_IMPORTED_MODULE_2__["default"], {
    endpoint: endpoint,
    canDelete: canDelete
  }, children));
};

/* harmony default export */ __webpack_exports__["default"] = (App);

/***/ }),

/***/ "./src/rer/customersatisfaction/browser/static/react/javascripts/history/App.less":
/*!****************************************************************************************!*\
  !*** ./src/rer/customersatisfaction/browser/static/react/javascripts/history/App.less ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

throw new Error("Module build failed (from ./node_modules/mini-css-extract-plugin/dist/loader.js):\nModuleBuildError: Module build failed: Error: ENOENT: no such file or directory, open '/Users/cekk/work/rer/regione-er-5/src/rer.customersatisfaction/node_modules/css-loader/dist/runtime/api.js'\n    at runLoaders (/Users/cekk/work/rer/regione-er-5/src/rer.customersatisfaction/node_modules/webpack/lib/NormalModule.js:316:20)\n    at /Users/cekk/work/rer/regione-er-5/src/rer.customersatisfaction/node_modules/loader-runner/lib/LoaderRunner.js:367:11\n    at Array.<anonymous> (/Users/cekk/work/rer/regione-er-5/src/rer.customersatisfaction/node_modules/loader-runner/lib/LoaderRunner.js:203:19)\n    at Storage.finished (/Users/cekk/work/rer/regione-er-5/src/rer.customersatisfaction/node_modules/enhanced-resolve/lib/CachedInputFileSystem.js:55:16)\n    at ReadFileContext.provider (/Users/cekk/work/rer/regione-er-5/src/rer.customersatisfaction/node_modules/enhanced-resolve/lib/CachedInputFileSystem.js:91:9)\n    at ReadFileContext.callback (/Users/cekk/work/rer/regione-er-5/src/rer.customersatisfaction/node_modules/graceful-fs/graceful-fs.js:123:16)\n    at FSReqWrap.readFileAfterOpen [as oncomplete] (fs.js:237:13)");

/***/ }),

/***/ "./src/rer/customersatisfaction/browser/static/react/javascripts/history/CSV/ExportCSV.js":
/*!************************************************************************************************!*\
  !*** ./src/rer/customersatisfaction/browser/static/react/javascripts/history/CSV/ExportCSV.js ***!
  \************************************************************************************************/
/*! exports provided: downloadCSV */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "downloadCSV", function() { return downloadCSV; });
/* harmony import */ var _utils_apiFetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/apiFetch */ "./src/rer/customersatisfaction/browser/static/react/javascripts/utils/apiFetch.js");
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! file-saver */ "./node_modules/file-saver/dist/FileSaver.min.js");
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(file_saver__WEBPACK_IMPORTED_MODULE_1__);


var downloadCSV = function downloadCSV(portalUrl, endpoint, setApiErrors, getTranslationFor) {
  Object(_utils_apiFetch__WEBPACK_IMPORTED_MODULE_0__["default"])({
    url: portalUrl + '/@' + endpoint + '-csv',
    method: 'GET'
  }).then(function (res) {
    if (!res) {
      setApiErrors({
        status: 404,
        statusText: getTranslationFor('Url not found. Unable to download this file.', 'Url not found. Unable to download this file.')
      });
      return;
    }

    if (res.status !== 200) {
      switch (res.status) {
        case 401:
        case 403:
          setApiErrors({
            status: res.status,
            statusText: getTranslationFor('You do not have permission to download this file.', 'You do not have permission to download this file.')
          });
          return;

        default:
          setApiErrors({
            status: res.status,
            statusText: getTranslationFor('An error occurred downloading file.', 'An error occurred downloading file.')
          });
          return;
      }
    }

    if (!res.data || res.data.length === 0) {
      setApiErrors({
        status: res.status,
        statusText: getTranslationFor('An error occurred downloading file.', 'An error occurred downloading file.')
      });
      return;
    }

    var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    var disposition = res.headers['content-disposition'];

    if (disposition && disposition.indexOf('attachment') !== -1) {
      var matches = filenameRegex.exec(disposition);
      var filename = matches[1].replace(/['"]/g, '');
      var blob = new Blob([res.data], {
        type: res.headers['content-type']
      });
      Object(file_saver__WEBPACK_IMPORTED_MODULE_1__["saveAs"])(blob, filename);
    }
  })["catch"](function (err) {
    console.error(err);
    setApiErrors({
      status: 500,
      statusText: err.message
    });
  });
};

/***/ }),

/***/ "./src/rer/customersatisfaction/browser/static/react/javascripts/history/CustomerSatisfactionList/index.jsx":
/*!******************************************************************************************************************!*\
  !*** ./src/rer/customersatisfaction/browser/static/react/javascripts/history/CustomerSatisfactionList/index.jsx ***!
  \******************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_data_table_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-data-table-component */ "./node_modules/react-data-table-component/dist/index.cjs.js");
/* harmony import */ var react_data_table_component__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_data_table_component__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var date_fns_format__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! date-fns/format */ "./node_modules/date-fns/esm/format/index.js");
/* harmony import */ var _TranslationsContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../TranslationsContext */ "./src/rer/customersatisfaction/browser/static/react/javascripts/TranslationsContext.js");
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-select */ "./node_modules/react-select/dist/react-select.esm.js");
/* harmony import */ var _ApiContext__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../ApiContext */ "./src/rer/customersatisfaction/browser/static/react/javascripts/ApiContext.js");
/* harmony import */ var _utils_apiFetch__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../utils/apiFetch */ "./src/rer/customersatisfaction/browser/static/react/javascripts/utils/apiFetch.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils */ "./src/rer/customersatisfaction/browser/static/react/javascripts/history/utils.js");
/* harmony import */ var _index_less__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./index.less */ "./src/rer/customersatisfaction/browser/static/react/javascripts/history/CustomerSatisfactionList/index.less");
/* harmony import */ var _index_less__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_index_less__WEBPACK_IMPORTED_MODULE_8__);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }











var CustomerSatisfactionList = function CustomerSatisfactionList() {
  var getTranslationFor = Object(react__WEBPACK_IMPORTED_MODULE_0__["useContext"])(_TranslationsContext__WEBPACK_IMPORTED_MODULE_3__["TranslationsContext"]);

  var _useContext = Object(react__WEBPACK_IMPORTED_MODULE_0__["useContext"])(_ApiContext__WEBPACK_IMPORTED_MODULE_5__["ApiContext"]),
      data = _useContext.data,
      portalUrl = _useContext.portalUrl,
      fetchApi = _useContext.fetchApi,
      loading = _useContext.loading,
      handleApiResponse = _useContext.handleApiResponse,
      setB_size = _useContext.setB_size,
      handlePageChange = _useContext.handlePageChange,
      b_size = _useContext.b_size,
      setSorting = _useContext.setSorting,
      canDelete = _useContext.canDelete;

  var labels = Object(_utils__WEBPACK_IMPORTED_MODULE_7__["getCustomerSatisfactionLables"])(getTranslationFor);

  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])({}),
      _useState2 = _slicedToArray(_useState, 2),
      filters = _useState2[0],
      setFilters = _useState2[1];

  var _useState3 = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(0),
      _useState4 = _slicedToArray(_useState3, 2),
      textTimeout = _useState4[0],
      setTextTimeout = _useState4[1];

  var _useState5 = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(false),
      _useState6 = _slicedToArray(_useState5, 2),
      resetPaginationToggle = _useState6[0],
      setResetPaginationToggle = _useState6[1];

  var _React$useState = react__WEBPACK_IMPORTED_MODULE_0___default.a.useState([]),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      selectedRows = _React$useState2[0],
      setSelectedRows = _React$useState2[1];

  var _useState7 = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(false),
      _useState8 = _slicedToArray(_useState7, 2),
      toggleCleared = _useState8[0],
      setToggleCleared = _useState8[1]; //------------------COLUMNS----------------------


  var columns = [{
    name: labels.page,
    selector: 'title',
    sortable: true,
    cell: function cell(row) {
      return row.url ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "col-title"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: row.url,
        title: 'Apri ' + row.title,
        target: "_blank",
        rel: "noopener noreferrer"
      }, row.title)) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, row.title);
    }
  }, {
    name: labels.ok,
    selector: 'ok',
    sortable: true,
    width: '120px'
  }, {
    name: labels.nok,
    selector: 'nok',
    sortable: true,
    width: '120px'
  }, {
    name: labels.last_voted,
    selector: 'last_vote',
    sortable: true,
    cell: function cell(row) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, row.last_vote ? Object(date_fns_format__WEBPACK_IMPORTED_MODULE_2__["default"])(new Date(row.last_vote), 'dd/MM/yyyy HH:mm:ss') : '');
    },
    width: '160px'
  }, {
    name: labels.comments,
    selector: 'comments',
    sortable: false,
    width: '80px',
    cell: function cell(row) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "comments-count"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        href: "".concat(row.url, "/show-feedbacks"),
        title: "Vai ai commenti"
      }, row.comments.length));
    }
  }]; //------------ROW SELECTION------------

  var handleRowSelected = react__WEBPACK_IMPORTED_MODULE_0___default.a.useCallback(function (state) {
    setSelectedRows(state.selectedRows);
  }, []);
  var contextActions = react__WEBPACK_IMPORTED_MODULE_0___default.a.useMemo(function () {
    var handleDelete = function handleDelete() {
      // eslint-disable-next-line no-alert
      if (window.confirm("".concat(labels.resetFeedbacksConfirm, " \n").concat(selectedRows.map(function (r) {
        return r.title;
      }).join('\n')))) {
        setToggleCleared(!toggleCleared); //call delete foreach item selected

        var url = portalUrl + '/@customer-satisfaction-delete';
        var method = 'DELETE';
        var fetches = [];
        selectedRows.forEach(function (r) {
          fetches.push(Object(_utils_apiFetch__WEBPACK_IMPORTED_MODULE_6__["default"])({
            url: url + '/' + r.uid,
            method: method
          }));
        });
        Promise.all(fetches).then(function (data) {
          handleApiResponse(data[0]);
          fetchApi();
        });
      }
    };

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
      key: "delete",
      onClick: handleDelete,
      className: "plone-btn plone-btn-danger"
    }, labels.resetFeedbacksButton);
  }, [data.items, selectedRows, toggleCleared]); //------------FILTERING-----------

  var SubHeaderComponent = react__WEBPACK_IMPORTED_MODULE_0___default.a.useMemo(function () {
    var handleClearText = function handleClearText() {
      setResetPaginationToggle(!resetPaginationToggle);

      var newFilters = _objectSpread(_objectSpread({}, filters), {}, {
        text: ''
      });

      setFilters(newFilters);
      doQuery(newFilters);
    };

    var delayTextSubmit = function delayTextSubmit(value) {
      var newFilters = _objectSpread(_objectSpread({}, filters), {}, {
        text: value
      });

      if (textTimeout) {
        clearInterval(textTimeout);
      }

      var timeout = setTimeout(function () {
        doQuery(newFilters);
      }, 1000);
      setFilters(newFilters);
      setTextTimeout(timeout);
    };

    var doQuery = function doQuery(queryFilters) {
      var _params$text;

      var params = _objectSpread({}, queryFilters);

      if ((_params$text = params.text) !== null && _params$text !== void 0 && _params$text.length) {
        params.text = params.text + '*';
      }

      fetchApi(null, params);
    };

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "search-wrapper"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
      id: "search",
      type: "text",
      placeholder: labels.filterTitle,
      "aria-label": labels.search,
      value: filters.text || '',
      onChange: function onChange(e) {
        return delayTextSubmit(e.target.value);
      }
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
      type: "button",
      onClick: handleClearText
    }, "\xD7")));
  }, [filters, resetPaginationToggle, data.items]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "customer-satisfaction-history-list"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_data_table_component__WEBPACK_IMPORTED_MODULE_1___default.a, {
    columns: columns,
    data: data.items,
    striped: true,
    highlightOnHover: true,
    pointerOnHover: false,
    noDataComponent: labels.noData,
    responsive: true,
    defaultSortField: _ApiContext__WEBPACK_IMPORTED_MODULE_5__["DEFAULT_SORT_ON"],
    defaultSortAsc: _ApiContext__WEBPACK_IMPORTED_MODULE_5__["DEFAULT_SORT_ORDER"] == 'ascending',
    pagination: true,
    paginationRowsPerPageOptions: [5, 25, 50, 100],
    paginationPerPage: b_size,
    paginationServer: true,
    paginationServerOptions: {
      persistSelectedOnPageChange: true,
      persistSelectedOnSort: false
    },
    paginationTotalRows: data.items_total,
    onChangeRowsPerPage: function onChangeRowsPerPage(size) {
      return setB_size(size);
    },
    onChangePage: handlePageChange,
    progressPending: loading,
    sortServer: true,
    onSort: function onSort(column, direction) {
      return setSorting(column.selector, direction);
    },
    paginationResetDefaultPage: resetPaginationToggle // optionally, a hook to reset pagination to page 1
    ,
    subHeader: true,
    subHeaderComponent: SubHeaderComponent,
    selectableRows: true,
    onSelectedRowsChange: handleRowSelected,
    contextActions: contextActions,
    clearSelectedRows: toggleCleared,
    contextMessage: {
      singular: labels.singularSelected,
      plural: labels.pluralSelected,
      message: ''
    }
  }));
};

/* harmony default export */ __webpack_exports__["default"] = (CustomerSatisfactionList);

/***/ }),

/***/ "./src/rer/customersatisfaction/browser/static/react/javascripts/history/CustomerSatisfactionList/index.less":
/*!*******************************************************************************************************************!*\
  !*** ./src/rer/customersatisfaction/browser/static/react/javascripts/history/CustomerSatisfactionList/index.less ***!
  \*******************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

throw new Error("Module build failed (from ./node_modules/mini-css-extract-plugin/dist/loader.js):\nModuleBuildError: Module build failed: Error: ENOENT: no such file or directory, open '/Users/cekk/work/rer/regione-er-5/src/rer.customersatisfaction/node_modules/css-loader/dist/runtime/api.js'\n    at runLoaders (/Users/cekk/work/rer/regione-er-5/src/rer.customersatisfaction/node_modules/webpack/lib/NormalModule.js:316:20)\n    at /Users/cekk/work/rer/regione-er-5/src/rer.customersatisfaction/node_modules/loader-runner/lib/LoaderRunner.js:367:11\n    at /Users/cekk/work/rer/regione-er-5/src/rer.customersatisfaction/node_modules/loader-runner/lib/LoaderRunner.js:203:19\n    at process.nextTick (/Users/cekk/work/rer/regione-er-5/src/rer.customersatisfaction/node_modules/enhanced-resolve/lib/CachedInputFileSystem.js:85:15)\n    at process._tickCallback (internal/process/next_tick.js:61:11)");

/***/ }),

/***/ "./src/rer/customersatisfaction/browser/static/react/javascripts/history/Menu/Menu.jsx":
/*!*********************************************************************************************!*\
  !*** ./src/rer/customersatisfaction/browser/static/react/javascripts/history/Menu/Menu.jsx ***!
  \*********************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _TranslationsContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../TranslationsContext */ "./src/rer/customersatisfaction/browser/static/react/javascripts/TranslationsContext.js");
/* harmony import */ var _ApiContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ApiContext */ "./src/rer/customersatisfaction/browser/static/react/javascripts/ApiContext.js");
/* harmony import */ var _utils_apiFetch__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils/apiFetch */ "./src/rer/customersatisfaction/browser/static/react/javascripts/utils/apiFetch.js");
/* harmony import */ var _CSV_ExportCSV__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../CSV/ExportCSV */ "./src/rer/customersatisfaction/browser/static/react/javascripts/history/CSV/ExportCSV.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils */ "./src/rer/customersatisfaction/browser/static/react/javascripts/history/utils.js");
/* harmony import */ var _Menu_less__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Menu.less */ "./src/rer/customersatisfaction/browser/static/react/javascripts/history/Menu/Menu.less");
/* harmony import */ var _Menu_less__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_Menu_less__WEBPACK_IMPORTED_MODULE_7__);









var Menu = function Menu() {
  var getTranslationFor = Object(react__WEBPACK_IMPORTED_MODULE_0__["useContext"])(_TranslationsContext__WEBPACK_IMPORTED_MODULE_1__["TranslationsContext"]);

  var _useContext = Object(react__WEBPACK_IMPORTED_MODULE_0__["useContext"])(_ApiContext__WEBPACK_IMPORTED_MODULE_2__["ApiContext"]),
      portalUrl = _useContext.portalUrl,
      fetchApi = _useContext.fetchApi,
      handleApiResponse = _useContext.handleApiResponse,
      apiErrors = _useContext.apiErrors,
      endpoint = _useContext.endpoint,
      setApiErrors = _useContext.setApiErrors,
      canDelete = _useContext.canDelete;

  var labels = Object(_utils__WEBPACK_IMPORTED_MODULE_6__["getCustomerSatisfactionLables"])(getTranslationFor);

  var clearData = function clearData() {
    if (window.confirm(labels.deleteFeedbacksConfirm)) {
      var fetches = [Object(_utils_apiFetch__WEBPACK_IMPORTED_MODULE_3__["default"])({
        url: portalUrl + '/@' + endpoint + '-clear',
        method: 'GET'
      })];
      Promise.all(fetches).then(function (data) {
        handleApiResponse(data[0]);
        fetchApi();
      });
    }
  };

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "customersatisfaction-menu-wrapper"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "left-zone"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
    onClick: function onClick() {
      return Object(_CSV_ExportCSV__WEBPACK_IMPORTED_MODULE_4__["downloadCSV"])(portalUrl, endpoint, setApiErrors, getTranslationFor);
    },
    className: "plone-btn plone-btn-primary context"
  }, labels.exportCsv, ' ', /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
    className: "fa fas fa-download fa-lg fa-fw",
    "aria-hidden": true
  }))), canDelete && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "right-zone"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
    onClick: function onClick() {
      return clearData();
    },
    className: "plone-btn plone-btn-danger"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
    className: "fa fa-trash fa-lg fa-fw",
    "aria-hidden": true
  }), ' ', labels.deleteFeedbacks))), apiErrors && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "errors"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("dl", {
    className: "portalMessage error",
    role: "alert"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("dt", null, "Error. Status code: ", apiErrors.status), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("dd", null, apiErrors.statusText))));
};

Menu.propTypes = {
  editUser: prop_types__WEBPACK_IMPORTED_MODULE_5___default.a.func,
  setShowImportCSV: prop_types__WEBPACK_IMPORTED_MODULE_5___default.a.func
};
/* harmony default export */ __webpack_exports__["default"] = (Menu);

/***/ }),

/***/ "./src/rer/customersatisfaction/browser/static/react/javascripts/history/Menu/Menu.less":
/*!**********************************************************************************************!*\
  !*** ./src/rer/customersatisfaction/browser/static/react/javascripts/history/Menu/Menu.less ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

throw new Error("Module build failed (from ./node_modules/mini-css-extract-plugin/dist/loader.js):\nModuleBuildError: Module build failed: Error: ENOENT: no such file or directory, open '/Users/cekk/work/rer/regione-er-5/src/rer.customersatisfaction/node_modules/css-loader/dist/runtime/api.js'\n    at runLoaders (/Users/cekk/work/rer/regione-er-5/src/rer.customersatisfaction/node_modules/webpack/lib/NormalModule.js:316:20)\n    at /Users/cekk/work/rer/regione-er-5/src/rer.customersatisfaction/node_modules/loader-runner/lib/LoaderRunner.js:367:11\n    at /Users/cekk/work/rer/regione-er-5/src/rer.customersatisfaction/node_modules/loader-runner/lib/LoaderRunner.js:203:19\n    at process.nextTick (/Users/cekk/work/rer/regione-er-5/src/rer.customersatisfaction/node_modules/enhanced-resolve/lib/CachedInputFileSystem.js:85:15)\n    at process._tickCallback (internal/process/next_tick.js:61:11)");

/***/ }),

/***/ "./src/rer/customersatisfaction/browser/static/react/javascripts/history/index.js":
/*!****************************************************************************************!*\
  !*** ./src/rer/customersatisfaction/browser/static/react/javascripts/history/index.js ***!
  \****************************************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _App__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./App */ "./src/rer/customersatisfaction/browser/static/react/javascripts/history/App.js");



var rootElement = document.getElementById('customer-satisfaction-history-wrapper');
react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_App__WEBPACK_IMPORTED_MODULE_2__["default"], {
  canDelete: JSON.parse(rootElement.dataset.candelete)
}), rootElement);

/***/ }),

/***/ "./src/rer/customersatisfaction/browser/static/react/javascripts/history/utils.js":
/*!****************************************************************************************!*\
  !*** ./src/rer/customersatisfaction/browser/static/react/javascripts/history/utils.js ***!
  \****************************************************************************************/
/*! exports provided: getCustomerSatisfactionLables */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCustomerSatisfactionLables", function() { return getCustomerSatisfactionLables; });
var getCustomerSatisfactionLables = function getCustomerSatisfactionLables(getTranslationFor) {
  return {
    page: getTranslationFor('page_label', 'Page'),
    ok: getTranslationFor('positive_votes_label', 'Positive votes'),
    nok: getTranslationFor('negative_votes_label', 'Negative votes'),
    last_voted: getTranslationFor('last_voted_label', 'Last voted'),
    comments: getTranslationFor('comments_label', 'Comments'),
    filterTitle: getTranslationFor('filter_title_label', 'Filter title'),
    search: getTranslationFor('search_label', 'Search...'),
    noData: getTranslationFor('no_data_label', 'No customer satisfaction data found'),
    deleteFeedbacks: getTranslationFor('delete_feedbacks_label', 'Delete all feedbacks'),
    deleteFeedbacksConfirm: getTranslationFor('delete_feedbacks_confirm_label', 'Are you sure you want to delete all feedbacks?'),
    exportCsv: getTranslationFor('export_csv_label', 'Export in CSV'),
    singularSelected: getTranslationFor('item_selected', 'item selected'),
    pluralSelected: getTranslationFor('items_selected', 'items selected'),
    resetFeedbacksConfirm: getTranslationFor('reset_feedbacks_confirm_label', 'Are you sure you want to reset this page\'s feedbacks?'),
    resetFeedbacksButton: getTranslationFor('reset_feedbacks_label', 'Reset feedbacks')
  };
};

/***/ }),

/***/ "./src/rer/customersatisfaction/browser/static/react/javascripts/utils/apiFetch.js":
/*!*****************************************************************************************!*\
  !*** ./src/rer/customersatisfaction/browser/static/react/javascripts/utils/apiFetch.js ***!
  \*****************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }



var parseParams = function parseParams(params) {
  var keys = Object.keys(params);
  var options = '';
  keys.forEach(function (key) {
    var isParamTypeObject = _typeof(params[key]) === 'object';
    var isParamTypeArray = isParamTypeObject && params[key].length >= 0;

    if (!isParamTypeObject) {
      options += "".concat(key, "=").concat(params[key], "&");
    }

    if (isParamTypeObject && isParamTypeArray) {
      params[key].forEach(function (element) {
        options += "".concat(key, "=").concat(element, "&");
      });
    }
  });
  return options ? options.slice(0, -1) : options;
};

var apiFetch = function apiFetch(_ref) {
  var url = _ref.url,
      params = _ref.params,
      method = _ref.method;

  if (!method) {
    method = 'GET';
  }

  var headers = {
    Accept: 'application/json'
  };
  return axios__WEBPACK_IMPORTED_MODULE_0___default()({
    method: method,
    url: url,
    params: method == 'GET' ? params : null,
    data: ['POST', 'PATCH'].indexOf(method) >= 0 ? params : null,
    //paramsSerializer: params => parseParams(params),
    headers: headers
  });
};

/* harmony default export */ __webpack_exports__["default"] = (apiFetch);

/***/ }),

/***/ 0:
/*!****************************************************************************************************************************************************************************!*\
  !*** multi (webpack)-dev-server/client?http://localhost:3000 (webpack)/hot/dev-server.js ./src/rer/customersatisfaction/browser/static/react/javascripts/history/index.js ***!
  \****************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! /Users/cekk/work/rer/regione-er-5/src/rer.customersatisfaction/node_modules/webpack-dev-server/client/index.js?http://localhost:3000 */"./node_modules/webpack-dev-server/client/index.js?http://localhost:3000");
__webpack_require__(/*! /Users/cekk/work/rer/regione-er-5/src/rer.customersatisfaction/node_modules/webpack/hot/dev-server.js */"./node_modules/webpack/hot/dev-server.js");
module.exports = __webpack_require__(/*! /Users/cekk/work/rer/regione-er-5/src/rer.customersatisfaction/src/rer/customersatisfaction/browser/static/react/javascripts/history/index.js */"./src/rer/customersatisfaction/browser/static/react/javascripts/history/index.js");


/***/ })

/******/ });
//# sourceMappingURL=history.js.map