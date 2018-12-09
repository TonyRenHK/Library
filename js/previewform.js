var isValidate = true;

function initRadio() { $("li[typ='radio']", "#fields").each(function(f, b) { var d = $(b),
            g = d.find("div.content"); if (d.has("fieldset").length > 0) { g = g.find("fieldset") } var e = function() { var j = $(this).parent().parent(),
                i = $.trim($(this).val()); if (!i) { i = "其它" } j.find(":radio.other").val(i) };
        g.find(":text.other").bind({ keyup: e, change: e, click: function(c) { $(this).parent().parent().find(":radio.other").prop("checked", true);
                highlight(c, this) } }) }); if (!window.isForMobile) { var a = null;
        $(":radio").bind({ click: function(b) { if (a === this) { $(a).prop("checked", false).trigger("change");
                    a = null } else { a = this; if ($(this).hasClass("other")) { $(this).parent().find(":text.other").focus() } } b.stopPropagation() } });
        $("table.table td").click(function() { var b = $(this).find(":radio");
            b.attr("checked", true) }) } }

function randomRadio() { $("li[typ='radio']", "#fields").each(function(f, q) { var b = $(q),
            m = b.find("div.content"); if (b.has("fieldset").length > 0) { m = m.find("fieldset") } if (b.attr("random") == "1") { var a = [],
                g = m.children(); if (g.length == 0) { g = m.find(">label") } var o = $(g[g.length - 1]).find(":radio").hasClass("other"),
                k, d = g.length; if (o) { k = g[g.length - 1];
                d = g.length - 1 } while (a.length < d) { var n = Math.random();
                n = Math.round(n * (d - 1)); if ($.inArray(n, a) === -1) { a.push(n) } } m.empty(); for (var e = 0; e < d; e++) { m.append(g[a[e]]) } if (o) { m.append(k) } m.prepend(m.find("p.instruct")) } m.find(">label:eq(0)").addClass("first") }) }

function initUpload() { var b = function(d) { var i; if ($("#_id").val()) { var k = d.find("div.content"),
                    j = k.find("input.fileSize").attr("name"),
                    g = k.find("input.fileId").attr("name"),
                    f = k.find("input.fileType").val(),
                    e = [g.substring(0, j.indexOf("_")), k.find("input.fileType").attr("name"), j.substring(0, j.indexOf("_")), k.find("input.fileName").attr("name")];
                i = { ENTRYID: $("#_id").val(), FRMID: $("#FRMID").val(), FILEID: k.find("input.fileId").val(), FILETYPE: f, FILEFIELDS: e, FLDID: d.attr("id") } } else { i = { FRMID: $("#FRMID").val(), FLDID: d.attr("id") } } return i },
        a = function(d, e) { var f = d.find("div.content"); if (e.status === "success") { d.removeClass("error").find("p.errMsg").remove();
                f.find("div.uploadedFile").show(); if ($.isImage(e.fileName)) { f.find("span.uploadedFileName").html($.format('<img class="img-edit" src="{0}" />', IMAGEURL + e.fileId + e.fileType + FILEIMAGEEDITSTYLE)) } else { f.find("span.uploadedFileName").text($.format("{0}({1})", e.fileName, $.formatFileSize(e.fileSize))) } f.find("input.fileId").val(e.fileId).trigger("change");
                f.find("input.fileName").val(e.fileName).trigger("change");
                f.find("input.fileSize").val(e.fileSize).trigger("change");
                f.find("input.fileType").val(e.fileType).trigger("change") } else { if (e.status === "error") { showErrorMsg(d, $.format(msg[e.errCode], e.msg));
                    f.find("input.fileId").val("").trigger("change");
                    f.find("input.fileName").val("").trigger("change");
                    f.find("input.fileSize").val("").trigger("change");
                    f.find("input.fileType").val("").trigger("change") } } $("#btnSubmit").prop("disabled", false);
            $.hideStatus() };
    $("#fields").find("input.file").each(function(e, d) { var g = $(d),
            c = g.parent().parent(),
            j;
        g.localResizeIMG({ cprs: c.attr("cprs"), quality: 0.5, before: function(i, f) { j = $(i).val().match(/[^\/\\]*$/)[0];
                $.showStatus("正在上传文件...") }, unsupport: function() { ajaxUpload(c) }, success: function(f) { var i = $.extend(b(c), { IMAGENAME: j, IMAGEDATA: f.clearBase64 }); if (i.FILEFIELDS) { i.FILEFIELDS = i.FILEFIELDS.join(",") } jQuery.ajax({ url: "/web/formview/compressandupload", data: i, type: "post", contentType: "application/x-www-form-urlencoded", dataType: "json", success: function(l, k) { a(c, l);
                        $.hideStatus() }, error: function(l, k, m) { showErrorMsg(c, $.format(msg.uploadError, m));
                        isValidate = true;
                        $("#btnSubmit").prop("disabled", false);
                        $.hideStatus(); return false } }) } }) });
    $("a.deleteIcon", "#fields").live({ click: function() { if (!$(this).parent().find("img").attr("src")) { $(this).parent().remove() } else { var k; if (arguments.length == 2) { k = arguments[1].notShowConfirm } if (k == "1" || confirm("删除后不可恢复，确认删除吗？")) { var q = $(this).parents(".content"),
                        o = $(this).parent(),
                        i, l = "/web/formview/deletefile"; if ($("#_id").val()) { var r = q.find("input.fileSize").attr("name"),
                            e = q.find("input.fileId").attr("name"),
                            t = q.find("input.fileType").val(),
                            g = [e.substring(0, r.indexOf("_")), q.find("input.fileType").attr("name"), r.substring(0, r.indexOf("_")), q.find("input.fileName").attr("name")]; var m = $(this).parent().index(); var j = $(this).parents("li").find(".fileName").val().split(",")[m]; var f = $(this).parents("li").find(".fileId").val().split(",")[m]; var n = j.split(".").length;
                        i = { ENTRYID: $("#_id").val(), FRMID: $("#FRMID").val(), FILEID: f, FILETYPE: "." + j.split(".")[n - 1], FILEFIELDS: g, INITTIME: INITTIME };
                        l = "/web/entries/deletefile" } else { var m = $(o).index();
                        i = { FRMID: $("#FRMID").val(), FILEID: q.find("input.fileId").val().toString().split(",")[m], FILETYPE: q.find("input.fileType").val().toString().split(",")[m] } } $.showStatus("正在删除文件...");
                    $.postJSON(l, i, function(D) { if (D) { $.alert(D.ERRMSG);
                            $.hideStatus(); return } var A = $(o).index(); var d = q.find("input.fileId").val().toString().split(","); var x = q.find("input.fileName").val().toString().split(","); var u = q.find("input.fileSize").val().toString().split(","); var C = q.find("input.fileType").val().toString().split(",");
                        d.splice(A, 1);
                        x.splice(A, 1);
                        u.splice(A, 1);
                        C.splice(A, 1);
                        o.remove(); var B = q.find("input.fileId"),
                            z = q.find("input.fileName"),
                            v = q.find("input.fileSize"),
                            c = q.find("input.fileType");
                        B.val(d).trigger("change");
                        z.val(x).trigger("change");
                        v.val(u).trigger("change");
                        c.val(C).trigger("change"); if ($("#_id").val()) { var y = {};
                            y[B.attr("name").split("_")[0]] = d.join(",");
                            y[z.attr("name").split("_")[0]] = x.join(",");
                            y[v.attr("name").split("_")[0]] = u.join(",");
                            y[c.attr("name").split("_")[0]] = C.join(",");
                            $.postJSON("/web/formview/updateentry", { FRMID: $("#FRMID").val(), ENTRYID: $("#_id").val(), DATA: y }, function() {}) } $.hideStatus() }) } } var s = $("p.error", "#fields").length; if (!s) { $(".selectfiles").prop("disabled", false);
                $("#btnSubmit").prop("disabled", false);
                $("#btnSave").removeClass("disabled");
                $("#btnCancelSave").prop("disabled", false) } return false } }) }
var calShopCard = function() { var i = false,
        a, j, g, l, d, b, f = 0,
        m = 0,
        k = 0;
    $("#fields>li[TYP='goods']").each(function(o, n) { a = $(n);
        j = $("#ul" + a.attr("id")).empty(); if (!a.is(":visible")) { return true } a.find("div.goods-item").each(function(q, r) { var s = $(r);
            d = parseFloat(s.find("input.number").val()) || 0;
            l = s.find("div.price").text();
            g = parseFloat(l.replace(/[¥$£€]/, "")) || 0;
            b = s.find("label.name").text(); if (d > 0) { j.append($.format("<li><span class='goods-name'>{0}</span><span class='price-number'>{1} × {2}</span></li>", b, l, d));
                k += d * g;
                i = true } }) });
    k = k.toFixed(2);
    f = k; var c = parseFloat($("#shopping_cart").find("span.salem").text()) || 0,
        e = parseFloat($("#shopping_cart").find("span.salej").text()) || 0; if (c > 0 && e > 0) { m = (Math.floor(k / c) * e).toFixed(2);
        f = (k - m).toFixed(2) } $("#amount").val(f);
    $("#amount").change(); if (i) { $("#shopping_cart").show().find("span.total").text(k).end().find("span.amount").text(f); if (m > 0) { $("#shopping_cart").find("div.discount-container").show().find("span.discount").text(m) } else { $("#shopping_cart").find("div.discount-container").hide() } } else { $("#shopping_cart").hide() } };

function initGoods() { $("#fields div.goods-item a.decrease,#fields div.goods-item a.increase").click(function() { var d = $(this).parent(),
            b = d.find("input.number"),
            a = parseFloat(b.val()) || 0; if ($(this).hasClass("decrease")) { if (a >= 1) { b.val(--a) } } else { b.val(++a) } calShopCard(); return false });
    $("#fields div.goods-item").find("input.number").bind({ blur: function() { calShopCard() } });
    $("#fields div.goods-item").find("input.number").trigger("blur") }

