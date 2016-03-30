/**
 * Created by Bens on 2015/4/24.
 */
$(document).ready(function() {
    if(localStorage){
        if(localStorage.lang) {
            loadBundles(localStorage.lang);
        } else {
            loadBundles($.i18n.browserLang());
        }
    }else{
        loadBundles($.i18n.browserLang());
    }
});

var elementId = ['welcome','language', 'logout', 'reset_password', 'reset_user_information','binding_machine_buttom',
    'unbinding_machine_buttom','unregister_button','delete_but','replace_button','sure_button','modify_button','machineName','machineId','accountId','bind','login',
    'remove_binding','remove_binding_msg','unregister_machine_msg','unregister_emelopee_msg','delete_department_msg','delete_admin_account_msg','delete_admin_account_but',
    'fistname_input_title','lastname_input_title','role_input_title','account_input_title','old_password_title','new_password_title','comfirm_password_title',
    'security_question_title','security_answer_title','department_name_title','department_description_title','set_security_question_title','set_password_title','your_email_address',
    'activate_condor_account_title','activate_success_message','click_to_login'];

function loadBundles(lang) {
    localStorage.lang = lang;
    $.i18n.properties({
        name: 'strings',
        path: '/i18n/',
        mode: 'both',
        language: lang,
        callback: function() {
            $.each(elementId,function(key,val){
                var id = "#" + val;
                if( $(id)){

                    $(id).text($.i18n.prop(val));
                    $(id).attr('title',$.i18n.prop(val));
                }
                var iframeContents = $("#iframepage").contents();
                if( iframeContents.find(id)) {
                    iframeContents.find(id).text($.i18n.prop(val));
                    iframeContents.find(id).attr('title',$.i18n.prop(val));
                }
            });
        }
    });
}