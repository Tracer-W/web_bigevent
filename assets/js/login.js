$(function() {
    // 1-1点击去注册切换到注册页面
    $('#link_reg').on('click', function() {
        $('.login-box').hide();
        $('.reg-box').show();
    });
    // 1-2点击去登录切换到登录页面
    $('#link_login').on('click', function() {
        $('.login-box').show();
        $('.reg-box').hide();
    });
    // 2.对密码进行校验
    // 2.1从layui中获取form对象来
    var form = layui.form;
    // 3.3导入layer
    var layer = layui.layer;
    // 2.2 通过 form.verify() 函数自定义校验规则
    form.verify({
        // 自定义了一个叫做 pwd 校验规则(数组格式)
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 校验两次密码是否一致的规则(函数格式)
        repwd: function(value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败,则return一个提示消息即可
            var pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致！';
            }
        }
    });

    // 3.注册提交
    $('#form_reg').on('submit', function(e) {
        // 3.1. 阻止默认的提交行为 
        e.preventDefault();
        // 3.2. 发起Ajax的POST请求 
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        $.post(
            '/api/reguser',
            data,
            function(res) { // 通过res拿到服务器响应的数据
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('注册成功，请登录！');
                // 模拟人的点击行为注册成功 后直接跳到登陆页面
                $('#link_login').click();
            }
        );
    });
    // 4.登陆提交:使用submit
    $('#form_login').submit(function(e) {
        // 4.1 阻止默认行为
        e.preventDefault();
        // 4.2 发起ajax请求
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！');
                }
                layer.msg('登录成功！');
                // 将登录成功得到的 token 字符串，保存到 localStorage 中
                localStorage.setItem('token', res.token);
                // 跳转到后台主页
                location.href = '/index.html';
            }
        });
    });
});