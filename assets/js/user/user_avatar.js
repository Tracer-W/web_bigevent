$(function() {
    var layer = layui.layer;
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image');
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    };

    // 1.3 创建裁剪区域
    $image.cropper(options);
    // 2.为上传按钮绑定点击事件
    $('#btnChooseImage').on('click', function() {
        $('#file').click();
    });
    // 3.实现裁剪区图片替换
    // 3.1给文件选择绑定change事件
    $('#file').on('change', function(e) {
        // 3.1.1获取用户选择的文件
        var filelist = e.target.files;
        // 3.1.2 如果没拿到图片
        if (filelist.length === 0) {
            return layer.msg('请选择照片！'); //提前导入layer
        }
        // 3.2拿到了图片 按照cropper指示更换裁剪图片
        // 3.2.1拿到用户选择的文件
        var file = e.target.files[0];
        // 3.2.2 根据选择的文件，创建一个对应的 URL 地址
        var imgURL = URL.createObjectURL(file);
        // 3.2.3 重新初始化裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgURL) // 重新设置图片路径
            .cropper(options); // 重新初始化裁剪区域
    });
    // 4.给确定按钮绑定点击事件
    $('#btnUpload').on('click', function() {
        // 4.1将裁剪后的图片，输出为 base64 格式的字符串
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png'); // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // 4.2 调用接口，把头像上传到服务器
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL, //请求体参数
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更换头像失败！');
                }
                layer.msg('更换头像成功！');
                window.parent.getUserInfo();
            }
        });
    });
});