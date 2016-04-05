/**
 * Created by Bens on 2015/4/26.
 */


var TIMEOUTCODE = 1293;
var USERLIMIT = 1294;
var WRONGSIGNATURE = 256;
//get admin information after user login
var adminInfo;
if (sessionStorage.getItem('adminInfo')) {
    adminInfo = JSON.parse(sessionStorage.getItem('adminInfo'));
}

function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}

function signature(message, token) {
    var hash = CryptoJS.HmacSHA256(message, token);
    var base64Hash = hash.toString(CryptoJS.enc.Base64);
    return base64Hash;
}

/**
 * 日期 转换为 Unix时间戳
 * @param <string> 2014-01-01 20:20:20  日期格式
 * @return <int>        unix时间戳(秒)
 */
function DateToUnix(string) {
    if(string){
        var f = (string ? string : '').split('T', 2);
        var d = (f[0] ? f[0] : '').split('-', 3);
        var s = (f[1] ? f[1] : '').split('.', 2);
        var t = (s[0] ? s[0] : '').split(':', 3);
        return (new Date(
                parseInt(d[0], 10) || null,
                (parseInt(d[1], 10) || 1) - 1,
                parseInt(d[2], 10) || null,
                parseInt(t[0], 10) || null,
                parseInt(t[1], 10) || null,
                parseInt(t[2], 10) || null
            )).getTime();
    }else {
        return;
    }

}

/**
 * 日期 转换为 Unix时间戳
 * @param <string> 2014-01-01  日期格式
 * @return <int>        unix时间戳(秒)
 */
function DateToUnixFotDate(string) {
    var f = string.split(' ', 2);
    var d = (f[0] ? f[0] : '').split('-', 3);
    var t = (f[1] ? f[1] : '').split(':', 3);
    return (new Date(
            parseInt(d[0], 10) || null,
            (parseInt(d[1], 10) || 1) - 1,
            parseInt(d[2], 10) || null,
            parseInt(t[0], 10) || null,
            parseInt(t[1], 10) || null,
            parseInt(t[2], 10) || null
        )).getTime() / 1000;
}

/**
 * 时间戳转换日期
 * @param <int> unixTime    待时间戳(秒)
 * @param <bool> isFull    返回完整时间(Y-m-d 或者 Y-m-d H:i:s)
 * @param <int>  timeZone   时区
 */
function UnixToDate(unixTime, isFull, timeZone) {
    if( !unixTime) {
        return;
    }
    unixTime = parseInt(unixTime);
    var date = new Date();
    var time = new Date(unixTime + date.getTimezoneOffset()*-1*60*1000);
    var year = time.getYear()+1900;
    var month = time.getMonth()+1;
    var date = time.getDate();
    var hour = time.getHours();
    var minutes = time.getMinutes();
    var seconds = time.getSeconds();

    if( month < 10) {
        month = '0' + month;
    }
    if( date < 10) {
        date =  '0' + date;
    }
    if( hour < 10) {
        hour ='0' + hour;
    }
    if( minutes < 10) {
        minutes ='0' +  minutes;
    }
    if( seconds < 10) {
        seconds = '0' + seconds ;
    }

    var ymdhis = "";
    ymdhis += year + "-";
    ymdhis += month+ "-";
    ymdhis += date;
    if (isFull === true)
    {
        ymdhis += " " + hour + ":";
        ymdhis += minutes + ":";
        ymdhis += seconds;
    }
    return ymdhis;
}


function formatDate(curr_date) {
    //2012-09-13T03:16:46Z
    var year = curr_date.getUTCFullYear();
    var month = (curr_date.getUTCMonth() + 1);
    var day = curr_date.getUTCDate();
    var hours = curr_date.getUTCHours();
    var minutes = curr_date.getUTCMinutes();
    var second = curr_date.getUTCSeconds();
    //var second = '20';
    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }

    if (hours < 10) {
        hours = '0' + hours;
    }

    if (minutes < 10) {
        minutes = '0' + minutes;
    }

    if (second < 10) {
        second = '0' + second;
    }
    return year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + second + 'Z';
}

function getRequestParameter(accountId, token, paramsObj) {
    var timestamp = formatDate(new Date());
    var message = accountId + '\n' + timestamp + '\n';// + "" + '\n'
    var params = '';
    if (typeof(paramsObj) != 'undefined') {
        params = '<params>'
        $.each(paramsObj, function (key, value) {
            params += '<' + key + '>' + value + '</' + key + '>';
            message += value + "\n";
        })
        params += '</params>';
    } else {
        message += "" + '\n';
    }
    var sig;
    if( token) {
        sig = signature(message, token);
    }
    var rst = '<request>' +
        '<account>' + accountId + '</account>' +
        '<timestamp>' + timestamp + '</timestamp>';
    if (adminInfo) {
        rst += '<sessionId>' + adminInfo.sessionId + '</sessionId>'
    }
    if( sig) {
        rst += '<signature>' + sig + '</signature>';
    }
    if (params != '') {
        rst += params;
    }
    rst += '<lang>' + localStorage.getItem('lang') + '</lang>' +
    '<platform>' + 'WINDOWS' + '</platform>' +
    '<clientIP></clientIP>' +
    '</request>';
    return rst;
}