function initAuthCode() { var a = function(b, d) { d.click(function() { var g = $(this).attr("tmpidx"),
                f = $("#btnSendCode" + g),
                i = b.getValidate(); if (!i) { $.alert("请先完成验证。"); return false } if (f.hasClass("disabled")) { return false } var e = $("div.content").has(f).find("input.phone").val(); if (!$.isMobile(e)) { $.alert("请输入正确的手机号码。"); return false } $.ajax({ url: "/web/VerifyLoginServlet", type: "post", dataType: "json", data: { geetest_challenge: i.geetest_challenge, geetest_validate: i.geetest_validate, geetest_seccode: i.geetest_seccode, TEL: e, TYP: "form", FRMID: $("#FRMID").val(), SIGN: f.attr("SIGN") }, success: function(l) { if (l && (l.status === "success")) { var k = f.attr("tmpidx"),
                            m = $("#btnSendCode" + k);
                        m.text("120").prop("disabled", true).addClass("disabled"); var j = setInterval(function() { var n = parseInt(m.text()); if (n > 0) { m.text(--n) } else { m.text("发送验证码").prop("disabled", false);
                                m.removeClass("disabled");
                                clearInterval(j) } }, 1000); if (l.sendcount <= 0) { clearInterval(j);
                            m.text("发送验证码").prop("disabled", false).removeClass("disabled");
                            $.alert("发送验证码失败：可用短信量不足，需要充值，请与表单创建者联系。") } return false } else { $.alert("验证失败") } } }); return false }); var c = d.attr("tmpIdx");
        b.bindOn("#btnSendCode" + c);
        b.appendTo("#popupCaptcha" + c) }; if ($("#fields").find("button.sendcode").length > 0) { $("#fields").find("button.sendcode").each(function(c, b) { $.ajax({ url: "/web/StartCaptchaServlet", type: "get", dataType: "json", success: function(d) { initGeetest({ gt: d.gt, challenge: d.challenge, product: "popup", offline: !d.success }, function(e) { a(e, $(b)) }) } }) }) } }

function initInstruct() { var a = $("#fields>li");
    $.each(a, function(d, b) { var e = $(b).find("p.instruct").removeClass("hide"); var f = $(b).attr("id"); if (f && f.indexOf("au") == 0) { var c = f.substr(2);
            $("#" + c).children("div.content").prepend(e) } else { $(b).children("div.content").prepend(e) } }) }

function initAddress() { var b = [];
    $("#fields>li[typ='address']").each(function(g, e) { e = $(e); if (e.attr("autoaddr") == "1") { b.push(e) } var k = e.attr("def"),
            d, l = e.find("select.province"),
            m = e.find("select.city"),
            j = e.find("select.zip"),
            f = ""; if (k) { d = k.split("-") } $.each(address.provinces, function(n, i) { f += $.format("<option value='{0}'>{1}</option>", n, n) });
        l.append(f);
        l.change(function() { var i = $(this).val();
            m.empty().append("<option value=''>市</option>");
            j.empty().append("<option value=''>区/县</option>"); if (i) { var n = "";
                $.each(address.provinces[i], function(q, o) { n += $.format('<option value="{0}">{1}</option>', q, q) });
                m.append(n) } });
        m.change(function() { var i = e.find("select.province").val(),
                o = $(this).val();
            j.empty().append("<option value=''>区/县</option>"); if (o) { var n = "";
                $.each(address.provinces[i][o], function(r, q) { n += $.format('<option value="{0}">{1}</option>', q, q) });
                j.append(n) } }); if (d && d[0]) { l.val(d[0]);
            l.trigger("change") } if (d && d[1]) { m.val(d[1]);
            m.trigger("change") } if (d && d[2]) { j.val(d[2]) } }); if (b.length > 0) { var a = $("<div id='autoaddrcontainer' class='hide'></div>"); var c = new AMap.Map(a.attr("id"), { zoom: 13 });
        c.plugin("AMap.Geolocation", function() { var d = new AMap.Geolocation({ enableHighAccuracy: true, timeout: 10000, buttonOffset: new AMap.Pixel(10, 20), zoomToAccuracy: true, buttonPosition: "RB" });
            d.getCurrentPosition();
            AMap.event.addListener(d, "complete", e);
            AMap.event.addListener(d, "error", function(f) { console.log(JSON.stringify(f)) });

            function e(f) { 
                console.log(JSON.stringify(f));
                $.each(b, function(g, j) { $(j).find("select.province").val(f.addressComponent.province);
                    $(j).find("select.province").trigger("change");
                    $(j).find("select.city").val(f.addressComponent.city);
                    $(j).find("select.city").trigger("change");
                    $(j).find("select.zip").val(f.addressComponent.district);
                    $(j).find("textarea.detail").val(f.formattedAddress) }) } }) } }

function initMap() { $("#fields").find("div.map").each(function(f, r) { var o = $(r).parent(),
            g = o.find("input.location"),
            e = o.find("input.j"),
            q = o.find("input.w"),
            l = o.find("button.getlocation,button.getlocation1"),
            s = o.find("button.marker"); var d, n, m; var a = function(t) { e.val(t.longitude);
            q.val(t.latitude); var i = new AMap.LngLat(t.longitude, t.latitude);
            d.clearMap(); var c = new AMap.Marker({});
            c.setPosition(i);
            c.setMap(d);
            d.setCenter(i);
            m.getAddress(i) }; var b = function(c) { var i = {};
                i.latitude = c.position.getLat();
                i.longitude = c.position.getLng();
                a(i) },
            k = function() { if (typeof(CURPOS) === "undefined" || (CURPOS.longitude == undefined || CURPOS.latitude == undefined)) { $.alert("获取地址位置失败，请检查GPS是否打开，然后重试一次。") } else { a(CURPOS) } $.hideStatus() },
            j = function(c) { g.val(c.regeocode.formattedAddress);
                g.removeClass("hide").show();
                g.trigger("change");
                l.text("重新获取").parent();
                $.hideStatus() }; var d = new AMap.Map($(r).attr("id"), { zoom: 13 });
        d.plugin(["AMap.Geolocation", "AMap.Geocoder"], function() { n = new AMap.Geolocation({});
            m = new AMap.Geocoder({ radius: 1000, extensions: "all" });
            d.addControl(n);
            AMap.event.addListener(n, "complete", b);
            AMap.event.addListener(n, "error", k);
            AMap.event.addListener(m, "complete", j) });
        $(r).data("map", d);
        AMap.event.addListener(d, "click", function(t) { d.clearMap(); var c = new AMap.Marker({});
            e.val(t.lnglat.getLng());
            q.val(t.lnglat.getLat()); var i = new AMap.LngLat(t.lnglat.getLng(), t.lnglat.getLat());
            c.setPosition(i);
            c.setMap(d);
            m.getAddress(i) });
        l.click(function() { $.showStatus();
            n.getCurrentPosition() });
        s.click(function() { var c = o.find("div.map"); if (!c.hasClass("hide")) { c.addClass("hide") } else { c.removeClass("hide") } o.find("input.location").show(); return false });
        g.change(function() { if (!$(this).val()) { e.val("");
                q.val("") } }) }) }

function highlight(d, b) { var a = $("li").has(b),
        c = a.attr("typ");
    $("li.focused").removeClass("focused"); if (!a.hasClass("error")) { a.addClass("focused") } d.stopPropagation() }

function initYzjMenu() { var b = $("#formHeader h2").text(); if ($.isYzjApp() && !window.ISMBLEDIT) { XuntongJSBridge.call("setWebViewTitle", { title: b }); var a = [{ text: "我的表单", callBackId: "myFormButton" }, { text: "我的报表", callBackId: "myReportButton" }, { text: "创建表单", callBackId: "newFormButton" }, { text: "我的账户", callBackId: "myAccountButton" }];
        XuntongJSBridge.call("createPop", { popTitle: "...", popTitleCallBackId: "", items: a, menuList: ["forward", "refresh", "openWithBrowser"], shareData: { isShowExt: true, title: b, description: "帮您玩转企业数据，提高营销效率、降低管理成本", appName: "表单大师" } }, function(c) { if (c.success == true || c.success == "true") { var d = c.data ? c.data.callBackId : ""; if (d == "newFormButton") { window.location.href = "/app/formbuilderm1.jsp" } else { if (d == "myAccountButton") { window.location.href = "/app/account/manage" } else { if (d) { window.location.href = "/app/form/manage" } } } } }) } }

function initFocus() { if (window.isForMobile) { $("#fields").find(".controlgroup>label,table.table label").bind({ click: function(a) { a.stopPropagation() } });
        $("[typ='file']").click(function() { if (!$(this).hasClass("focused")) { $("li.focused").removeClass("focused"); var a = $(this).attr("typ"); if (a != "section" && a != "html" && a != "image" && a != "goods") { $(this).addClass("focused").end().find(":input:eq(0)").focus() } } }); return } $(".fld").bind({ click: function(a) { highlight(a, this) }, focus: function(a) { highlight(a, this) } });
    $("#fields>li[id]").click(function() { if (!$(this).hasClass("focused")) { $("li.focused").removeClass("focused"); var a = $(this).attr("typ"); if (a != "section" && a != "html" && a != "image" && a != "goods") { $(this).addClass("focused").end().find(":input:eq(0)").focus() } } }) }

function updateSelects(a, b) { var d = $(b).is("li") ? $(b) : $(b).parent().parent(); if (a && d.find("input.yyyy").length > 0) { d.find("input.yyyy").val(a.getFullYear());
        d.find("input.mm").val($.formatHH(a.getMonth() + 1));
        d.find("input.dd").val($.formatHH(a.getDate()));
        d.find("input.val").val($.getDate(d)).trigger("change") } else { d.find("input.val").val(a).trigger("change") } }

