$(function() {
    // 校验密码规则
    var form = layui.form;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function(value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同！';
            }
        },
        rePwd: function(value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致！';
            }
        }
    });

    // 发起ajax请求重置密码
    $('.layui-form').on('submit', function(e) {
        // 阻止默认行为
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            //   快速获取表元数据serialize
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新密码失败！');
                }
                layui.layer.msg('更新密码成功！');
                // 重置表单
                $('.layui-form')[0].reset();
            }
        })
    })
});