function generateParmXML(obj) {
    var parmXML = '<request>';
    $.each(obj, function (key, value) {
        parmXML += '<' + key + '>' + value + '</' + key + '>';
    });
    parmXML += '</request>';
    return parmXML;
}

function showDialog(url, title, open, size) {
    var id = 'dialogMachine';
    if (typeof(size) == 'undefined') {
        size = 'modal-sm';
    } else {
        if (size != 'modal-sm' && size != 'modal-lg') {
            size = "";
        }
    }

    var html = '<div id="' + id + '" class="modal fade text-center">';
    html += '<div class="modal-dialog';
    if (size != '') {
        html += ' ' + size;
    }
    html += '" style="display: inline-block;">';
    html += '<div class="modal-content">';
    html += '<div class="modal-header" style="background-color: #555;">';
    html += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" style="color: ivory;">&times;</button>';
    html += '<h4 class="modal-title" style="color: ivory;">' + title + '</h4>';
    html += '</div>';
    html += '<div class="modal-body">';
    html += '<div class="embed-responsive embed-responsive-4by3">';
    html += '<iframe id="' + id + '_frame"  onload="iframeLoaded(\'' + id + '\',\'' + size + '\')" style="border: 0; width: 100%;" src="' + url;
    if (url.indexOf('?') == -1) {
        html += "?";
    } else {
        html += "&";
    }
    html += "dialogId=" + id + '"/>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    window.top.$('#dialog_dock').append(html);
    var dialog = window.top.$("#" + id);
    dialog.modal({
        show: open
    }).on("hidden.bs.modal", function (e) {
        e.currentTarget.remove();
    }).on("shown.bs.modal", function (e) {
        if (typeof ($('body').data('fv_open_modals')) == 'undefined') {
            $('body').data('fv_open_modals', 0);
        }
        // if the z-index of this modal has been set, ignore.
        if ($(this).hasClass('fv-modal-stack')) {
            return;
        }

        $(this).addClass('fv-modal-stack');
        window.top.$('body').data('fv_open_modals', $('body').data('fv_open_modals') + 1);

        $(this).css('z-index', 1040 + (10 * $('body').data('fv_open_modals')));
        window.top.$('.modal-backdrop').not('.fv-modal-stack').css('z-index', 1039 + (10 * $('body').data('fv_open_modals')));
        window.top.$('.modal-backdrop').not('fv-modal-stack').addClass('fv-modal-stack');
    });

    return id;
}

function refreshWindow(id) {
    var tabId = '#' + id;
    var content = window.top.$(tabId)[0].contentWindow;
    content.location.reload();
}


function closeDialog(id) {
    var dialog = window.top.$("#" + id);
    dialog.modal("hide");
}

function showErrorDialog(msg) {
    var dialog = window.top.$("#error_dialog");
    var p = dialog.find("p");
    p.empty();
    p.append(msg);
    dialog.modal("show");
}


function iframeLoaded(id, size) {

    var iframe = window.document.getElementById(id + "_frame");
    if (size == 'modal-sm') {
        $("#" + id + "_frame").height("auto");
    } else {
        $("#" + id + "_frame").height("40%");
    }
}


function statusCodeTranslate(statusCode) {
    var status = $.i18n.prop('unknow_status');
    if (statusCode == 0) {
        status = $.i18n.prop('success_status');
    } else if (statusCode == 256) {
        status = $.i18n.prop('wrong_signature_status');
    } else if (statusCode == 257) {
        status = $.i18n.prop('user_no_exist_status');
    } else if (statusCode == 258) {
        status = $.i18n.prop('inactivated_user_status');
    } else if (statusCode == 260 || statusCode == 261) {
        status = $.i18n.prop('timestamp_error_status');
    } else if (statusCode == 262) {
        status = $.i18n.prop('invalid_parameter_status');
    } else if (statusCode == 517) {
        status = $.i18n.prop('permisson_denied_status');
    } else if (statusCode == 1289) {
        status = $.i18n.prop('user_existed_status');
    } else if (statusCode == 1290) {
        status = $.i18n.prop('exits_binding_machine_status');
    } else if (statusCode == 1283) {
        status = $.i18n.prop('account_existed_status');
    } else if (statusCode == 24578) {
        status = $.i18n.prop('company_existed_status');
    } else if(statusCode == 1038){
        status = $.i18n.prop('wrong_password_status');
    }
    return status;
}


