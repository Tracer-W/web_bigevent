$(function() {
    // 1.表单文本验证
    // 1.1导入form
    var form = layui.form;
    // 2.2导入layer
    var layer = layui.layer;
    // 1.2 验证规则
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！';
            }
        }
    });
    // 2.3调用 initUserInfo 函数
    initUserInfo();
    // 2.获取用户信息：初始化用户基本信息
    function initUserInfo() {
        // 2.1发起ajax请求获取信息
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    // 要先导入layer
                    return layer.msg('获取用户信息失败！');
                }
                // console.log(res);
                // 2.4 调用form.val()快速为表单赋值
                form.val('formUserInfo', res.data);
            }
        });
    }
    // 3.重置功能：重置表单数据
    $('#btnReset').on('click', function(e) {
        // 阻止表单默认行为
        e.preventDefault();
        // 调用
        initUserInfo();
    });
    // 4.发起请求更新用户的信息:监听表单的提交事件
    $('.layui-form').on('submit', function(e) {
        // 阻止表单的默认提交行为
        e.preventDefault();
        // 发起 ajax 数据请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！');
                }
                layer.msg('更新用户信息成功！');
                // 调用父页面中的方法，重新渲染用户的头像和用户的信息
                window.parent.getUserInfo();
            }
        })
    })
});