function initNumberInput() { var e = function(k) { var j = k.find("input.tel1").val(),
                i = k.find("input.tel2").val(),
                g = k.find("input.tel3").val(); if (j || i) { return $.format("{0}-{1}-{2}", j, i, g) } else { return "" } },
        f = function(i) { var g = $(this).val(),
                j = $(this).parent().parent();
            $(this).val(g.replace(/^\+\D/g, ""));
            j.find(".val").val(e(j)) },
        b = function(i) { var g = $(this).val(),
                j = $(this).parent().parent();
            $(this).val(g.replace(/\D/g, ""));
            j.find(".val").val($.getTime(j)).trigger("change") },
        d = function(i) { var g = $(this).val(),
                j = $(this).parent().parent();
            $(this).val(g.replace(/\D/g, ""));
            j.find(".val").val($.getDate(j)).trigger("change") },
        c = function(k) { if (window.isForMobile) { var i = $(this).attr("maxlength"); if (!i) { i = 16 } var g = $(this).val(); if (g.length > i) { $(this).val(g.slice(0, i)) } return } var j = $(this).val();
            $(this).val(j.replace(/[^(\-?\d\.?)]/g, "").replace(/[\(\)\?]/g, "")) },
        a = function() { var g = $(this).val(),
                i = $(this).parent().parent();
            $(this).val(g.replace(/-/g, ""));
            i.find(".val").val($.getName(i)).trigger("change") };
    $("select.hh,select.mi", "#fields").live({ change: function() { var j = $(this).parent().parent(),
                i = j.find("select.hh").val(),
                g = j.find("select.mi").val(); if (i && g) { j.find(".val").val($.format("{0}:{1}", i, g)) } else { j.find(".val").val("") } } });
    $("input.yyyy,input.mm,input.dd", "#fields").bind({ keyup: d, change: d });
    $("input.number,input.money", "#fields").bind({ keyup: c, change: c });
    $("input.n1,input.n2,input.n3", "#fields").bind({ keyup: a, change: a });
    $("input.authcode,input.phone,input.tel1,input.tel2,input.tel3", "#fields").bind({ keyup: f, change: f }) }

function initDropdown2() { var a = 5; for (var b = 1; b < a; b++) { $("#fields").find("select.dd" + b).bind({ change: function() { var e = $(this).find("option:selected").attr("items"); var f = []; if (e) { f = JSON.parse(e) } else { f.push({ VAL: "" }) } var d = parseInt($(this).attr("level")); var c = $(this).parent().find("select.dd" + (d + 1));
                c.empty();
                $.each(f, function(g, j) { if (j.ITMS) { c.append($.format("<option items='{0}' value='{1}'>{1}</option>", JSON.stringify(j.ITMS), j.VAL)) } else { c.append($.format("<option value='{0}'>{0}</option>", j.VAL)) } });
                c.trigger("change") } }).trigger("change") } } FieldRelation = { fillAutoCompValue: function(a) { var c = a.val(),
            b = a.attr("matfrm"),
            e = a.attr("matfld"),
            d = a.data("liids"); if (c && b && e) { $.postJSON("/web/formview/getmatchvalue", { FRMID: b, FLD: e, VAL: c, EXFLDS: "", FLDS: a.data("matflds"), EXMAT: "1" }, function(f) { if (f.length > 0) { FieldRelation.setAutoCompValue(d, f[0]) } }) } }, getMatchedText: function(b) { var a = b.indexOf(","); if (a > 0) { return b.substring(0, a) } else { return b } }, updown: function(f, e) { var c = $(f),
            d = c.parent().find("ul.matul"),
            b = d.find("li").length,
            j = d.find("li.selected"),
            i = j.index(),
            g = c.data("oldval"); if (e == 40) { if (i < b - 1) { j.removeClass("selected"); var a = d.find("li:eq(" + (i + 1) + ")");
                a.addClass("selected");
                c.val(a.text()) } else { j.removeClass("selected");
                c.val(g) } } else { if (e == 38) { if (i > 0) { j.removeClass("selected"); var a = d.find("li:eq(" + (i - 1) + ")");
                    a.addClass("selected");
                    c.val(a.text()) } else { if (i == 0) { j.removeClass("selected");
                        c.val(g) } else { var a = d.find("li:eq(" + (b - 1) + ")");
                        a.addClass("selected");
                        c.val(a.text()) } } } } }, getmatchdata: function(i, d) { var f = d.which; if (f == 40 || f == 38 || f == 13) { FieldRelation.updown(i, f); return false } var a = $(i),
            k = a.val(),
            b = a.attr("matfrm"),
            l = a.attr("matfld"),
            j = a.attr("exmat");
        p = a.position(), h = a.outerHeight(), w = a.innerWidth(); var c = a.parent().find("ul.matul"),
            g = $("#fields>li").has(a).attr("ex");
        a.data("oldval", k); if (k) { $.postJSON("/web/formview/getmatchvalue", { FRMID: b, FLD: l, VAL: k, EXFLDS: g ? JSON.parse(g).matfld : "", FLDS: a.data("matflds"), EXMAT: j }, function(e) { if (c.length == 0) { c = $("<ul class='matul'></ul>");
                    a.after(c) } c.css("top", p.top + h);
                c.css("left", p.left);
                c.css("minWidth", w);
                c.empty().show();
                $.each(e, function(q, n) { var r = new RegExp("(" + a.data("oldval") + ")", "g"); var s = "<li>" + n[l].replace(r, "<i>$1</i>"); if (g) { var o = JSON.parse(g).matfld.split(",");
                        $.each(o, function(t, u) { if (u && n[u]) { s += "," + n[u] } }) } s += "</li>"; var m = $(s);
                    m.data("data", n);
                    c.append(m);
                    m.bind({ mouseover: function() { $(this).addClass("selected") }, mouseout: function() { if ($(this).is(":visible")) { $(this).removeClass("selected") } }, mousedown: function() { var u = $(this).parent(),
                                t = u.parent().find("input.fld");
                            FieldRelation.setAutoCompValue(t.data("liids"), $(this).data("data"));
                            t.val(FieldRelation.getMatchedText($(this).text()));
                            $(this).addClass("selected");
                            u.hide() } }) }) }) } else { c.hide() } }, setAutoCompValue: function(d, c) { var a = function(e, g) { var k = e.find("select.province"),
                l = e.find("select.city"),
                f = e.find("select.zip"),
                j = e.find("textarea.detail"),
                i = e.attr("acmpfld").split(",");
            k.val("");
            l.val("");
            f.val("");
            j.val(""); if (g[i[0]]) { k.val(g[i[0]]).trigger("change") } if (g[i[1]]) { l.val(g[i[1]]).trigger("change") } if (g[i[2]]) { f.val(g[i[2]]) } if (g[i[3]]) { j.val(g[i[3]]) } }; var b = function(n, k) { n.find("div.tbl").find("table>tbody>tr:gt(1)").remove(); var e = n.find("div.tbl").attr("name"); var o = [];
            $.each(FLDS, function(q, j) { if (j.NM == e) { o = j.SUBFLDS; return false } }); var m = getAcmpSubTableRowData(o, k); var f = n.find("div.rowAdd"); for (var i = 0; i < m.length; i++) { var l = getSubRowDefaultValue(n.find("div.tbl").find("table>tbody>tr:eq(1)")); var g = $.extend(l, m[i]);
                addRow(f, g, true) } if (n.find("div.tbl").find("table>tbody>tr").length > 2) { n.find("div.tbl").find("table>tbody>tr:eq(1)").remove() } };
        $.each(d, function(k, q) { if (!q) { return true } var s = $("#" + q),
                n = s.attr("acmpfld"),
                o = s.attr("typ"),
                f = s.attr("fmt"),
                r = c[n]; var g = ":text"; if (o != "radio" && o != "checkbox" && o != "table") { s.find("input").val(""); if (r === 0) { s.find("input[name]").val(r) } else { s.find("input[name]").val(r || "") } if ($("#container").attr("mobile") == "1") { g = "input[name]" } } if (o == "date") { $.setDate(s, r) } else { if (o == "grade") { if (r <= s.find("span")["0"].childNodes.length) { $.setGrade(s, r) } else { $.setGrade(s, 0) } } else { if (o === "time") { $.setTime(s, r);
                        g = "input" } else { if (o === "name") { $.setName(s, r) } else { if (o === "phone") { $.setPhone(s, r) } else { if (o == "dropdown") { s.find("select[name]").val("");
                                    s.find("select[name]").val(r || "");
                                    g = "select" } else { if (o == "radio") { s.find("input[name]").prop("checked", false);
                                        s.find("input[value='" + r + "']").trigger("click"); if (s.find("input:radio[value='" + r + "']").length == 0 && s.find("input:radio.other").length != 0) { s.find("input:radio.other").prop("checked", true);
                                            s.find("input.other[type='text']").val(r) } g = ":radio" } else { if (o == "address") { a(s, c);
                                            g = "select" } else { if (o == "name") { $.setName(s, r) } else { if (o == "image") { var m = n.split(","),
                                                        e = c[m[0]],
                                                        l = c[m[1]],
                                                        j = ""; if (e && l) { j = e.split(",")[0] + l.split(",")[0] } if ($.isImage(j)) { s.find(".image-img").attr("src", IMAGEURL + j) } else { s.find(".image-img").attr("src", "/rs/images/defaultimg.png") } } else { if (o == "textarea") { s.find("textarea[name]").val("");
                                                        s.find("textarea[name]").val(r || "") } else { if (o == "table") { b(s, r) } } } } } } } } } } } } if (g == ":checkbox") { s.find(g).trigger("click") } else { s.find(g).trigger("change") } if (o == "date") { s.find("input.val").val(r) } if (o == "address") { a(s, c) } }) }, setAutoCompItemValue: function(b, a) { $.each(b, function(g, r) { var n = $("#" + r).attr("typ"); if (n != "radio" && n != "dropdown") { return true } var e = $("#" + r).attr("fillitem"); if (e != "1") { return true } var q = $("#" + r).attr("acmpsrcfld"); var j = $("#" + r).attr("acmpfld"); var m = $("#" + r).attr("deffillitem"); var l = []; for (var f = 0; f < a.length; f++) { var u = a[f][j]; if (u) { l.push(u) } } if (n == "radio") { var d = $("#" + r).find("div.content"); var c = $(d.find("input:radio")[0]).attr("name");
                d.empty(); if ($("#container").attr("mobile") == 1) { var t = $("<fieldset class='controlgroup'></fieldset>"); if (l.length == 0) { if (!m) { t.append($.tmpl("<label class='first'><input class='rd fld' id='${ID}' type='radio' name='${NAME}' value=''/><label for='${ID}'></label><span>&nbsp;</span></label>", { NAME: c, ID: r + "0" })) } else { t.append($.tmpl("<label class='first'><input class='rd fld' id='${ID}' type='radio' name='${NAME}' value='${VAL}'/><label for='${ID}'></label><span>${VAL}</span></label>", { VAL: m, NAME: c, ID: r + "0" })) } } else { for (var s = 0; s < l.length; s++) { if (s == 0) { t.append($.tmpl("<label class='first'><input class='rd fld' id='${ID}' type='radio' name='${NAME}' value='${VAL}'/><label for='${ID}'></label><span>${VAL}</span></label>", { VAL: l[s], NAME: c, ID: r + s })) } else { t.append($.tmpl("<label><input class='rd fld' id='${ID}' type='radio' name='${NAME}' value='${VAL}'/><label for='${ID}'></label><span>${VAL}</span></label>", { VAL: l[s], NAME: c, ID: r + s })) } } } d.append(t) } else { if (l.length == 0) { if (!m) { d.append($.tmpl("<span><input id='${ID}' name='${NAME}' class='fld' type='radio' value=''/><label for='${ID}'>&nbsp;</label></span>", { NAME: c, ID: r + "0" })) } else { d.append($.tmpl("<span><input id='${ID}' name='${NAME}' checked='checked' class='fld' type='radio' value='${VAL}'/><label for='${ID}'>${VAL}</label></span>", { VAL: m, NAME: c, ID: r + "0" })) } } else { for (var s = 0; s < l.length; s++) { d.append($.tmpl("<span><input id='${ID}' name='${NAME}' class='fld' type='radio' value='${VAL}'/><label for='${ID}'>${VAL}</label></span>", { VAL: l[s], NAME: c, ID: r + s })) } } } } else { if (n == "dropdown") { var o = $("#" + r).find("select[name]");
                    o.empty();
                    o.append("<option></option>"); if (l.length == 0) { if (m) { o.append($.tmpl("<option value='${VAL}' selected='selected'>${NM}</option>", { VAL: m, NM: m })) } } else { for (var s = 0; s < l.length; s++) { o.append($.tmpl("<option value='${VAL}'>${NM}</option>", { VAL: l[s], NM: l[s] })) } } } } }) } };