/**
 *
 * @param v
 * @returns {
 *  0 : "密码不能为空"
 *  1 : "密码至少8个字符,最多12个字符"
 *  2 : "密码必须含有数字"
 *  3 : "密码必须含有字母"
 *  4 : "pass password check"
 * }
 */
function checkpassword(v) {
    var numasc = 0;
    var charasc = 0;
    var otherasc = 0;
    if (0 == v.length) {
        return 0;
    } else if (v.length < 8 || v.length > 12) {
        return 1;
    } else {
        for (var i = 0; i < v.length; i++) {
            var asciiNumber = v.substr(i, 1).charCodeAt();
            if (asciiNumber >= 48 && asciiNumber <= 57) {
                numasc += 1;
            }
            if ((asciiNumber >= 65 && asciiNumber <= 90) || (asciiNumber >= 97 && asciiNumber <= 122)) {
                charasc += 1;
            }
            if ((asciiNumber >= 33 && asciiNumber <= 47) || (asciiNumber >= 58 && asciiNumber <= 64) || (asciiNumber >= 91 && asciiNumber <= 96) || (asciiNumber >= 123 && asciiNumber <= 126)) {
                otherasc += 1;
            }
        }
        if (0 == numasc) {
            return 2;
        } else if (0 == charasc) {
            return 3;
        } else {
            return 4;
        }
    }
};

function onValidEmail(email) {
    var patten = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    return patten.test(email);
}

function verifyStatusCode(statusCode) {
    var flag = true;
    switch (statusCode) {
        case  TIMEOUTCODE :
            window.parent.showTimeoutDialog();
            flag = false;
            break;
        case USERLIMIT :
            window.parent.showUserLimitDialog();
            flag = false;
            break;
        case WRONGSIGNATURE :
            window.parent.showStatusCodeDialog(statusCodeTranslate(statusCode));
            flag = false;
            break;
    }
    return flag;
}

function openOperationDialog(title, dialogUrl,size) {
    var dialogSize = 'modal-lg';
    if( size) {
        dialogSize = size;
    }
    showDialog(dialogUrl, title, true, dialogSize);
/*    var admin = ' ';
    if (adminInfo) {
        admin = adminInfo.accountId;
    }
    var token = sessionStorage.getItem("token");
    var req = getRequestParameter(admin, token);
    $.ajax({
        url: '/proxy',
        type: 'get',
        data: {
            url: "api/admin/checkTimeout",
            param: req
        },
        success: function (response) {
            response = $.parseJSON(response);
            if (response.token) {
                sessionStorage.setItem('token', response.token);
            }
            if(!verifyStatusCode(response.statusCode)) {
                return;
            }
            if( response.statusCode == 0) {

            }
        },

        error: function (jqXHR, textStatus, errorThrown) {
            showErrorDialog(textStatus + ":" + jqXHR.status + " " + errorThrown);
        }
    });*/

}

var generateTable = function(element,paramsObj,columnArray,list){
    $("#"+element).bootstrapTable({
        method: 'get',
        url: '/proxy',
        queryParams: function (params) {
            token = sessionStorage.getItem("token"),
            params.url =paramsObj.url;
            params.param = getRequestParameter(paramsObj.user, token,paramsObj.param);
            return params;
        },
        responseHandler: function (res) {
            if (res.token) {
                token = sessionStorage.setItem('token', res.token);
            }
            if(!verifyStatusCode(res.statusCode)){return;}
            if (res.statusCode == 0) {
                var obj_array = new Array();
                $.each(res[''+list+''], function (key, value) {
                    for (var i in value){
                        if(typeof value[i]=="object"){
                            for (var j in value[i]){
                                value[j] = (value[i])[j];
                            }
                        }

                    }
                    obj_array.push(value);

                });
                return obj_array;
            } else {
                showErrorDialog("error : " + statusCodeTranslate(res.statusCode));
                return false;
            }
        },
        search: true,
        showColumns: false,
        sortName: 'roleLevel',
        sortOrder: 'desc',
        cache: true,
        mobileResponsive: true,
        checkOnInit:true,
        filterShowClear:true,
        showRefresh: true,
        pagination: true,
        toolbar: '#toolbar',
        columns:columnArray,
        filterControl:true,
        onLoadError: function (response) {
            if (response != 0) {
                showErrorDialog($.i18n.prop('operation_failure') + ': ' + status);
            }
            return;
        }
    });
}
