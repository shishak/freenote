var FirepadUserList = function() {
		function e(t, i, r, s) {
			if (!(this instanceof e)) return new e(t, i, r, s);
			this.ref_ = t, this.userId_ = r, this.place_ = i, this.firebaseCallbacks_ = [];
			var a = this;
			this.hasName_ = !! s, this.displayName_ = s || "User " + Math.floor(1e3 * Math.random()), this.firebaseOn_(t.root.child(".info/connected"), "value", function(e) {
				if (!0 === e.val() && a.displayName_) {
					var i = t.child(a.userId_).child("name");
					i.onDisconnect().remove(), i.set(a.displayName_)
				}
			}), this.userList_ = this.makeUserList_(), i.appendChild(this.userList_)
		}
		function t(e) {
			return "string" == typeof e && (e.match(/^#[a-fA-F0-9]{3,6}$/) || "transparent" == e)
		}
		function i(e, t, i) {
			var s = document.createElement(e);
			if ("string" == typeof t) r(s, t);
			else if (t) for (var a = 0; a < t.length; ++a) s.appendChild(t[a]);
			for (var n in i || {}) s.setAttribute(n, i[n]);
			return s
		}
		function r(e, t) {
			e.innerHTML = "", e.appendChild(document.createTextNode(t))
		}
		function s(e, t, i) {
			e.addEventListener ? e.addEventListener(t, i, !1) : e.attachEvent && e.attachEvent("on" + t, i)
		}
		function a(e, t, i) {
			e.removeEventListener ? e.removeEventListener(t, i, !1) : e.detachEvent && e.detachEvent("on" + t, i)
		}
		function n(e) {
			e.preventDefault ? e.preventDefault() : e.returnValue = !1
		}
		function l(e) {
			e.stopPropagation ? e.stopPropagation() : e.cancelBubble = !0
		}
		function o(e) {
			n(e), l(e)
		}
		return e.fromDiv = e, e.prototype.dispose = function() {
			this.removeFirebaseCallbacks_(), this.ref_.child(this.userId_).child("name").remove(), this.place_.removeChild(this.userList_)
		}, e.prototype.makeUserList_ = function() {
			return i("div", [this.makeHeading_(), i("div", [this.makeUserEntryForSelf_(), this.makeUserEntriesForOthers_()], {
				class: "firepad-userlist-users"
			})], {
				class: "firepad-userlist"
			})
		}, e.prototype.makeHeading_ = function() {
			var e = i("span", "0");
			return this.firebaseOn_(this.ref_, "value", function(t) {
				r(e, "" + t.numChildren())
			}), i("div", {
				class: "firepad-userlist-heading"
			})
		}, e.prototype.makeUserEntryForSelf_ = function() {
			var e = this.ref_.child(this.userId_),
				r = i("div", null, {
					class: "firepad-userlist-color-indicator"
				});
			this.firebaseOn_(e.child("color"), "value", function(e) {
				var i = e.val();
				t(i) && (r.style.backgroundColor = i)
			});
			var a = i("input", null, {
				type: "text",
				class: "firepad-userlist-name-input"
			});
			a.value = this.displayName_;
			var n = i("div", {
				class: "firepad-userlist-name-hint"
			});
			this.hasName_ && (n.style.display = "none");
			var l = this;
			s(a, "change", function(t) {
				var i = a.value || "Guest " + Math.floor(1e3 * Math.random());
				e.child("name").onDisconnect().remove(), e.child("name").set(i), n.style.display = "none", a.blur(), l.displayName_ = i, o(t)
			});
			var c = i("div", [a, n]);
			return i("div", [r, c], {
				class: "firepad-userlist-user firepad-user-" + this.userId_
			})
		}, e.prototype.makeUserEntriesForOthers_ = function() {
			function e(e, n) {
				var l = e.key,
					o = a[l];
				o && (s.removeChild(o), delete a[l]);
				var c = e.child("name").val();
				"string" != typeof c && (c = "Guest"), c = c.substring(0, 20);
				var f = e.child("color").val();
				t(f) || (f = "#ffb");
				var d = i("div", null, {
					class: "firepad-userlist-color-indicator"
				});
				d.style.backgroundColor = f;
				var h = i("div", c || "Guest", {
					class: "firepad-userlist-name"
				}),
					u = i("div", [d, h], {
						class: "firepad-userlist-user firepad-user-" + l
					});
				a[l] = u, l === r.userId_ && (u.style.display = "none");
				var v = n ? a[n].nextSibling : s.firstChild;
				s.insertBefore(u, v)
			}
			var r = this,
				s = i("div"),
				a = {};
			return this.firebaseOn_(this.ref_, "child_added", e), this.firebaseOn_(this.ref_, "child_changed", e), this.firebaseOn_(this.ref_, "child_moved", e), this.firebaseOn_(this.ref_, "child_removed", function(e) {
				var t = e.key,
					i = a[t];
				i && (s.removeChild(i), delete a[t])
			}), s
		}, e.prototype.firebaseOn_ = function(e, t, i, r) {
			return this.firebaseCallbacks_.push({
				ref: e,
				eventType: t,
				callback: i,
				context: r
			}), e.on(t, i, r), i
		}, e.prototype.firebaseOff_ = function(e, t, i, r) {
			e.off(t, i, r);
			for (var s = 0; s < this.firebaseCallbacks_.length; s++) {
				var a = this.firebaseCallbacks_[s];
				if (a.ref === e && a.eventType === t && a.callback === i && a.context === r) {
					this.firebaseCallbacks_.splice(s, 1);
					break
				}
			}
		}, e.prototype.removeFirebaseCallbacks_ = function() {
			for (var e = 0; e < this.firebaseCallbacks_.length; e++) {
				var t = this.firebaseCallbacks_[e];
				t.ref.off(t.eventType, t.callback, t.context)
			}
			this.firebaseCallbacks_ = []
		}, e
	}();