function initMatchAndAcmp() { $("#fields").find("input[matfrm],select[matfrm]").each(function(i, _txt) { var txt = $(_txt),
            ex = $("#fields>li").has(txt).attr("ex"),
            nm = txt.attr("name"),
            matfld = txt.attr("matfld"),
            fields = [matfld],
            liids = []; if (ex) { var obj = JSON.parse(ex); if (obj.matfld) { var matflds = obj.matfld.split(",");
                $.each(matflds, function(i, v) { fields.push(v);
                    liids.push(null) }) } } $("#fields>li[acmpsrcfld]").each(function(j, li) { var l = $(li),
                acmpsrcfld = l.attr("acmpsrcfld"),
                acmpfld = l.attr("acmpfld"),
                acmsrcflds; if (acmpsrcfld.indexOf(",") > 0) { acmsrcflds = acmpsrcfld.split(",") } var fldname = nm; if (nm.indexOf("_") > 0) { fldname = nm.substring(0, nm.indexOf("_")) } if ((fldname == acmpsrcfld || (acmsrcflds != null && acmsrcflds.indexOf(fldname) >= 0)) && acmpfld) { if (acmpfld.indexOf(",") > 0) { var acmpflds = acmpfld.split(",");
                    fields = fields.concat(acmpflds) } else { fields.push(acmpfld) } liids.push(l.attr("id")) } }); if (txt.is("select")) { txt.bind({ change: function() { var acmpData = eval("(" + $(this).find("option:selected").attr("acmp") + ")"); var txt = $(this),
                        matfrm = txt.attr("matfrm"),
                        matfld = txt.attr("matfld"),
                        exmat = txt.attr("exmat");
                    ex = $("#fields>li").has(txt).attr("ex"); var matli = txt.closest("li"); if (matli.attr("typ") == "address") { var k1 = matli.find("select.province").attr("matfld"); var v1 = matli.find("select.province").val(); var k2 = matli.find("select.city").attr("matfld"); var v2 = matli.find("select.city").val(); var k3 = matli.find("select.zip").attr("matfld"); var v3 = matli.find("select.zip").val(); if (!v1 || !v2 || !v3) { return } var conditions = [];
                        conditions.push({ FLD: k1, CTYP: "eq", DTYP: "string", VAL: v1 });
                        conditions.push({ FLD: k2, CTYP: "eq", DTYP: "string", VAL: v2 });
                        conditions.push({ FLD: k3, CTYP: "eq", DTYP: "string", VAL: v3 });
                        $.postJSON("/web/formview/getmatchvalueadv", { FRMID: matfrm, CONS: conditions, FLDS: fields }, function(list) { if (list.length > 0) { FieldRelation.setAutoCompValue(liids, list[0]) } FieldRelation.setAutoCompItemValue(liids, list) }) } else { if (matli.attr("typ") == "dropdown2") { var finished = true; var conditions = [];
                            $.each(matli.find("select[name]"), function(i, ddl) { var k = $(ddl).attr("matfld"); var v = $(ddl).val(); if (!v) { finished = false; return false } conditions.push({ FLD: k, CTYP: "eq", DTYP: "string", VAL: v }) }); if (!finished) { return } $.postJSON("/web/formview/getmatchvalueadv", { FRMID: matfrm, CONS: conditions, FLDS: fields }, function(list) { if (list.length > 0) { FieldRelation.setAutoCompValue(liids, list[0]) } FieldRelation.setAutoCompItemValue(liids, list) }) } else { $.postJSON("/web/formview/getmatchvalue", { FRMID: matfrm, FLD: matfld, VAL: txt.attr("value"), EXFLDS: ex ? JSON.parse(ex).matfld : "", FLDS: fields, EXMAT: exmat }, function(list) { if (list.length > 0) { FieldRelation.setAutoCompValue(liids, list[0]) } FieldRelation.setAutoCompItemValue(liids, list) }) } } } }) } else { if (txt.attr("type") == "radio") { txt.bind({ click: function() { var txt = $(this),
                            matfrm = txt.attr("matfrm"),
                            matfld = txt.attr("matfld"),
                            exmat = "1";
                        $.postJSON("/web/formview/getmatchvalue", { FRMID: matfrm, FLD: matfld, VAL: txt.attr("value"), EXFLDS: "", FLDS: fields, EXMAT: "1" }, function(list) { if (list.length > 0) { FieldRelation.setAutoCompValue(liids, list[0]) } }) } }) } else { txt.data("matflds", fields);
                txt.data("liids", liids); var keyupTime; var str = "",
                    now = "",
                    filter_time = function(e) { var time = setInterval(function() { filter_staff_from_exist(e) }, 500);
                        txt.bind("blur", function() { clearInterval(time) }) },
                    filter_staff_from_exist = function(e) { now = $.trim(txt.val()); if (now != str) { FieldRelation.getmatchdata(txt, e) } str = now };
                txt.bind({ focus: function(e) { str = $.trim(txt.val());
                        filter_time(e) }, keyup: function(e) { keyupTime = new Date().getTime(), _this = $(this); var keycode = e.which; if (keycode == 40 || keycode == 38) { FieldRelation.getmatchdata(_this, e);
                            now = $.trim(txt.val());
                            str = now; return false } }, keypress: function(e) { var keycode = e.which; if (keycode == 13) { var txt = $(_txt),
                                ul = txt.parent().find("ul.matul"),
                                li = ul.find("li.selected"),
                                idx = li.index(),
                                oldVal = txt.data("oldval"); if (idx >= 0) { txt.val(FieldRelation.getMatchedText(txt.val()));
                                FieldRelation.setAutoCompValue(txt.data("liids"), li.data("data")) } ul.hide(); return false } }, blur: function() { var txt = $(_txt),
                            ul = txt.parent().find("ul.matul"),
                            li = ul.find("li.selected"),
                            idx = li.index(); if (idx >= 0) { FieldRelation.setAutoCompValue(txt.data("liids"), li.data("data")) } ul.hide() } }) } } }) }

function initFieldsPermForView() { if (window.ADVPERM && "1" == ADVPERM.VIEWPERM) { $("#fields").find("li").each(function(c, b) { var a = $(b); if ("1" == ADVPERM.VIEWPERM && $.inArray(a.attr("id"), ADVPERM.VIEWFLDS) == -1) { var d = a.attr("typ") || ""; if ($.inArray(d, ["image", "html", "section", ""]) == -1) { a.addClass("hide") } } }) } }

function showErrorMsg(a, b) { isValidate = false;
    a.addClass("error"); if (a.find("p.errMsg").length === 0) { a.append("<p class='errMsg'></p>") } a.find("p.errMsg").text(b);
    $("#btnSubmit,#btnSave,#btnActSave").prop("disabled", false);
    $.hideStatus() }

