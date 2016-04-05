<%@page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8" %>
<%
    String department_name = (String)request.getAttribute("department_name");
    String department_title = (String)request.getAttribute("department_title");
%>
<!DOCTYPE html>
<html style="height: 100%; width: 100%">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no"/>
    <title>Condor Login</title>
    <script src="../js/jquery-1.10.2.js"></script>
    <script src="../js/bootstrap.js"></script>
    <!-- i18n support multi language-->
    <script src="../js/hmac-sha256.js"></script>
    <script src="../js/enc-base64.js"></script>
    <script src="../js/util.js"></script>
    <script src="../js/jquery.i18n.properties-1.0.9.js"></script>
    <script src="../i18n/ElementLanguage.js"></script>
    <link rel="icon" href="../img/logo-white.png" type="image/x-icon">
    <link rel="stylesheet" href="../css/bootstrap.css"/>
    <link rel="stylesheet" href="../css/signin.css" type="text/css" media="screen"/>
    <link rel="stylesheet" href="../css/elements.css" type="text/css">
    <script type="application/javascript" language="JavaScript">

        var departmentName = '<%=department_name%>';
        $(document).ready(function () {
            if (localStorage) {
                if (localStorage.lang) {
                    loadBundles(localStorage.lang);
                } else {
                    loadBundles($.i18n.browserLang());
                }
            } else {
                loadBundles($.i18n.browserLang());
            }
            sessionStorage.setItem('departmentName',departmentName);
            $("#title_logo").attr('src','../img/SD_condor.png');
            $("#logo").attr('src','../img/logo-white.png');
            $("#username").attr('placeholder', $.i18n.prop('placeholder_username'));
            $("#password").attr('placeholder', $.i18n.prop('placeholder_password'));
            $("#username").focus();
            $("#login").click(function () {
                if (!validate()) {
                    return;
                }
                submit();
            });

            $("input").keypress(function (event) {
                if (event.which == 13) {
                    if (!validate()) {
                        return;
                    }
                    submit();
                }
            });

            $('#username').popover({
                trigger: 'manual',
                content: $.i18n.prop('input_username'),
                placement: 'right'
            });

            $('#password').popover({
                trigger: 'manual',
                content: $.i18n.prop('input_password'),
                placement: 'right'
            });

        });

        function reloadLanguage(language) {
            loadBundles(language);
            location.reload(true);
        }


        function validate() {
            if ($("#username").val() == "") {
                $("#username").focus();
                $('#username').popover("show");
                setTimeout(function () {
                    $('#username').popover("hide");
                }, 4000);
                return false;
            }
            if ($("#password").val() == "") {
                $("#password").focus();
                $('#password').popover("show");
                setTimeout(function () {
                    $('#password').popover("hide");
                }, 4000);
                return false;
            }

            return true;
        }
        function submit() {
            var admin = $("#username").val();
            var password = $("#password").val();
            var parm = {'departmentName':departmentName};
            var req = getRequestParameter(admin, password,parm);
            $.ajax({
                type: 'get',
                data: {
                    'url': 'api/manage/login',
                    'param': req
                },
                url: '/proxy',
                beforeSend: function () {
                    $("#login").text($.i18n.prop('processing') + '....');
                    $("#login").attr("disabled", "true");
                    $("#username").attr("disabled", "true");
                    $("#password").attr("disabled", "true");
                },
                success: function (response) {
                    response = jQuery.parseJSON(response);
                    var token = response.token;
                    if( token){
                        sessionStorage.setItem("token", token);
                    }
                    if (response.statusCode != 0) {
                        var errorMsg = response.statusCode;
                        if (response.statusCode == 256 || response.statusCode == 257) {
                            errorMsg = $.i18n.prop('username_password_wrong');
                        } else {
                            errorMsg = statusCodeTranslate(response.statusCode);
                        }
                        $('#popup .text-warning').text(errorMsg);
                        $('#popup').modal('show');
                        $("#login").text($.i18n.prop('login'));
                        $("#username").removeAttr("disabled");
                        $("#password").removeAttr("disabled");
                        $("#login").removeAttr("disabled");
                        return;
                    } else {
                        sessionStorage.setItem("adminInfo",JSON.stringify(response.accountInfo));
                        window.location.href = "/index.html";
                    }
                },

                error: function (jqXHR, textStatus, errorThrown) {
                    $('#popup .text-warning').text($.i18n.prop('login_failure') + "：" + jqXHR.statusText);
                    $('#popup').modal('show');
                    $("#login").text($.i18n.prop('login'));
                    $("#login").removeAttr("disabled");
                    $("#username").removeAttr("disabled");
                    $("#password").removeAttr("disabled");
                }
            });
        }

    </script>
    <style>
        .language a {
            padding-right: 10px;
        }
        .language {
            padding-top: 5px; z-index: 1000;
        }
    </style>
</head>
<body class="login-bg">

<div class="login-wrapper">
    <div>
        <div class="col-md-offset-10 col-md-2 language">
            <a href="#" onclick='reloadLanguage("zh-cn")'>简体中文 </a>
            <a href="#" onclick='reloadLanguage("zh-hk")'>繁體中文 </a>
            <a href="#" onclick='reloadLanguage("en")'>English</a>
        </div>
    </div>
    <a href="#">
        <img class="logo" id="title_logo" style="margin-top: 30px;">
    </a>
    <br>
    <a href="#">
        <img class="logo" id="logo">
    </a>

    <h4 style="color:#ffffff;margin-bottom: 20px;"><%=department_title%> CONDOR MANAGEMENT</h4>

    <div class="box">
        <div class="content-wrap">
            <h6><label id="welcome" style="align-content: center"></label></h6>
            <input class="form-control" id="username" type="text" placeholder="用户名">
            <input class="form-control" id="password" type="password" placeholder="密码" autocomplete="off">
            <button class="btn-glow primary login" id="login" href="#"></button>


        </div>
        <div align="center" style=" margin-top: 15px;margin-right: 5px;"><a href="#" id="forgetPw">Forget Password?</a></div>
        <div align="right" style=" margin-top: 30px;margin-right: 15px;">version:1.0</div>
    </div>
</div>

<div class="modal fade" id="popup" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-sm">
        <div class="modal-content">
            <div class="modal-body">
                <button type="button" class="close" data-dismiss="modal">
                    <span aria-hidden="true">&times;</span><span class="sr-only">Close</span>
                </button>
                <p style="margin : 10px;" class="text-warning text-center"></p>
            </div>
        </div>
    </div>
</div>
</body>
</html>