function initValidate() { var d = function() { var j = $("li").has(this),
                i = parseInt(j.attr("max")),
                g = $(this).val().length; if (j.find("span.lengthLimit").length === 0) { j.find("label.desc").append("<span class='lengthLimit'></span>") } if (i - g >= 0) { j.find("span.lengthLimit").text($.format(msg.lengthLimit, i - g)) } else { $(this).val($(this).val().substring(0, i));
                j.find("span.lengthLimit").text($.format(msg.lengthLimit, 0)) } },
        c = function() { isValidate = true; var j = $("#fields").find("li[id]:visible"),
                k = true,
                B, q, H, K, r, D, C, R, A, G, J, z, u; for (var L = 0; L < j.length; L++) { B = $(j[L]);
                u = true;
                q = B.attr("TYP"), H = B.attr("MIN"), K = B.attr("MAX"), r = B.attr("REQD"), isidnum = B.attr("isidnum"), D = B.attr("UNIQ"), C = B.attr("DEF"), R = B.attr("name"), z = B.attr("RDTL"), A, G = B.attr("DTMIN"), J = B.attr("DTMAX"); if (r === "1") { var N = true; if (q === "radio") { var E = B.find(":checked"); if ((E.val() && !E.hasClass("other")) || (E.hasClass("other") && $.trim(B.find(":text").val()))) { N = false } } else { if (q === "checkbox" || q === "likert") { if (B.find(":checked").length > 0) { N = false } } else { if (q === "goods") { B.find("div.goods-item input.number").each(function(v, i) { if ((parseFloat($(i).val()) || 0) > 0) { N = false; return false } }) } else { if (q === "address") { var g = B.find("select.province").val(),
                                        I = B.find("select.city").val(),
                                        P = B.find("select.zip").val(),
                                        Q = B.find("textarea.detail").val(); if (g && I && P && (Q || B.find("textarea.detail").parent().hasClass("hide"))) { N = false } } else { if (q === "grade") { var O = B.find("div.block li").attr("data-default-index"); if (O !== "0") { N = false } } else { B.find(":input[name]").each(function(i, v) { if ($.trim($(v).val())) { N = false; return } }) } } } } } if (N) { k = false;
                        u = false;
                        showErrorMsg(B, msg.reqdError); continue } } if (isidnum) { var M = B.find("input").val(); if (M) { if (!/^[A-Za-z0-9]+$/.test(M)) { k = false;
                            u = false;
                            showErrorMsg(B, "请输入正确的号码，数字或英文字母组合！"); continue } } } if (H) { A = B.find("input,textarea").val(); if (A) { if (q === "number" || q === "money") { if (parseFloat(A) < parseFloat(H)) { k = false;
                                u = false;
                                showErrorMsg(B, $.format(msg.minNumberError, H)); continue } } } if (q === "text" || q === "textarea") { if (A.length != 0 && A.length < parseFloat(H)) { k = false;
                            u = false;
                            showErrorMsg(B, $.format(msg.minTextError, H)); continue } } else { if (q == "checkbox") { if (B.find(":checkbox:checked").length < parseFloat(H)) { k = false;
                                u = false;
                                showErrorMsg(B, $.format(msg.minChkError, H)); continue } } } } if (K) { A = B.find("input,textarea").val(); if (A) { if (q === "number" || q === "money") { if (parseFloat(A) > parseFloat(K)) { k = false;
                                u = false;
                                showErrorMsg(B, $.format(msg.maxNumberError, K)); continue } } } if (q === "text" || q === "textarea") { if (A.length != 0 && A.length > parseFloat(K)) { k = false;
                            u = false;
                            showErrorMsg(B, $.format(msg.maxTextError, K)); continue } } else { if (q == "checkbox") { if (B.find(":checkbox:checked").length > parseFloat(K)) { k = false;
                                u = false;
                                showErrorMsg(B, $.format(msg.maxChkError, K)); continue } } } } if (G) { G = getDateByReg(G);
                    A = B.find("input.yyyy").val() + "-" + B.find("input.mm").val() + "-" + B.find("input.dd").val(); if (window.isForMobile) { A = B.find("input").val() } A = new Date(GetDateDiff(A)); if (comparisonDate(A, G) == "<") { k = false;
                        u = false;
                        showErrorMsg(B, $.format(msg.minDateError, G)); continue } } if (J) { J = getDateByReg(J);
                    A = B.find("input.yyyy").val() + "-" + B.find("input.mm").val() + "-" + B.find("input.dd").val(); if (window.isForMobile) { A = B.find("input").val() } A = new Date(GetDateDiff(A)); if (comparisonDate(A, J) == ">") { k = false;
                        u = false;
                        showErrorMsg(B, $.format(msg.maxDateError, J)); continue } } if (q === "number" || q === "money") { A = B.find(":input[name]").val(); if (A != "" && !$.isNumber(A)) { k = false;
                        u = false;
                        showErrorMsg(B, msg.numberError); continue } } else { if (q === "date") { A = B.find(":input[name]").val(); if (A != "" && !$.isDate(A)) { k = false;
                            u = false;
                            showErrorMsg(B, msg.dateError); continue } } else { if (q === "email") { A = B.find(":input[name]").val(); if (A != "" && !$.isEmail(A)) { k = false;
                                u = false;
                                showErrorMsg(B, msg.emailError); continue } } else { if (q === "phone") { var y = B.find(":input[name]"),
                                    l = y.attr("fmt"),
                                    A = y.val(); if (A && l == "mobile" && !$.isMobile(A) && A !== "+") { k = false;
                                    u = false;
                                    showErrorMsg(B, msg.mobileError); continue } } else { if (q === "table") { if (!(B.find("div.tbl").is(":visible"))) { continue } B.find("td.error").removeClass("error");
                                    B.find("p.errMsg").remove(); var s = B.find("td[typ='email']"); if (s && s.length > 0) { $.each(s, function(S, v) { var U = $(v); var T = U.find("input").val(); if (T && !$.isEmail(T)) { k = false;
                                                u = false;
                                                showErrorMsg(U, msg.emailError) } }) } var m = B.find("td[reqd='1']"); if (m && m.length > 0) { $.each(m, function(U, W) { var V = $(W); var S = V.getValues(); var T = false; for (var X in S) { if (S[X] === 0 || S[X]) { T = true } } if (!T) { k = false;
                                                u = false;
                                                showErrorMsg(V, msg.reqdError) } }) } var t = B.find("td[min],td[max]"); if (t && t.length > 0) { $.each(t, function(W, Y) { var V = $(Y); var U = V.attr("min"); var S = V.attr("max"); var X = V.attr("typ"); var T = V.find("input,textarea").val(); if (!T) { return true } if (U) { if (X === "number") { if (parseFloat(T) < parseFloat(U)) { k = false;
                                                        u = false;
                                                        showErrorMsg(V, $.format(msg.minNumberError, U)); return true } } else { if (X === "checkbox") { if (V.find(":checkbox:checked").length < parseFloat(U)) { k = false;
                                                            u = false;
                                                            showErrorMsg(V, $.format(msg.minChkError, U)); return true } } else { if (T.length != 0 && T.length < parseFloat(U)) { k = false;
                                                            u = false;
                                                            showErrorMsg(V, $.format(msg.minTextError, U)); return true } } } } if (S) { if (X === "number") { if (parseFloat(T) > parseFloat(S)) { k = false;
                                                        u = false;
                                                        showErrorMsg(V, $.format(msg.maxNumberError, S)); return true } } else { if (X === "checkbox") { if (V.find(":checkbox:checked").length > parseFloat(S)) { k = false;
                                                            u = false;
                                                            showErrorMsg(V, $.format(msg.maxChkError, S)); return true } } else { if (T.length != 0 && T.length > parseFloat(S)) { k = false;
                                                            u = false;
                                                            showErrorMsg(V, $.format(msg.maxTextError, S)); return true } } } } }) } t = B.find("td[dtmin],td[dtmax]"); if (t && t.length > 0) { $.each(t, function(X, Z) { var W = $(Z); var V = W.attr("dtmin"); var S = W.attr("dtmax"); var T = W.find("input.val").val(); if (!T) { return true } T = new Date(GetDateDiff(T)); if (V) { var U = getDateByReg(V); if (comparisonDate(T, U) == "<") { k = false;
                                                    u = false;
                                                    showErrorMsg(W, $.format(msg.minDateError, U)); return true } } if (S) { var Y = getDateByReg(S); if (comparisonDate(T, Y) == ">") { k = false;
                                                    u = false;
                                                    showErrorMsg(W, $.format(msg.maxDateError, Y)); return true } } }) } } } } } } if (u) { B.removeClass("error");
                    B.find("p.errMsg").remove() } } var n = localStorage.getItem($("#FRMID").val() + "_DTLMT"); var x = localStorage.getItem($("#FRMID").val() + "_DTLMT_TIME"); var o = $.formatDate(new Date()); if (typeof DTLMT != "undefined" && ((x === o && DTLMT && DTLMT.DTLMT > 0 && n >= DTLMT.DTLMT) || DTLMT.DTLMT === "0")) { k = false;
                $.alert(TIPTEXT.DTLMT || "已经提交过了，请不要重复提交，如有疑问请与表单发布者联系。") } return k },
        b = function(o) { var g = $("li").has(o),
                j = g.find(":input[name]"),
                k = j.attr("name"),
                i = j.val(),
                l = false; var m = { FRMID: $("#FRMID").val(), SID: $("#SID").val(), ENTRYID: $("#_id").val(), NM: k, VAL: i };
            $.postJSON("/web/formview/existValidate", m, function(n) { l = !n; if (!l) { showErrorMsg(g, TIPTEXT.UNIQ || msg.uniqError) } }, { async: false }); return l },
        f = function(k) { var g = $("li").has(k),
                i = true; var j = { kaptcha: g.find(":input[name='kaptcha']").val() };
            $.postJSON("/web/formview/captchaValidate", j, function(l) { i = l; if (!i) { showErrorMsg(g, msg.captchaError) } }, { async: false }); return i },
        a = function(g) { var i = $("#" + g.attr("id").substring(2)),
                j = true; var k = { TEL: i.find("input.phone").val(), CODE: g.find("input.authcode").val() };
            $.postJSON("/web/formview/authcodevalidate", k, function(l) { j = l; if (!j) { showErrorMsg(g, msg.authCodeError) } }, { async: false }); return j },
        e = function() { var g = true;
            $.postJSON("/web/formview/checklimit", $("#form1").getValues(), function(i) { if (i && i.length > 0) { $.hideStatus();
                    $.each(i, function(k, j) { if ("goods" == j.TYP) { g = false;
                            showErrorMsg($("[name='" + j.NM + "_" + j.TYP + "']", "#fields").parents("div.goods-item"), $.format("{0}库存为{1},还可以购买{2}({3}),你已超出限购数量,需修改。", j.VAL, j.AMOUNTLMT, j.BALANCE, j.UNT)) } else { g = false;
                            showErrorMsg($("[name='" + j.NM + "_" + j.TYP + "']", "#fields").parents("li"), $.format("{0}限制提交数量为{1},还可以提交{2}次,你已超出提交限制,需修改。", j.VAL, j.AMOUNTLMT, j.BALANCE)) } }); return false } }, { async: false }); return g };
    $("li[max]:has(textarea)", "#fields").find("textarea").bind({ keyup: d, change: d });
    $("li[max]:has(input)", "#fields").find("input[type='text']").bind({ keyup: d, change: d });
    $("#btnSubmit,#btnSave,#btnActSave").bind({ click: function() { if ($(this).hasClass("disabled") || $(this).prop("disabled")) { return false } var k = $("#_id").val() ? "edit" : "new"; if (k == "new" && "1" == ADVPERM.ADV && !"1" == ADVPERM.ADD) { $.alert("没有新增数据的权限，请与管理员联系。"); return false } $.each(RULE.FIELDSRULE || [], function(s, t) { $.each(t.RULEFLD || [], function(r, u) { if (!$("#" + u).is(":visible")) { $("#" + u + ",#au" + u).setValues({}, true) } }) });
            calShopCard(); if (!c()) { $("#fields").find("li.error:first").find(":input").focus(); return false } $(this).prop("disabled", true);
            $.showStatus("正在验证数据..."); if ($("#liCaptcha").length > 0) { isValidate = f($("#liCaptcha").find(":text")) } if (!isValidate) { $("#fields").find("li.error:first").find(":input").focus(); return false } var q = $("li[uniq='1']");
            q = q.filter(":visible"); if (q.length > 0) { q.each(function(s, r) { isValidate = b($(r).find(":input[name]")); if (!isValidate) { $("#fields").find("li.error:first").find(":input").focus(); return false } }) } if (!isValidate) { $("#fields").find("li.error:first").find(":input").focus(); return false } $("#fields input.authcode").each(function(r, s) { var t = $(s);
                isValidate = a($(t).parent().parent()); if (!isValidate) { $("#fields").find("li.error:first").find(":input").focus(); return false } }); if (!isValidate) { $("#fields").find("li.error:first").find(":input").focus(); return false } var n = $("li[ctlmt='DAY'], li[ctlmt='ALL']"); if (n.length > 0) { isValidate = e(); if (!isValidate) { $("#fields").find("li.error:first").find(":input").focus(); return false } } if (!isValidate) { $("#fields").find("li.error:first").find(":input").focus();
                $("#btnSubmit,#btnSave,#btnActSave").prop("disabled", false);
                $.hideStatus(); return false } else { var k = $("#_id").val() ? "edit" : "new"; if (k === "new") { var j = parseFloat($("#TMOUT").val());
                    $("#TMOUT").val(Math.round((new Date().getTime() - j) / 1000)) } var i = $("#form1").find("li[typ!=table]").getValues(); var m = $("#form1>input").getValues();
                $.mergJSON(i, m);
                $.each($("#form1>input[type='hidden']"), function(t, s) { var r = $(s).attr("name"); var u = $(s).val();
                    i[r] = u }); var l = $("#fields li[typ=table]");
                $.each(l, function(t, u) { if (!($(u).is(":visible"))) { return true } var s = $(u).find("div.tbl").attr("name");
                    i[s] = []; var r = $(u).find("div.tbl tr:gt(0)");
                    $.each(r, function(v, x) { var y = $(x).getValues();
                        i[s].push(y) }) });
                $.each(i, function(s, r) { if (/^t\d/.test(s)) { delete i[s] } }); if ($(this).attr("id") === "btnSubmit") { if ($("#FRMID").attr("autofill") == "1") { localStorage.setItem($("#FRMID").val(), JSON.stringify(i)) } else { localStorage.removeItem($("#FRMID").val()) } if (DTLMT && DTLMT.DTLMT > 0) { var o = localStorage.getItem($("#FRMID").val() + "_DTLMT"); if (o == null) { o = 0 } else { o = parseInt(o) } o++;
                        localStorage.setItem($("#FRMID").val() + "_DTLMT", o);
                        localStorage.setItem($("#FRMID").val() + "_DTLMT_TIME", $.formatDate(new Date())) } else { localStorage.removeItem($("#FRMID").val() + "_DTLMT");
                        localStorage.removeItem($("#FRMID").val() + "_DTLMT_TIME") } $.showStatus("正在保存数据..."); var g = "/web/formview/" + $("#FRMID").val();
                    $.postJSON(g, i, function(r) { $.hideStatus(); var s = r && r.url; if (!s) { s = "/web/viewresult" } window.location.href = s }) } else { $.showStatus("正在保存数据...");
                    i.INITTIME = $.trim(INITTIME.toString());
                    i.FRMNM = FRM.FRMNM;
                    $.postJSON("/web/entries/save", i, function(r) { if (r && r.ERRMSG) { $.alert(r.ERRMSG);
                            $.hideStatus(); return } $.closeLightBox(); if (window.query) { if (k === "new") { query(null, "FIRST", PAGESIZE, $("#entriesGrid").datagrid("getSortString"), $("#entriesGrid")) } else { if ("1" == ADVPERM.ADV && "1" == ADVPERM.FLT) { query(null, "FIRST", PAGESIZE, $("#entriesGrid").datagrid("getSortString"), $("#entriesGrid")) } else { var s = $("#entriesGrid"),
                                        v = s.data("rowsData"),
                                        u = s.data("total"),
                                        t = s.find("tbody>tr.rowSelected").index(); if (r.REALNAME && r.REALNAME != r.CBY) { r.CBY = $.format("{0}({1})", r.CBY, r.REALNAME) } if (r.UPDATEREALNAME && r.UPDATEREALNAME != r.UPBY) { r.UPBY = $.format("{0}({1})", r.UPBY, r.UPDATEREALNAME) } v[t] = r;
                                    s.data("rowsData", v);
                                    s.datagrid("fillData", { total: u, rows: v });
                                    s.find("tbody>tr:eq(" + t + ")").addClass("rowSelected");
                                    $("a.view").click(function() { setTimeout(function() { $("#btnActView").trigger("click") }, 150) });
                                    $("a.edit").click(function() { setTimeout(function() { $("#btnActEdit").trigger("click") }, 150) });
                                    window.selectedData = r;
                                    $("#btnActVie").trigger("click") } } $.hideStatus() } else { if (!window.isForMobile) { $.alert("保存成功") } else { $.malert("保存成功，正在跳转...", function() { window.location.href = document.referrer + $.format("#l{0}", liIndex || 0) }) } $.hideStatus() } $("#btnSubmit,#btnSave,#btnActSave").prop("disabled", false) }); return false } } if (window._tt_config) { _taq.push({ convert_id: window._convert_id, event_type: "form" }) } return false } }) }

function setSubTblValue(a, c) { a.find("div.tbl tr").filter(function(d) { return d >= 2 }).remove(); var b = 0; if (c && c.length > 0) { $.each(c, function(e, d) { var g = a.find("div.tbl tr:last-child"); if (b > 0) { var j = $(g).clone();
                $.each($(j).find("td"), function(l, m) { if ($(m).attr("typ") == "radio") { var i = $(m).find("input[type=radio]");
                        $.each(i, function(q, k) { var o = $(k).attr("name"); var n = o.split("_");
                            o = n[0] + "_" + n[1] + "_" + e;
                            $(k).attr("name", o) }) } });
                $(j).setValues(d, true);
                $(g).after(j) } else { $(g).setValues(d, true) } g = a.find("div.tbl tr:last-child"); var f = $(g).find("td");
            $.each(f, function(k, l) { if ($(l).attr("typ") == "date") { $.setDate($(l), $(l).find("input.val").val()) } else { if ($(l).attr("typ") == "time") { $.setTime($(l), $(l).find("input.val").val()) } } });
            b++ }) } }

function setDefaultValue(c) { if (window.ISMBLEDIT) { return } if (c) { $("#fields").setValues({}, true);
        $("#fields .block li").attr("data-default-index", "0");
        $("#fields .block li").find("i").html("&#xe6ff;");
        $(".number").each(function(k, l) { var m = $(l); var e = m.attr("name"); if (typeof(e) !== "undefined" && e.indexOf("goods") !== -1) { m.val(0) } });
        $("#fields").find("select.dd1").trigger("change") } else { var j = localStorage.getItem($("#FRMID").val()); if (j && $("#FRMID").attr("autofill") == "1") { try { var g = JSON.parse(j); if (window.countLmtInfo && countLmtInfo.length > 0) { $.each(countLmtInfo, function(l, k) { var e = k.NM + "_" + k.TYP;
                        delete g[e] }) } $("#fields").setValues(g, true); var d = $("#fields").find("li[TYP='table']"); if (d && d.length > 0) { var b = $(d[0]).find("div.tbl").attr("name"); var f = g[b];
                    setSubTblValue($(d[0]), f) } setTimeout(function() { var e = false;
                    $("#fields").find("li").each(function(n, m) { if (e) { return false } var k = $(m),
                            o = k.attr("typ"); if (o == "goods") { k.find("div.number-container").each(function(r, s) { if (e) { return false } var q = $(s),
                                    l = q.find("input.number"); if (g[l.attr("name")]) { e = true; return false } }) } }); if (e) { calShopCard() } }, 0);
                $.each($("#fields").find("input[type=hidden]"), function(m, l) { var k = $(l).attr("name"); if (k && k.indexOf("time") > 0) { var n = $(l).val(); var o = $(l).parent().parent();
                        $.setTime(o, n) } else { if (k && k.indexOf("date") > 0) { var e = $(l).val(); var o = $(l).parent().parent();
                            $.setDate(o, e) } else { if ($(l).hasClass("w") || $(l).hasClass("j")) {} else { $(l).val("") } } } });
                $("#fields").find("li[typ='goods']").find("input.number").trigger("blur") } catch (i) {} } } if (window.QPARAMS) { $("#fields").setValues(window.QPARAMS, true, true);
        $.each(window.QPARAMS, function(m, l) { var e = $("[name='" + m + "']"); if (e.length > 0 && e.attr("matfrm") && e.attr("matfld")) { FieldRelation.fillAutoCompValue(e) } }) }

    function a(k, m, l) { if (!m) { return } if (l === "date") { updateSelects(getDateByReg(m), k) } else { if (l === "time") { $.setTime(k, getTimeByReg(m)) } else { if (l === "phone") { var e = m.split("-"); if (e.length > 0) { $(e).each(function(o, n) { k.find(":text:eq(" + o + ")").val(n) }) } k.find(":input[name]").val(m) } else { if (l === "radio") { k.find(":radio:eq(" + m + ")'").prop("checked", true) } else { if (l === "likert") { k.find("tbody>tr").each(function(n, o) { $(o).find(":radio:eq(" + m + ")'").prop("checked", true) }) } else { if (l === "checkbox") { k.find(":checkbox[name='" + m + "']").prop("checked", true) } else { k.find("input.fld,textarea.fld").val(m) } } } } } } } $("li[def]", "#fields").each(function(k, e) { e = $(e); var o, l = e.attr("typ"),
            m = e.attr("def");
        a(e, m, l) });
    $("td[def]", "#fields div.tbl").each(function(k, n) { var e = $(n); var m = e.attr("def"); var l = e.attr("typ");
        a(e, m, l) }) }

function initRule() { var d = function(i, g) { var j = true; if (i === "or") { j = false } $.each(g, function(m, k) { var n = RegExp(/username/); if (n.test(k.VAL)) { k.VAL = $("#loginUserName").val() } var o = true,
                    l = $(":input[name='" + k.FLD + "']"),
                    r; if (l.length === 0) { l = $(":input[name^='" + k.FLD + "_']") } r = l.val(); if (l.is(":checkbox") || l.is(":radio")) { r = undefined;
                    l.each(function(s, t) { if ($(t).prop("checked")) { r = $(t).val(); return false } }) } if (k.CTYP === "eq") { if (k.DTYP === "filesize") { o = parseInt(r) === parseFloat(k.VAL) * 1024 * 1024 } else { if (k.DTYP === "number") { o = parseFloat(r) === parseFloat(k.VAL) } else { if (k.DTYP === "date") { o = r === $.formatDate(getDateByReg(k.VAL)) } else { o = r === k.VAL } } } } else { if (k.CTYP === "ne") { if (k.DTYP === "filesize") { o = parseInt(r) != parseFloat(k.VAL) * 1024 * 1024 } else { if (k.DTYP === "number") { o = parseFloat(r) != parseFloat(k.VAL) } else { o = r != k.VAL } } } else { if (k.CTYP === "bw") { if (r != null && r != undefined) { o = r.indexOf(k.VAL) === 0 } } else { if (k.CTYP === "ew") { var n = new RegExp("(" + k.VAL + ")$", "gi");
                                o = n.test(r) } else { if (k.CTYP === "ct") { if (r != null && r != undefined) { o = r.indexOf(k.VAL) >= 0 } } else { if (k.CTYP === "nct") { if (r != null && r != undefined) { o = r.indexOf(k.VAL) === -1 } } else { if (k.CTYP === "in") { var q = k.VAL.split(";");
                                            o = $.inArray(r, q) >= 0 } else { if (k.CTYP === "nin") { var q = k.VAL.split(";");
                                                o = $.inArray(r, q) === -1 } else { if (k.CTYP === "gt") { if (k.DTYP === "filesize") { o = parseInt(r) > parseFloat(k.VAL) * 1024 * 1024 } else { if (k.DTYP === "number") { o = parseFloat(r) > parseFloat(k.VAL) } else { o = r > k.VAL } } } else { if (k.CTYP === "gte") { if (k.DTYP === "filesize") { o = parseInt(r) >= parseFloat(k.VAL) * 1024 * 1024 } else { if (k.DTYP === "number") { o = parseFloat(r) >= parseFloat(k.VAL) } else { o = r >= k.VAL } } } else { if (k.CTYP === "lt") { if (k.DTYP === "filesize") { o = parseInt(r) < parseFloat(k.VAL) * 1024 * 1024 } else { if (k.DTYP === "number") { o = parseFloat(r) < parseFloat(k.VAL) } else { if (r) { o = r < k.VAL } else { o = false } } } } else { if (k.CTYP === "lte") { if (k.DTYP === "filesize") { o = parseInt(r) <= parseFloat(k.VAL) * 1024 * 1024 } else { if (k.DTYP === "number") { o = parseFloat(r) <= parseFloat(k.VAL) } else { if (r) { o = r <= k.VAL } else { o = false } } } } } } } } } } } } } } } if (!o && i === "and") { j = false; return false } if (o && i === "or") { j = true; return false } }); return j },
        c = function(g) { $.each(RULE.FIELDSRULE || [], function(j, l) { if (g) { var k = false;
                    $.each(l.CONS, function(n, i) { if (g == i.FLD || g.indexOf(i.FLD + "_") == 0) { k = true; return false } }); if (!k) { return true } } var m = d(l.ANDOR, l.CONS); if (!(l.RULEFLD instanceof Array)) { l.RULEFLD = [l.RULEFLD] } $.each(l.RULEFLD, function(o, n) { if (m) { if (l.RULETYPE === "show") { $("#" + n + ",#au" + n).removeClass("hide") } else { $("#" + n + ",#au" + n).addClass("hide") } } else { if (l.RULETYPE === "show") { $("#" + n + ",#au" + n).addClass("hide") } else { $("#" + n + ",#au" + n).removeClass("hide") } } }); if ("goods" == $("#" + l.RULEFLD).attr("typ")) { calShopCard() } }); if (window.isForMobile && window.fileUpload) { fileUpload() } }; if (window.RULE && RULE.FIELDSRULE && RULE.ENABLERULE === "1") { $.each(RULE.FIELDSRULE, function(g, j) { if (j.RULETYPE === "show") { if (!(j.RULEFLD instanceof Array)) { j.RULEFLD = [j.RULEFLD] } $.each(j.RULEFLD, function(l, k) { $("#" + k).addClass("hide") }) } });
        $(":text,input,select,textarea").change(function() { var g = $(this).attr("name"); if (g) { setTimeout(function() { c(g) }) } });
        $(":radio,:checkbox").click(function() { var g = $(this).attr("name"); if (g) { c(g) } });
        $(".block li").find("img").closest("li").find("input").click(function() { var i = $(this); var g = i.attr("name"); if (g) { c(g.split("_")[0]) } });
        c() } $("#container").removeClass("hide"); var e = function() { if (window.RULE && window.RULE.ENABLERULE == "1" && RULE.EXPRESSRULE && RULE.EXPRESSRULE.length > 0) { var g = 0;
            $.each(RULE.EXPRESSRULE, function(m, k) { var o = k.split("="); if (o.length != 2) { return true } var n = o[0],
                    j = o[1],
                    l, q = {};
                $.each(FLDS, function(t, s) { if (s.NM == n) { if (s.TYP == "number") { l = s.NM + "_number" } return false } }); var r = j.split(/[\+\-\*\/\(\)]/ig);
                $.each(r, function(s, t) { if (!t || t.indexOf("F") != 0) { return true } $.each(FLDS, function(v, u) { if (u.NM == t) { if (u.TYP == "number") { q[u.NM] = u.NM + "_number" } return false } }) });
                $.each(q, function(t, s) { g++;
                    $("[name=" + s + "]", "#fields").bind("change", function(y) { var v = arguments[1]; if (!v) { v = 1 } else { v++ } if (v > g) { $(this).unbind("change");
                            $.alert("检测到表单设置的逻辑运算表达式存在死循环，请联系表单创建者。"); return false } else { try { var i = [],
                                    x = true; var z = j.split(/[\+\-\*\/\(\)]/ig);
                                $.each(z, function(A, B) { if (!B || B.indexOf("F") != 0) { return true } var C = $("[name=" + B + "_number]", "#fields").val(); if (!C) { x = false; return false } else { i.push(C) } }); if (x) { var u = $.calc(j, i); if (u != u || u == Infinity || u == -Infinity) { $("[name=" + l + "]", "#fields").val("") } else { if (u || u == 0) { $("[name=" + l + "]", "#fields").val(u);
                                            $("[name=" + l + "]", "#fields").trigger("change", v) } } } } catch (y) {} } }) }) }) } };
    e(); var f = $("#form1").find("[acmpsrcfld][acmpfld][typ='image'] img"); if (f.length > 0) { for (var a = 0; a < f.length; a++) { var b = $(f[a]).attr("src"); if (typeof(b) != "undefined" && b.length < 50) { $("#form1").find("[acmpsrcfld][acmpfld][typ='image'] img:eq(" + a + ")").attr("src", "/rs/images/defaultimg.png") } } } }

function onBridgeReady() { WeixinJSBridge.call("hideOptionMenu") }

function initWeixinShare() { if (window.F && F.DISSHARE === "1") { if (typeof WeixinJSBridge == "undefined") { if (document.addEventListener) { document.addEventListener("WeixinJSBridgeReady", onBridgeReady, false) } else { if (document.attachEvent) { document.attachEvent("WeixinJSBridgeReady", onBridgeReady);
                    document.attachEvent("onWeixinJSBridgeReady", onBridgeReady) } } } else { onBridgeReady() } } }

function initOthers() { $("#TMOUT").val(new Date().getTime());
    $("#imgKaptcha").click(function() { $(this).attr("src", "/kaptcha.jpg?" + Math.floor(Math.random() * 100)) }); if ($("#needBuyInfo").length > 0) { $("#btnSubmit").prop("disabled", true) } $("#cornerQrcode").click(function() { var a = $("#qrcode"); if (!a.attr("src")) { a.attr("src", "/qrcode.jpg?type=formview&c=" + $("#FRMID").val()) } $("#qrcodeContainer").show() });
    $("#qrcode").click(function() { setTimeout(function() { $("#qrcodeContainer").hide() }, 10) });
    calShopCard() }

function initGrade() { $(".block li").find("i").hover(function(f) { var d = $(this); var b = d.index(); var a = d.closest("li"); var c = d.closest("li").find("span i"); var b = d.index();
        c.each(function(e, g) { if (e <= b) { $(g).html("&#xe700;") } else { $(g).html("&#xe6ff;") } }) }, function() {});
    $(".block li").hover(function(a) {}, function() { var a = $(this).attr("data-default-index");
        a = parseInt(a); var b = $(this).find("span i");
        b.each(function(c, d) { if (c < a) { $(d).html("&#xe700;") } else { $(d).html("&#xe6ff;") } }) });
    $(".block li").find("i").click(function() { var c = $(this); var a = c.closest("li"); var b = c.index() + 1;
        a.attr("data-default-index", b);
        $(this).parent().parent().find("input")[0].value = b;
        $(this).parent().parent().find("input").click();
        a.find("i").each(function(d, e) { if (d < b) { $(e).html("&#xe700;") } else { $(e).html("&#xe6ff;") } }) }) }

function initDynamicExpDate() { if ("1" === $("#dynamicDateType").val()) { var a = $("#dynamicExpDate");
        a.val(apendNowTime(getDateByReg(a.val()))) } }

function initLogo() { var b = $("#container").attr("mobile"); if (b) { var c = $("#logo").find("a"),
            g = c.css("backgroundSize"); if ("cover" == g) { var f = c.css("backgroundImage"); if (f) { var e = f.substring(f.indexOf("(") + 1, f.lastIndexOf(")")).replace(/\"/g, ""); var d = $($.format("<img src='{0}' style='border:none;width:100%;' />", e));
                c.append(d);
                d.load(function() { c.css({ backgroundImage: "none", backgroundSize: "initial", height: $(this).height() }) }) } } } }

function initImg() { if (!window.query && !window.isForMobile) { $("#fields>li").find("div.content div.goods-item img.img").live("click", function() { var a = $(this).attr("src");
            $.lightBox({ url: "#stage", size: "l cus3", showclose: "0", loaded: function() { $("img.img-option", "#stage").attr({ src: a });
                    $("img.img-option", "#stage").unbind().click(function() { $.closeLightBox() }) } }); return false }) } }

function initCommitLmt() { if (typeof countLmtInfo != "undefined" && countLmtInfo.length > 0) { for (var b = 0; b < countLmtInfo.length; b++) { var c = countLmtInfo[b]; var a; if (c.TYP == "radio") { a = $("input[name='" + c.NM + "_" + c.TYP + "'][value='" + c.VAL + "']");
                a.parent().append("<label style='color:#ccc;'>(剩余" + c.BALANCE + ")</label>") } else { if (c.TYP == "dropdown") { a = $("select[name='" + c.NM + "_" + c.TYP + "']").find("option[value='" + c.VAL + "']");
                    a.append("<label style='color:#ccc;'>(剩余" + c.BALANCE + ")</label>") } else { if (c.TYP == "checkbox") { a = $("#" + c.NM);
                        a.parent().append("<label style='color:#ccc;'>(剩余" + c.BALANCE + ")</label>") } else { if (c.TYP == "goods") { a = $("input[name='" + c.NM + "_" + c.TYP + "']");
                            a.parents("div.text-wrapper").find("label.name").append("<label style='color:#ccc;'>(剩余" + c.BALANCE + ")</label>") } } } } if (c.BALANCE == 0) { a.prop("disabled", "disabled") } } } }

function initSubFormOptAction() { if (window.isForMobile && !window.ISMBLEDIT) { $("li[typ='table']", "#fields").find("div.tbl").addClass("hide") } $("div.rowAdd").live({ click: function() { var b = $(this); var a = getSubRowDefaultValue(b.prev().find("table tr:eq(1)")); if (window.isForMobile) { $.lightBox({ url: "#stage", size: "s", showclose: "0", btnConfirm: "#btnConfirm1, #btnConfirm2", loaded: function() { window.console.log("=======build sub table=======");
                        $("ul", "#stage").remove(); var m = b.prev().find("table tr:last-child"); var k = $(m).clone(); var e = b.prev().find("table tr:first-child"); var f = $(e).clone(); var o = f.find("th"); var r = k.find("td"); var g = $("<ul class='fields'></ul>");
                        $("#stage").prepend(g); for (var j = 1; j < o.length; j++) { var l = $(o[j]).attr("typ"); var n = $(o[j]).find("label").clone(); var q = $("<li class='clearfix' typ='" + l + "'></li>");
                            q.append(n);
                            q.append($(r[j]).html());
                            g.append(q); if (l == "radio") { var d = q.find("input[name]").attr("name"); var c = d.substring(0, d.lastIndexOf("_"));
                                q.find("input[name='" + d + "']").attr("name", c) } } $("#stage").setValues(a, true);
                        g.remove("p.errMsg") }, confirm: function() { addRow(b, $("#stage").getValues()); var c = $(event.target).attr("id"); if ("btnConfirm1" == c) { $("#stage").find("input[type='time']").val("");
                            $("#stage").setValues(a, true); return false } } }); return } addRow(b, a) } });
    $("div.tbl table tr td a.icononly-del").live({ click: function() { var a = $(this).parent().parent(); var b = $(a).siblings().length; if (b > 1) { $(a).remove() } else { $(a).addClass("hide");
                $(a).prev().addClass("hide") } } }) }

function getSubRowDefaultValue(b) { var a = {};
    $("td[def]", $(b)).each(function(g, e) { var q = $(e).attr("def"); var o = $(e).attr("typ"); var d = $(e).find("input[name]").attr("name"); if (o == "dropdown") { d = $(e).find("select[name]").attr("name"); var k = parseInt(q); var l = $(e).find("select option")[k + 1];
            q = $(l).val() } else { if (o == "radio") { d = d.substring(0, d.lastIndexOf("_")); var k = parseInt(q); var l = $(e).find("input:radio")[k];
                q = $(l).val() } else { if (o == "checkbox" && q) { var q = q.split(","); var m = $(e).find("input[name]"); for (var f = 0; f < q.length; f++) { var k = parseInt(q[f]); var r = m[k]; var s = $(r).attr("name"); var c = $(r).val();
                        a[s] = c } } } } if (o != "checkbox") { a[d] = q } }); return a }

function getAcmpSubTableRowData(b, a) { var c = []; var d = a || [];
    $.each(d, function(l, k) { var m = {}; for (var g = 0; g < b.length; g++) { var f = b[g]; if (f.ACMPFLD) { var e = k[f.ACMPFLD]; if (f.TYP == "number" || f.TYP == "radio" || f.TYP == "checkbox" || f.TYP == "date" || f.TYP == "time" || f.TYP == "dropdown") { m[f.NM + "_" + f.TYP] = e } else { m[f.NM] = e } } } c.push(m) }); return c }

function addRow(g, d, c) { var e = g.prev().find("table tr:last-child"); var b = $(e).siblings().length; if (b == 1 && $(e).hasClass("hide")) { $(e).removeClass("hide");
        $(e).prev().removeClass("hide"); return } else { if (b >= 200) { $.alert("超出最大限制数，不能新增行。"); return } } var f, a; if ($(e).parents("div.tbl").hasClass("hide")) { a = false;
        $(e).parents("div.tbl").removeClass("hide");
        f = $(e) } else { a = true;
        f = $(e).clone() } $.each(f.find("td"), function(l, n) { if (c) { $(n).filter("[acmedit='0']").find("input[name]").prop("readonly", true);
            $(n).filter("[acmedit='0']").find("input.yyyy,input.mm,input.dd").prop("readonly", true);
            $(n).filter("[acmedit='0']").find("span.ui-datepicker-trigger-wrap").hide();
            $(n).filter("[acmedit='0']").find("input:radio").prop("disabled", true);
            $(n).filter("[acmedit='0']").find("select[name], select.hh, select.mi").prop("disabled", true) } var m = $(n).attr("typ"); if (m == "radio") { var j = $(n).find("input[type=radio]");
            $.each(j, function(s, k) { var r = $(k).attr("name"); var q = r.split("_"); var o = q[0] + "_" + q[1]; if (d && d[r]) { d[o] = d[r] } $(k).attr("name", o) }) } else { if (m == "date") { var i = $(n).find(".datepincker");
                i.removeClass("hasDatepicker");
                i.attr("id", i.attr("id") + "_" + l);
                $(n).find("img.ui-datepicker-trigger").remove();
                $.initDate($(n), updateSelects) } } }); if (a) { $(e).after(f);
        f.find("p.errMsg").remove();
        f.find("td.error").removeClass("error") } refreshItemNameAndId(e);
    $(f).setValues(d, true);
    $.each(f.find("td"), function(i, n) { var m = $(n).attr("typ"); var j; var o; if (m == "dropdown") { j = $(n).find("select[name]").attr("name");
            o = d[j] } else { if (m == "radio") { j = $(n).find("input[name]").attr("name"); var l = j.substring(0, j.lastIndexOf("_"));
                o = d[l] } else { j = $(n).find("input[name]").attr("name");
                o = d[j] } } if (m == "date") { $.setDate($(n), o) } else { if (m === "time") { $.setTime($(n), o) } else { if (m === "name") { $.setName($(n), o) } else { if (m === "phone") { $.setPhone($(n), o) } else { if (m == "dropdown") { $(n).find("select[name]").val("");
                            $(n).find("select[name]").val(o || "") } else { if (m == "radio") { $(n).find("input[name]").prop("checked", false);
                                $(n).find("input[value='" + o + "']").prop("checked", true) } else { if (m == "radio") { $(n).find("input[name]").prop("checked", false);
                                    $(n).find("input[value='" + o + "']").prop("checked", true) } } } } } } } }) }

function refreshItemNameAndId(c) { var d = $(c).parent().children(); for (var b = 1; b < d.length; b++) { $.each($(d[b]).find("td"), function(f, g) { if ($(g).attr("typ") == "radio") { var e = $(g).find("input[type=radio]");
                $.each(e, function(m, i) { var l = $(i).attr("name"); var k = l.split("_");
                    l = k[0] + "_" + k[1] + "_" + (b - 1);
                    $(i).attr("name", l);
                    a($(i)) }) } else { if ($(g).attr("typ") == "checkbox") { var e = $(g).find("input[type=checkbox]");
                    $.each(e, function(k, i) { a($(i)) }) } } }) }

    function a(f) { var g = f.attr("id"); if (!g) { return } var e = g.split("_")[0] + "_" + (b - 1);
        f.attr("id", e);
        f.next("label").attr("for", e) } } head.ready(function() { if (isEmbed) { $("body").css({ background: "none", padding: "0px", margin: "0px" });
        $("#form1").css({ marginTop: "0px" });
        $("#container").css({ width: "100%", "box-shadow": "none" }).find("#form1").css({ "padding-top": "20px" });
        $("#logo").hide() } initYzjMenu();
    initFocus();
    initInstruct();
    initRadio();
    initNumberInput();
    initGoods();
    initMap();
    initAddress();
    initAuthCode();
    initValidate();
    initMatchAndAcmp();
    $.initDate($("#fields"), updateSelects);
    setDefaultValue();
    randomRadio();
    initRule();
    initDropdown2();
    initFieldsPermForView();
    initLogo();
    initUpload();
    initOthers();
    initGrade();
    initDynamicExpDate();
    initWeixinShare();
    initImg();
    initCommitLmt();
    initSubFormOptAction(); var a = $("#container").attr("mobile"); if (a) { var b = $("#container").height(),
            c = $(window).height() - 6; if (b < c) { $("#container").css({ minHeight: c }) } } });
